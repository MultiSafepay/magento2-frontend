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
    'multisafepayCreditCardComponentLib'
], function (
    $,
    $t,
    customerData,
    quote,
    multisafepayCreditCardComponentLib
) {
    'use strict';

    return {
        /**
         *
         * @param paymentCode
         * @param paymentRequestData
         * @param cardConfig
         * @returns {{}|MultiSafepay}
         */
        init: function (paymentCode, paymentRequestData, cardConfig) {
            if (paymentCode && paymentRequestData) {
                if (!cardConfig) {
                    console.log($t("Payment data for selected payment method wasn\'t found."));

                    return;
                }

                const MSP = new MultiSafepay({
                    env : paymentRequestData.environment,
                    apiToken : paymentRequestData.apiToken,
                    order : this.getOrderData(paymentRequestData)
                });

                MSP.init('payment', {
                    container: '#' + paymentRequestData.cardComponentContainerId + '-' + paymentCode,
                    gateway: cardConfig.gatewayCode,
                    onLoad: state => {
                        console.log('onLoad', state);
                    }
                });

                return MSP;
            } else {
                console.log($t("Credit Card component data not available for selected payment method."));
            }

            return {};
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
        }
    };
});
