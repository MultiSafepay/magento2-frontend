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
], function (
    $,
    $t,
    customerData,
    multisafepayCardPaymentProcessor,
    multisafepayUtils,
    quote
) {
    'use strict';

    return {
        /**
         *
         * @param deferred
         * @param paymentsClient
         */
        init: function (deferred, paymentsClient) {
            deferred = deferred || $.Deferred();
            let paymentRequestData = customerData.get('multisafepay-payment-request')();
            let googlePayButtonData = paymentRequestData.googlePayButton;
            let cartData = customerData.get('cart')();

            if (paymentRequestData && googlePayButtonData.isActive) {
                if (!cartData.grandTotalAmount && !paymentRequestData.cartTotal) {
                    deferred.resolve(false, $t("Quote data is not full."));

                    return;
                }

                console.log(paymentsClient);

                const paymentDataRequest = Object.assign({}, this.getGooglePayBaseRequest());
                paymentDataRequest.allowedPaymentMethods = [
                    this.getGooglePayCardPaymentMethodData().cardPaymentMethod
                ];

                let totalAmount = paymentRequestData.cartTotal ? paymentRequestData.cartTotal
                    : cartData.grandTotalAmount;

                paymentDataRequest.transactionInfo = {
                    totalPriceStatus: 'FINAL',
                    totalPrice: totalAmount.toString(),
                    currencyCode: paymentRequestData.currency,
                    countryCode: quote.billingAddress().countryId
                };

                paymentDataRequest.merchantInfo = this.getMerchantInfo();

                paymentsClient.loadPaymentData(paymentDataRequest).then(function(paymentData) {
                    deferred.resolve(paymentData.paymentMethodData.tokenizationData.token, false);
                }).catch(function(err){
                    deferred.resolve(false, err);
                });
            } else {
                deferred.resolve(false,  $t("Google Pay direct doesn't available. Please, try again."));
            }
        },

        /**
         *
         * @returns {{merchantId: string, merchantName: string}}
         */
        getMerchantInfo: function () {
            return {
                merchantName: 'Example Merchant',
                merchantId: '12345678901234567890'
            };
        },

        performValidation: function (validationUrl, serviceUrl) {
            return getAppleMerchantSessionAction(serviceUrl, validationUrl);
        },

        /**
         *
         * @returns {[string, string, string, string, string]}
         */
        getPaymentMethods: function () {
            let countryCode = quote.billingAddress().countryId,
                availableCountries = ["AMEX", "MASTERCARD", "VISA"];

            if (countryCode === 'BR') {
                availableCountries.push('MAESTRO');
            }

            return availableCountries;
        },

        /**
         *
         * @returns {{apiVersionMinor: number, apiVersion: number}}
         */
        getGooglePayCardPaymentMethodData: function () {
            const tokenizationSpecification = {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                    'gateway': 'multisafepay',
                    'gatewayMerchantId': '90258312'
                }
            };

            const allowedCardNetworks = this.getPaymentMethods();
            const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

            const baseCardPaymentMethod = {
                type: 'CARD',
                parameters: {
                    allowedAuthMethods: allowedCardAuthMethods,
                    allowedCardNetworks: allowedCardNetworks
                }
            };

            return {
                baseCardPaymentMethod: baseCardPaymentMethod,
                cardPaymentMethod: Object.assign(
                    {tokenizationSpecification: tokenizationSpecification},
                    baseCardPaymentMethod
                )
            }
        },

        /**
         *
         * @returns {{apiVersionMinor: number, apiVersion: number}}
         */
        getGooglePayBaseRequest: function () {
            return {
                apiVersion: 2,
                apiVersionMinor: 0
            };
        }
    };
});
