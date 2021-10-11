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
                this.paymentsClient = false;

                console.log(this.paymentRequestConfig);

                if (this.isGooglePayButtonAvailable()) {
                    let self = this;
                    let googlePayButtonLibrary = document.createElement('script');
                    googlePayButtonLibrary.src = "https://pay.google.com/gp/p/js/pay.js";
                    googlePayButtonLibrary.async = true;
                    googlePayButtonLibrary.type = "text/javascript";
                    document.head.appendChild(googlePayButtonLibrary);

                    setTimeout(function () {
                        self.initializeGooglePayButton();
                    }, 1000);
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
            initializeGooglePayButton: function () {
                var self = this;
                this.paymentsClient = new google.payments.api.PaymentsClient({environment: 'TEST'});
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
             *
             * @returns {*}
             */
            addGooglePayButton: function (paymentsClient) {
                document.getElementById(this.getGooglePayButtonId()).appendChild(
                    paymentsClient.createButton({
                        buttonType: 'plain',
                        onClick: this.payWithGooglePay
                    })
                );
            },

            /**
             *
             * @returns {boolean|*}
             */
            payWithGooglePay: function () {
                var self = this;

                if (!this.paymentsClient) {
                    return true;
                }

                let paymentRequestData = this.getData();
                let deferred = $.Deferred();
                this.isPlaceOrderActionAllowed(false);
                multisafepayGooglePayButton.init(deferred, this.paymentsClient);

                $.when(deferred).then(function (paymentToken, sessionError) {
                    if (paymentToken) {
                        paymentRequestData['additional_data'] = {
                            token: paymentToken
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
                        });
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

            /**
             *
             * @returns {*}
             */
            isGoogleButtonVisible: function () {
                return this.isGooglePayButtonAvailable();
            },

            /**
             *
             * @returns {boolean}
             */
            isAllowed: function () {
                return true;
            }
        });
    }
);
