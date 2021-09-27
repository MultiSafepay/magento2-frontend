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
    // 'applePaySdk'
], function (
    $,
    $t,
    customerData,
    multisafepayCardPaymentProcessor,
    multisafepayUtils,
    quote,
    getAppleMerchantSessionAction
    // applePaySdk
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
                // if (!paymentRequestData.cardsConfig.hasOwnProperty(paymentCode)) {
                //     console.log($t("Payment data for selected payment method wasn\'t found."));
                //     deferred.resolve(false);
                //
                //     return;
                // }

                if (!cartData.grandTotalAmount && !paymentRequestData.cartTotal) {
                    console.log($t("Quote data is not full."));
                    deferred.resolve(false);

                    return;
                }

                // let paymentData = paymentRequestData.cardsConfig[paymentCode],
                //     methodData = this.getPaymentMethods(paymentData),
                let displayItems = this.getTotalItems(paymentRequestData);

                let details = {
                    displayItems: displayItems,
                    requiredShippingContactFields: ['postalAddress'],
                    currencyCode: paymentRequestData.currency,
                    countryCode: quote.billingAddress().countryId,
                    total: {
                        label: $t("Total"),
                        amount: paymentRequestData.cartTotal ?
                            paymentRequestData.cartTotal
                            : cartData.grandTotalAmount
                    },
                    supportedNetworks: ['amex', 'masterCard', 'visa'],
                    merchantCapabilities: ['supports3DS', 'supportsEMV', 'supportsCredit', 'supportsDebit']
                };

                console.log(window, details);
                var session = new ApplePaySession(10, details);

                console.log(session);

                // Merchant Validation
                session.onvalidatemerchant = function (event) {
                    console.log(event);
                    console.log(event.validationURL);
                    var promise = self.performValidation(
                        event.validationURL,
                        applePayButtonData.getMerchantSessionUrl
                    );

                    promise.then(function (merchantSession) {
                        session.completeMerchantValidation(merchantSession);
                    });
                }

                session.onpaymentmethodselected = event => {
                    // Define ApplePayPaymentMethodUpdate based on the selected payment method.
                    // No updates or errors are needed, pass an empty object.
                    const update = {};
                    session.completePaymentMethodSelection(update);
                };

                session.onshippingmethodselected = event => {
                    // Define ApplePayShippingMethodUpdate based on the selected shipping method.
                    // No updates or errors are needed, pass an empty object.
                    const update = {};
                    session.completeShippingMethodSelection(update);
                };

                session.onshippingcontactselected = event => {
                    // Define ApplePayShippingContactUpdate based on the selected shipping contact.
                    const update = {};
                    session.completeShippingContactSelection(update);
                };

                session.onpaymentauthorized = event => {
                    // Define ApplePayPaymentAuthorizationResult
                    const result = {
                        "status": ApplePaySession.STATUS_SUCCESS
                    };
                    session.completePayment(result);
                };

                session.oncancel = event => {
                    console.log('starting session.cancel');
                    console.log(event);
                };

                session.begin();

                // let paymentRequestApi = new PaymentRequest(methodData, details);
                //
                // /**
                //  * payment process
                //  */
                // paymentRequestApi.show().then(function (paymentResponse) {
                //     if (!paymentResponse.methodName) {
                //         console.log($t("Not valid response"));
                //         paymentResponse.complete('fail');
                //     }
                //
                //     let encryptedData = multisafepayCardPaymentProcessor.process(
                //         paymentRequestApi,
                //         paymentResponse,
                //         paymentCode,
                //         paymentRequestData
                //     );
                //
                //     deferred.resolve(encryptedData);
                // }).catch(function (error) {
                //     console.log(error);
                //     deferred.resolve(false);
                // });
            } else {
                console.log($t("Payment Request Api data not available for selected payment method."));
                deferred.resolve(false);
            }
        },

        performValidation: function (validationUrl, serviceUrl) {
            // return new Promise(function (resolve, reject) {
            //     let xhr = new XMLHttpRequest();
            //     xhr.onload = function () {
            //         var data = JSON.parse(this.responseText);
            //         console.log(data);
            //         resolve(data);
            //     };
            //     xhr.onerror = reject;
            //     xhr.open('GET', 'apple_pay_comm.php?u=' + valURL);
            //     xhr.send();
            // });

            return getAppleMerchantSessionAction(serviceUrl, validationUrl);

            // $.when(getAppleMerchantSessionAction(serviceUrl, validationUrl)).done(
            //     function () {
            //         self.afterPlaceOrder();
            //
            //         if (self.redirectAfterPlaceOrder) {
            //             redirectOnSuccessAction.execute();
            //         }
            //     }
            // ).always(function () {
            //     }
            // );
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
         * @param paymentData
         * @returns {[]}
         */
        getPaymentMethods: function (paymentData) {
            let methodData = [];

            if (paymentData.prePaid) {
                types.push("prepaid");
            }

            methodData.push({
                supportedMethods: 'basic-card',
                data: {
                    supportedNetworks: paymentData.flags,
                    supportedTypes: paymentData.types
                }
            });

            return methodData;
        }
    };
});
