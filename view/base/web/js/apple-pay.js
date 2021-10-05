/**
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is provided with Magento in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * Copyright © 2021 MultiSafepay, Inc. All rights reserved.
 * See DISCLAIMER.md for disclaimer details.
 *
 */
define([
    'jquery',
    'mage/translate',
    'Magento_Customer/js/customer-data',
    'multisafepayCardPaymentProcessor',
    'multisafepayUtils',
    'Magento_Checkout/js/model/quote',
    'MultiSafepay_ConnectFrontend/js/action/get-apple-merchant-session'
], function (
    $,
    $t,
    customerData,
    multisafepayCardPaymentProcessor,
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
                    console.log($t("Quote data is not full."));
                    deferred.resolve(false, false);

                    return;
                }

                let applePayVersion = this.getAvailableApplePayVersion();

                if (!applePayVersion) {
                    console.log($t("Apple Pay doesn't support this device."));
                    deferred.resolve(false, false);
                }

                let details = {
                    displayItems: this.getTotalItems(paymentRequestData),
                    requiredShippingContactFields: ["postalAddress"],
                    currencyCode: paymentRequestData.currency,
                    countryCode: quote.billingAddress().countryId,
                    total: {
                        label: $t("Total"),
                        type: "final",
                        amount: paymentRequestData.cartTotal ?
                            paymentRequestData.cartTotal
                            : cartData.grandTotalAmount
                    },
                    supportedNetworks: this.getPaymentMethods(),
                    merchantCapabilities: ["supports3DS"]
                };

                let session = new ApplePaySession(applePayVersion, details);
                session.onvalidatemerchant = function (event) {
                    var promise = self.performValidation(
                        event.validationURL,
                        applePayButtonData.getMerchantSessionUrl
                    );

                    promise.then(function (merchantSession) {
                        session.completeMerchantValidation(JSON.parse(merchantSession.session));
                    });
                }

                // session.onshippingmethodselected = event => {
                //     // Define ApplePayShippingMethodUpdate based on the selected shipping method.
                //     // No updates or errors are needed, pass an empty object.
                //     const update = {};
                //     session.completeShippingMethodSelection(update);
                // };

                // session.onshippingcontactselected = event => {
                //     // Define ApplePayShippingContactUpdate based on the selected shipping contact.
                //     const update = {};
                //     session.completeShippingContactSelection(update);
                // };

                session.onpaymentauthorized = event => {
                    deferred.resolve(event.payment, session);
                };

                session.oncancel = event => {
                    console.log('starting session.cancel');
                    deferred.resolve(false, session);
                };

                session.begin();
            } else {
                console.log($t("Apple Pay direct doesn't available. Please, try again."));
                deferred.resolve(false, false);
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
            let values = Object.values(paymentRequest.cartItems);

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

            let additionalItems = paymentRequest.additionalTotalItems;

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
            let availableVersions =  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            let result = false;

            availableVersions.forEach(function(version) {
                if (window.ApplePaySession.supportsVersion(version)) {
                    result = version;
                }
            });

            return result;
        }
    };
});
