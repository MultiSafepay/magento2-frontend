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
    'Magento_Checkout/js/model/quote',
    'multisafepayCardPaymentProcessor',
    'multisafepayUtils',
    'multisafepayCreditCardComponentLib'
], function (
    $,
    $t,
    customerData,
    quote,
    multisafepayCardPaymentProcessor,
    multisafepayUtils,
    multisafepayCreditCardComponentLib
) {
    'use strict';

    return {
        /**
         *
         * @param paymentCode
         * @param deferred
         */
        init: function (paymentCode) {
            let paymentRequestData = customerData.get('multisafepay-payment-request')();
            let cartData = customerData.get('cart')();

            if (paymentRequestData && paymentRequestData.creditCardComponent) {
                if (!paymentRequestData.cardsConfig.hasOwnProperty(paymentCode)) {
                    console.log($t("Payment data for selected payment method wasn\'t found."));
                    // deferred.resolve(false);

                    return;
                }

                console.log(this.getOrderData(paymentRequestData));

                const MSP = new MultiSafepay({
                    env : paymentRequestData.environment,
                    apiToken : paymentRequestData.apiToken,
                    order : this.getOrderData(paymentRequestData)
                });

                MSP.init('payment', {
                    container: '#' + paymentRequestData.cardComponentContainerId + '-' + paymentCode,
                    gateway: 'CREDITCARD',
                    onLoad: state => {
                        console.log('onLoad', state);
                    },
                    onError: state => {
                        console.log('onError', state);
                    }
                });

                // if (!cartData.grandTotalAmount && !paymentRequestData.cartTotal) {
                //     console.log($t("Quote data is not full."));
                //     deferred.resolve(false);
                //
                //     return;
                // }
                //
                // let paymentData = paymentRequestData.cardsConfig[paymentCode],
                //     methodData = this.getPaymentMethods(paymentData),
                //     displayItems = this.getTotalItems(paymentRequestData);
                //
                // let details = {
                //     displayItems: displayItems,
                //     total: {
                //         label: $t("Total"),
                //         amount: {
                //             currency: paymentRequestData.currency,
                //             value: paymentRequestData.cartTotal ?
                //                 paymentRequestData.cartTotal
                //                 : cartData.grandTotalAmount
                //         },
                //     }
                // };
                //
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
                // deferred.resolve(false);
            }
        },

        /**
         *
         * @param paymentRequestData
         * @returns {{template: {settings: {embed_mode: boolean}}, amount: number, currency, customer: {country, locale}}}
         */
        getOrderData: function (paymentRequestData) {
            return {
                customer: {
                    locale: paymentRequestData.locale,
                    country: quote.billingAddress().countryId
                },
                currency: paymentRequestData.currency,
                amount: paymentRequestData.cartTotal * 100,
                template: {
                    settings: {
                        embed_mode: true
                    }
                }
            }
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
                            amount: {
                                currency: paymentRequest.currency,
                                value: value.amount
                            }
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
