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
    'Magento_Checkout/js/model/quote',
    'multisafepayPaymentComponentLib'
], function (
    $,
    $t,
    customerData,
    quote,
    multisafepayPaymentComponentLib
) {
    'use strict';

    return {
        /**
         *
         * @param paymentCode
         * @param paymentRequestData
         * @param cardConfig
         * @returns {void|{}|MultiSafepay}
         */
        init: function (paymentCode, paymentRequestData, cardConfig) {
            if (paymentCode && paymentRequestData) {
                if (!cardConfig) {
                    console.log($t("Payment data for selected payment method wasn\'t found."));

                    return;
                }

                let paymentComponentData = {
                    env: paymentRequestData.environment,
                    apiToken: paymentRequestData.apiToken,
                    order: this.getOrderData(paymentRequestData, cardConfig.gatewayCode)
                }

                let recurringData = this.getRecurringData(cardConfig);

                if (recurringData) {
                    paymentComponentData.recurring = recurringData;
                }

                let multisafepayPaymentComponent =  new MultiSafepay(paymentComponentData);

                multisafepayPaymentComponent.init('payment', {
                    container: '#' + paymentRequestData.paymentComponentContainerId + '-' + paymentCode,
                    gateway: cardConfig.gatewayCode
                });

                return multisafepayPaymentComponent;
            } else {
                console.log($t("Credit Card component data not available for selected payment method."));
            }

            return {};
        },

        /**
         * Get the order data
         *
         * @param paymentRequestData
         * @param paymentCode
         * @returns {{template: {settings: {embed_mode: boolean}}, amount: number, currency, customer: {country, locale}}}
         */
        getOrderData: function (paymentRequestData, paymentCode) {
            let orderData = {
                customer: {
                    locale: paymentRequestData.locale,
                    country: quote.billingAddress().countryId,
                },
                currency: paymentRequestData.currency,
                amount: paymentRequestData.cartTotal * 100,
                payment_options: {
                    template: {
                        settings: {
                            embed_mode: true
                        },
                        merge: true
                    }
                }
            };

            if (paymentRequestData.payment_component_template_id) {
                orderData.payment_options.template_id = paymentRequestData.payment_component_template_id;
            }

            return orderData;
        },

        /**
         * Get the recurring data
         *
         * @param paymentRequestData
         * @returns {{model: string, tokens: ([]|*)}|null}
         */
        getRecurringData: function (cardConfig) {
            if (cardConfig.tokens) {
                return {
                    model: 'cardOnFile',
                    tokens: cardConfig.tokens
                }
            }

            return null;
        }
    };
});
