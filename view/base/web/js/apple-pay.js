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
    'Magento_Checkout/js/model/quote'
    // 'applePaySdk'
], function (
    $,
    $t,
    customerData,
    multisafepayCardPaymentProcessor,
    multisafepayUtils,
    quote
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
                        amount: {
                            currency: paymentRequestData.currency,
                            value: paymentRequestData.cartTotal ?
                                paymentRequestData.cartTotal
                                : cartData.grandTotalAmount
                        },
                    },
                    supportedNetworks: ['amex', 'masterCard', 'visa' ],
                    merchantCapabilities: [ 'supports3DS', 'supportsEMV', 'supportsCredit', 'supportsDebit' ]
                };

                console.log(details);

                var session = new ApplePaySession(1, details);

                // Merchant Validation
                session.onvalidatemerchant = function (event) {
                    logit(event);
                    // var promise = performValidation(event.validationURL);
                    // promise.then(function (merchantSession) {
                    //     session.completeMerchantValidation(merchantSession);
                    // });
                }

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
