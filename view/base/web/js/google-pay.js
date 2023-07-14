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
    'Magento_Checkout/js/model/quote'
], function (
    $,
    $t,
    customerData,
    multisafepayPaymentProcessor,
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

                const paymentDataRequest = Object.assign({}, this.getGooglePayBaseRequest());
                paymentDataRequest.allowedPaymentMethods = [
                    this.getGooglePayCardPaymentMethodData().cardPaymentMethod
                ];

                let totalAmount = paymentRequestData.cartTotal ?
                    parseFloat(paymentRequestData.cartTotal).toFixed(2) :
                    parseFloat(cartData.grandTotalAmount).toFixed(2);

                paymentDataRequest.transactionInfo = {
                    totalPriceStatus: 'FINAL',
                    totalPrice: totalAmount,
                    currencyCode: paymentRequestData.currency,
                    countryCode: quote.billingAddress().countryId
                };

                paymentDataRequest.merchantInfo = this.getMerchantInfo();

                paymentsClient.loadPaymentData(paymentDataRequest).then(function (paymentData) {
                    deferred.resolve(paymentData.paymentMethodData.tokenizationData.token, false);
                }).catch(function (err) {
                    deferred.resolve(false, err);
                });
            } else {
                deferred.resolve(false, $t("Google Pay direct doesn't available. Please, try again."));
            }
        },

        /**
         *
         * @returns {{merchantId: string, merchantName: string}}
         */
        getMerchantInfo: function () {
            let googlePayButtonData = customerData.get('multisafepay-payment-request')().googlePayButton;

            if (googlePayButtonData.mode === 'TEST') {
                return {
                    merchantName: 'Example Merchant',
                    merchantId: '12345678901234567890'
                };
            } else {
                return {
                    merchantName: googlePayButtonData.merchantInfo.merchantName,
                    merchantId: googlePayButtonData.merchantInfo.merchantId
                };
            }
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
         * @returns {{cardPaymentMethod: {tokenizationSpecification: {type: string, parameters: {gatewayMerchantId: string|*, gateway: string}}} & {type: string, parameters: {allowedAuthMethods: [string, string], allowedCardNetworks: string[]}}, baseCardPaymentMethod: {type: string, parameters: {allowedAuthMethods: [string, string], allowedCardNetworks: string[]}}}}
         */
        getGooglePayCardPaymentMethodData: function () {
            let googlePayButtonData = customerData.get('multisafepay-payment-request')().googlePayButton;

            const tokenizationSpecification = {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                    'gateway': 'multisafepay',
                    'gatewayMerchantId': googlePayButtonData.accountId
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
