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

/*browser:true*/
/*global define*/
define(
    [
        'jquery',
        'MultiSafepay_ConnectFrontend/js/view/payment/method-renderer/base-renderer',
        'Magento_Customer/js/customer-data',
        'multisafepayGooglePayButton',
        'googlePayButtonLibrary',
        'multisafepayUtils'
    ],

    /**
     * @param $
     * @param Component
     * @param customerData
     * @param multisafepayGooglePayButton
     * @param googlePayButtonLibrary
     * @param multisafepayUtils
     * @returns {*}
     */
    function (
        $,
        Component,
        customerData,
        multisafepayGooglePayButton,
        googlePayButtonLibrary,
        multisafepayUtils
    ) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'MultiSafepay_ConnectFrontend/payment/gateway/googlepay',
            },

            initialize: function () {
                this._super();
                this.paymentRequestConfig = customerData.get('multisafepay-payment-request')();
                this.paymentsClient = false;

                return this;
            },

            /**
             * Check if Google Pay button needs to be rendered and render it if needed.
             *
             * @returns {*}
             */
            checkIfNeedRenderGooglePayButton: function () {
                if (this.isGooglePayButtonAvailable()) {
                    this.initializeGooglePayButton();
                }

                return this;
            },

            /**
             * Get the Google Pay button container ID from the configuration.
             *
             * @returns {*|string}
             */
            getGooglePayButtonId: function () {
                if (typeof this.paymentRequestConfig.googlePayButton === 'undefined') {
                    return '';
                }

                return this.paymentRequestConfig.googlePayButton.googlePayButtonId;
            },

            /**
             * Check if Google Pay button is available based on the configuration.
             *
             * @returns {*|(() => boolean)|boolean|boolean}
             */
            isGooglePayButtonAvailable: function () {
                if (typeof this.paymentRequestConfig.googlePayButton === 'undefined') {
                    return false;
                }

                return this.paymentRequestConfig && this.paymentRequestConfig.googlePayButton.isActive;
            },

            /**
             * Initialize the Google Pay button by creating a PaymentsClient and checking if the user can pay with Google Pay.
             */
            initializeGooglePayButton: function () {
                let self = this;
                this.paymentsClient = new google.payments.api.PaymentsClient(
                    {
                        environment: this.paymentRequestConfig.googlePayButton.mode
                    }
                );

                const isReadyToPayRequest = Object.assign(
                    {},
                    multisafepayGooglePayButton.getGooglePayBaseRequest()
                );

                isReadyToPayRequest.allowedPaymentMethods =
                    [multisafepayGooglePayButton.getGooglePayCardPaymentMethodData().baseCardPaymentMethod];

                this.paymentsClient.isReadyToPay(isReadyToPayRequest)
                    .then(function (response) {
                        if (response.result) {
                            self.addGooglePayButton(self.paymentsClient);
                        }
                    })
                    .catch(function (err) {
                        console.error(err);
                    });
            },

            /**
             * Add the Google Pay button to the container and set up the click handler to initiate the payment process.
             *
             * @param paymentsClient
             */
            addGooglePayButton: function (paymentsClient) {
                document.getElementById(this.getGooglePayButtonId()).appendChild(
                    paymentsClient.createButton({
                        buttonColor: 'default',
                        buttonType: 'pay',
                        onClick: this.payWithGooglePay.bind(this)
                    })
                );
            },

            /**
             * Set the data that will be sent to the server on place order.
             *
             * @returns {{method: (string|string|*), additional_data: {}}}
             */
            getData: function () {
                return {
                    method: this.item.method,
                    additional_data: {}
                };
            },

            /**
             * Handle Google Pay button click, get the payment token and place the order.
             *
             * @returns {boolean}
             */
            payWithGooglePay: function () {
                var self = this;

                if (!this.paymentsClient) {
                    return true;
                }

                let deferred = $.Deferred();
                multisafepayGooglePayButton.init(deferred, this.paymentsClient);

                $.when(deferred).then(function (paymentToken, sessionError) {
                    if (!paymentToken) {
                        if (sessionError) {
                            console.error(sessionError);
                        }
                        return;
                    }

                    self.googlePayPayload = JSON.stringify({
                        token: paymentToken,
                        browser_info: multisafepayUtils.getBrowserInfo()
                    });

                    const originalGetData = self.getData.bind(self);
                    self.getData = function () {
                        const data = originalGetData();
                        data.additional_data = data.additional_data || {};
                        data.additional_data.payload = self.googlePayPayload;
                        return data;
                    };

                    self.placeOrder();
                });

                return true;
            },

            /**
             * Check if the Google Pay button should be visible based on the configuration and availability.
             *
             * @returns {*|(function(): boolean)|boolean}
             */
            isGoogleButtonVisible: function () {
                return this.isGooglePayButtonAvailable();
            },

            /**
             * Check if the place order action is allowed. This can be used to prevent multiple clicks on the Google Pay button while the payment is being processed.
             *
             * @returns {boolean}
             */
            isAllowed: function () {
                return true;
            }
        });
    }
);
