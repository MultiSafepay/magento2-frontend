/**
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is provided with Magento in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * See DISCLAIMER.md for disclaimer details.
 */
define([
    'jquery',
    'mage/translate',
    'Magento_Customer/js/customer-data',
    'multisafepayPaymentProcessor',
    'multisafepayUtils',
    'Magento_Checkout/js/model/quote',
    'MultiSafepay_ConnectFrontend/js/action/get-apple-merchant-session'
], function (
    $,
    $t,
    customerData,
    multisafepayPaymentProcessor,
    multisafepayUtils,
    quote,
    getAppleMerchantSessionAction
) {
    'use strict';

    return {
        /**
         *
         * @param paymentCode
         * @param deferred
         */
        init: function (paymentCode, deferred) {
            deferred = deferred || $.Deferred();
            let paymentRequestData = customerData.get('multisafepay-payment-request')();
            let applePayButtonData = paymentRequestData.applePayButton;
            let cartData = customerData.get('cart')();
            let self = this;

            if (paymentRequestData && applePayButtonData.isActive) {
                if (!cartData.grandTotalAmount && !paymentRequestData.cartTotal) {
                    deferred.resolve(false, false, $t("Quote data is not full."));

                    return;
                }

                let applePayVersion = this.getAvailableApplePayVersion();

                if (!applePayVersion) {
                    deferred.resolve(false, false, $t("Apple Pay doesn't support this device."));
                }

                let totalAmount = paymentRequestData.cartTotal ? paymentRequestData.cartTotal
                    : cartData.grandTotalAmount;

                let details = {
                    displayItems: this.getTotalItems(paymentRequestData),
                    currencyCode: paymentRequestData.currency,
                    countryCode: quote.billingAddress().countryId,
                    total: {
                        label: $t("Total"),
                        amount: totalAmount
                    },
                    "requiredBillingContactFields":[
                        "postalAddress"
                    ],
                    supportedNetworks: this.getPaymentMethods(),
                    merchantCapabilities: ["supports3DS"]
                };

                let session = new ApplePaySession(applePayVersion, details);
                session.onvalidatemerchant = event => {
                    var promise = self.performValidation(
                        event.validationURL,
                        applePayButtonData.getMerchantSessionUrl
                    );

                    promise.then(function (merchantSession) {
                        console.log(merchantSession, session);

                        if (merchantSession.status == 'error') {
                            deferred.resolve(false, session, $t(merchantSession.message));
                            session.abort();

                            return;
                        }

                        session.completeMerchantValidation(JSON.parse(merchantSession.session));
                    });
                }

                session.onpaymentmethodselected = event => {
                    session.completePaymentMethodSelection(
                        {
                            label: $t("Total"),
                            type: 'final',
                            amount: totalAmount
                        },
                        []
                    );
                };

                session.onpaymentauthorized = event => {
                    deferred.resolve(event.payment, session, false);
                };

                session.oncancel = event => {
                    console.log('starting session.cancel');
                    deferred.resolve(false, session, $t("Apple Pay session was cancelled."));
                };

                session.begin();
            } else {
                deferred.resolve(false, false, $t("Apple Pay direct isn't available. Please, try again."));
            }
        },

        performValidation: function (validationUrl, serviceUrl) {
            return getAppleMerchantSessionAction(serviceUrl, validationUrl);
        },

        /**
         *
         * @param paymentRequest
         * @returns {[]}
         */
        getTotalItems: function (paymentRequest) {
            let displayItems = [];
            let values = Object.values(paymentRequest.applePayButton.cartItems);

            for (let sku in values) {
                let cartItem = values[sku];

                displayItems.push({
                    label: cartItem.label,
                    amount: {
                        currency: paymentRequest.currency,
                        value: cartItem.price
                    }
                });
            }

            let additionalItems = paymentRequest.applePayButton.additionalTotalItems;

            if (additionalItems.length) {
                $(additionalItems).each(function (index, value) {
                    if (value.amount) {
                        displayItems.push({
                            label: value.label,
                            amount: value.amount
                        });
                    }
                });
            }

            return displayItems;
        },

        /**
         *
         * @returns {[string, string, string, string, string]}
         */
        getPaymentMethods: function () {
            return ["amex", "maestro", "masterCard", "visa", "vPay"];
        },

        /**
         *
         * @returns {boolean}
         */
        getAvailableApplePayVersion: function () {
            let availableVersions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            let result = false;

            availableVersions.forEach(function (version) {
                if (window.ApplePaySession.supportsVersion(version)) {
                    result = version;
                }
            });

            return result;
        }
    };
});
