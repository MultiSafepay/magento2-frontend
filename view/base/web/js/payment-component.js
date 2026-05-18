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
    'multisafepayPaymentComponentLib',
    'mage/url'
], function (
    $,
    $t,
    customerData,
    quote,
    multisafepayPaymentComponentLib,
    url
) {
    'use strict';

    return {
        /**
         * Initialise the MultiSafepay Payment Component for a given payment method.
         *
         * The API token is fetched on demand from the dedicated endpoint
         * (multisafepay/connect/apitoken).
         *
         * Returns a Promise that resolves to a MultiSafepay instance on success,
         * or to `null` when the component cannot be initialised. Callers must
         * therefore validate the resolved value before invoking SDK methods on
         * it (e.g. `hasErrors`, `getOrderData`).
         *
         * @param paymentCode
         * @param paymentRequestData
         * @param cardConfig
         * @returns {Promise<MultiSafepay|null>}
         */
        init: function (paymentCode, paymentRequestData, cardConfig) {
            let self = this;

            if (!paymentCode || !paymentRequestData) {
                console.log($t("MultiSafepay Component data not available for selected payment method."));

                return Promise.resolve(null);
            }

            if (!cardConfig) {
                console.log($t("Payment data for selected payment method wasn\'t found."));

                return Promise.resolve(null);
            }

            return this.fetchApiToken().then(function (apiToken) {
                if (!apiToken) {
                    console.log($t("Could not retrieve a valid MultiSafepay API token."));

                    return null;
                }

                let paymentComponentData = {
                    env: paymentRequestData.environment,
                    apiToken: apiToken,
                    order: self.getOrderData(paymentRequestData, cardConfig.gatewayCode)
                };

                let recurringData = self.getRecurringData(cardConfig);

                if (recurringData) {
                    paymentComponentData.recurring = recurringData;
                }

                let multisafepayPaymentComponent = new MultiSafepay(paymentComponentData);

                multisafepayPaymentComponent.init('payment', {
                    container: '#' + paymentRequestData.paymentComponentContainerId + '-' + paymentCode,
                    gateway: cardConfig.gatewayCode,
                    onError: state => {
                        if (paymentRequestData.debug_mode) {
                            console.log('Payment Component error: ' + JSON.stringify(state, null, 2));
                        }

                        return new Promise(
                            (resolve, reject) => {
                                $.ajax({
                                    url: url.build('multisafepay/connect/error'),
                                    type: 'POST',
                                    data: {
                                        'error': JSON.stringify(state, null, 2),
                                        'payment_method': paymentCode,
                                        'gateway_code': cardConfig.gatewayCode,
                                        'payment_component_data': JSON.stringify(paymentComponentData, null, 2),
                                        'form_key': $.mage.cookies.get('form_key')
                                    },
                                    success: function (response) {
                                        resolve(response);
                                    },
                                    error: function (error) {
                                        if (paymentRequestData.debug_mode) {
                                            console.log('Error occurred when trying to log the payment component error: ' + JSON.stringify(error, null, 2));
                                        }
                                        reject(error);
                                    }
                                });
                            }
                        ).then(
                            response => {
                                if (paymentRequestData.debug_mode) {
                                    console.log(response);
                                }
                            }
                        );
                    }
                });

                return multisafepayPaymentComponent;
            });
        },

        /**
         * Fetch a fresh MultiSafepay API token from the backend endpoint.
         *
         * The endpoint sets `Cache-Control: no-store` so no intermediate cache
         * (browser, CDN, FPC) can return a stale token. `cache: false` on the
         * jQuery side also adds a cache-buster query string for safety.
         *
         * Resolves to the token string on success, or to `null` on failure.
         *
         * @returns {Promise<string|null>}
         */
        fetchApiToken: function () {
            return new Promise(function (resolve) {
                $.ajax({
                    url: url.build('multisafepay/connect/apitoken'),
                    type: 'GET',
                    dataType: 'json',
                    cache: false
                }).done(function (response) {
                    if (response && response.success && response.apiToken) {
                        resolve(response.apiToken);

                        return;
                    }

                    resolve(null);
                }).fail(function () {
                    resolve(null);
                });
            });
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
