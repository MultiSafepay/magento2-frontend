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

/*browser:true*/
/*global define*/
define(
    [
        'jquery',
        'MultiSafepay_ConnectFrontend/js/view/payment/method-renderer/base-renderer',
        'Magento_Checkout/js/checkout-data',
        'Magento_Checkout/js/action/redirect-on-success',
        'mage/url',
        'Magento_Customer/js/customer-data',
        'multisafepayGooglePayButton',
        'Magento_Checkout/js/action/place-order',
        'Magento_Checkout/js/model/full-screen-loader'
    ],

    /**
     *
     * @param $
     * @param Component
     * @param checkoutData
     * @param redirectOnSuccessAction
     * @param url
     * @param customerData
     * @param multisafepayGooglePayButton
     * @param placeOrderAction
     * @param fullScreenLoader
     * @returns {*}
     */
    function (
        $,
        Component,
        checkoutData,
        redirectOnSuccessAction,
        url,
        customerData,
        multisafepayGooglePayButton,
        placeOrderAction,
        fullScreenLoader
    ) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'MultiSafepay_ConnectFrontend/payment/gateway/googlepay',
            },

            initialize: function () {
                this._super();
                this.paymentRequestConfig = customerData.get('multisafepay-payment-request')();

                if (this.isGooglePayButtonAvailable()) {
                    let self = this;
                    let googlePayButtonLibrary = document.createElement('script');
                    googlePayButtonLibrary.src = "https://pay.google.com/gp/p/js/pay.js";
                    googlePayButtonLibrary.type = "text/javascript";
                    document.head.appendChild(googlePayButtonLibrary);

                    const baseRequest = {
                        apiVersion: 2,
                        apiVersionMinor: 0
                    };

                    const tokenizationSpecification = {
                        type: 'PAYMENT_GATEWAY',
                        parameters: {
                            'gateway': 'multisafepay',
                            'gatewayMerchantId': 'yourMultiSafepayAccountId'
                        }
                    };

                    const allowedCardNetworks = ["AMEX", "MASTERCARD", "VISA", "MAESTRO"];
                    const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

                    const baseCardPaymentMethod = {
                        type: 'CARD',
                        parameters: {
                            allowedAuthMethods: allowedCardAuthMethods,
                            allowedCardNetworks: allowedCardNetworks
                        }
                    };

                    const cardPaymentMethod = Object.assign(
                        {tokenizationSpecification: tokenizationSpecification},
                        baseCardPaymentMethod
                    );

                    const paymentsClient =
                        new google.payments.api.PaymentsClient({environment: 'TEST'});

                    const isReadyToPayRequest = Object.assign({}, baseRequest);
                    isReadyToPayRequest.allowedPaymentMethods = [baseCardPaymentMethod];

                    paymentsClient.isReadyToPay(isReadyToPayRequest)
                        .then(function(response) {
                            if (response.result) {
                                self.addGooglePayButton(paymentsClient);
                            }
                        })
                        .catch(function(err) {
                            // Show error in developer console for debugging
                            console.error(err);
                        });
                }

                return this;
            },

            /**
             *
             * @returns {string|*}
             */
            getGooglePayButtonId: function () {
                return this.paymentRequestConfig.googlePayButton.googlePayButtonId;
            },

            /**
             *
             * @returns {*}
             */
            isGooglePayButtonAvailable: function () {
                return this.paymentRequestConfig && this.paymentRequestConfig.googlePayButton.isActive;
            },

            /**
             *
             * @returns {*}
             */
            addGooglePayButton: function (paymentsClient) {
                const buttonContainer = document.getElementById(this.getGooglePayButtonId());

                const button = paymentsClient.createButton({
                    buttonType: 'plain',
                    onClick: this.initGooglePayButton
                });

                buttonContainer.appendChild(button);
            },

            /**
             * Check if Apple Pay is allowed to be used
             *
             * @returns {boolean|*}
             */
            initGooglePayButton: function () {
                var self = this;
                let paymentRequestData = this.getData();
                let deferred = $.Deferred();
                this.isPlaceOrderActionAllowed(false);
                multisafepayGooglePayButton.init(this.getCode(), deferred);

                $.when(deferred).then(function (paymentData, applePaySession, sessionError) {
                    if (paymentData) {
                        paymentRequestData['additional_data'] = {
                            token: JSON.stringify(paymentData.token)
                        };

                        $.when(placeOrderAction(paymentRequestData, self.messageContainer)).done(
                            function () {
                                self.afterPlaceOrder();

                                if (self.redirectAfterPlaceOrder) {
                                    redirectOnSuccessAction.execute();
                                }
                            }
                        ).always(function () {
                                self.isPlaceOrderActionAllowed(true);
                            }
                        ).fail(function () {
                            self.isPlaceOrderActionAllowed(true);
                            applePaySession.completePayment(
                                {
                                    status: ApplePaySession.STATUS_FAILURE,
                                    errors: [
                                        'Something went wrong. Please, try again.'
                                    ]
                                }
                            );
                        });

                        applePaySession.completePayment(ApplePaySession.STATUS_SUCCESS);
                    } else {
                        self.isPlaceOrderActionAllowed(true);
                        fullScreenLoader.stopLoader();

                        if (sessionError) {
                            self.messageContainer.addErrorMessage({
                                message: sessionError
                            });
                        }
                    }
                });

                return true;
            },

            isGoogleButtonVisible: function () {
                return this.isGooglePayButtonAvailable();
            },

            /**
             * Check if Apple Pay is allowed to be used
             *
             * @returns {boolean|*}
             */
            isAllowed: function () {
                return true;
            }
        });
    }
);
