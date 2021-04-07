define([
    'jquery',
    'ko',
    'underscore',
    'mageUtils',
    'Magento_Ui/js/lib/collapsible',
    'mage/translate',
    'Magento_Customer/js/customer-data',
    'multisafepayCardPaymentProcessor'
], function (
    $,
    ko,
    _,
    utils,
    Collapsible,
    $t,
    customerData,
    multisafepayCardPaymentProcessor
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
            let cartData = customerData.get('cart')();

            if (paymentRequestData && this.isAvailable() && paymentRequestData.enabled) {
                if (!paymentRequestData.cardsConfig.hasOwnProperty(paymentCode)) {
                    console.log($t("Payment data for selected payment method wasn\'t found."));
                    deferred.resolve(false);

                    return;
                }

                if (!cartData.grandTotalAmount && !paymentRequestData.cartTotal) {
                    console.log($t("Quote data is not full."));
                    deferred.resolve(false);

                    return;
                }

                let paymentData = paymentRequestData.cardsConfig[paymentCode],
                    methodData = this.getPaymentMethods(paymentData),
                    displayItems = this.getItems(paymentRequestData);

                let details = {
                    displayItems: displayItems,
                    total: {
                        label: $t("Total"),
                        amount: {
                            currency: paymentRequestData.currency,
                            value: paymentRequestData.cartTotal ?
                                paymentRequestData.cartTotal
                                : cartData.grandTotalAmount
                        },
                    }
                };

                let paymentRequestApi = new PaymentRequest(methodData, details);

                /**
                 * payment process
                 */
                paymentRequestApi.show().then(function (paymentResponse) {
                    if (!paymentResponse.methodName) {
                        console.log($t("Not valid response"));
                        paymentResponse.complete('fail');
                    }

                    let encryptedData = multisafepayCardPaymentProcessor.process(
                        paymentRequestApi,
                        paymentResponse,
                        paymentCode,
                        paymentRequestData
                    );

                    deferred.resolve(encryptedData);
                }).catch(function(error) {
                    deferred.resolve(false);
                });
            } else {
                console.log($t("Payment Request Api data not available for selected payment method."));
                deferred.resolve(false);
            }
        },

        /**
         *
         * @param paymentData
         * @returns {[]}
         */
        getPaymentMethods: function (paymentData) {
            var methodData = [];

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
        },

        /**
         *
         * @param paymentRequest
         * @returns {[]}
         */
        getItems: function (paymentRequest) {
            var displayItems = [];
            var values = Object.values(paymentRequest.cartItems);

            for (var sku in values) {
                var cartItem = values[sku];

                displayItems.push({
                    label: cartItem.label,
                    amount: {
                        currency: paymentRequest.currency,
                        value: cartItem.price
                    }
                });
            }

            if (paymentRequest.discount.amount) {
                displayItems.push({
                    label: paymentRequest.discount.label,
                    amount: {
                        currency: paymentRequest.currency,
                        value: paymentRequest.discount.amount
                    }
                });
            }

            return displayItems;
        },

        /**
         *
         * @returns {boolean}
         */
        isAvailable: function () {
            var sUsrAg = navigator.userAgent;
            if (sUsrAg.indexOf("Chrome") <= -1 && sUsrAg.indexOf("Safari") > -1) {
                return false;
            } else if (window.PaymentRequest) {
                return true;
            }
            return false;
        }
    };
});
