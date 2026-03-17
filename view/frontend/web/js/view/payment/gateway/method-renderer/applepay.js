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
        'multisafepayApplePayButton',
        'Magento_Checkout/js/action/place-order',
        'Magento_Checkout/js/model/full-screen-loader',
        'multisafepayUtils'
    ],

    /**
     * @param $
     * @param Component
     * @param customerData
     * @param multisafepayApplePayButton
     * @param placeOrderAction
     * @param fullScreenLoader
     * @param multisafepayUtils
     * @returns {*}
     */
    function (
        $,
        Component,
        customerData,
        multisafepayApplePayButton,
        placeOrderAction,
        fullScreenLoader,
        multisafepayUtils
    ) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'MultiSafepay_ConnectFrontend/payment/gateway/applepay',
                isProcessing: false
            },

            initObservable: function () {
                this.observe('isProcessing')._super();
                return this;
            },

            initialize: function () {
                this._super();
                this.paymentRequestConfig = customerData.get('multisafepay-payment-request')();
                return this;
            },

            /**
             * Initializes Apple Pay button and its session.
             *
             * @returns {boolean}
             */
            initApplePayButton: function () {
                var self = this;
                let deferred = $.Deferred();

                this.isProcessing(true);
                this.isPlaceOrderActionAllowed(false);

                multisafepayApplePayButton.init(this.getCode(), deferred);

                $.when(deferred).then(function (paymentData, applePaySession, sessionError) {
                    if (!paymentData) {
                        self.isPlaceOrderActionAllowed(true);
                        self.isProcessing(false);
                        fullScreenLoader.stopLoader();

                        if (sessionError) {
                            self.messageContainer.addErrorMessage({message: sessionError});
                        }

                        return;
                    }

                    // Generate redirect token on client (your updated base renderer method)
                    self.redirectToken = self.fetchRedirectToken();

                    let paymentRequestData = self.getData();
                    paymentRequestData.additional_data = paymentRequestData.additional_data || {};

                    paymentRequestData.additional_data.redirect_token = self.redirectToken;
                    paymentRequestData.additional_data.payload = JSON.stringify({
                        token: paymentData.token,
                        browser_info: multisafepayUtils.getBrowserInfo()
                    });

                    $.when(placeOrderAction(paymentRequestData, self.messageContainer))
                        .done(function () {
                            // Redirect uses token; controller resolves order by token
                            self.afterPlaceOrder();

                            try {
                                applePaySession.completePayment(ApplePaySession.STATUS_SUCCESS);
                            } catch (e) {
                                console.warn('MultiSafepay error when trying to complete Apple Pay session:', e);
                            }
                        })
                        .fail(function () {
                            try {
                                applePaySession.completePayment({
                                    status: ApplePaySession.STATUS_FAILURE,
                                    errors: ['Something went wrong. Please, try again.']
                                });
                            } catch (e) {
                                console.warn('MultiSafepay error when trying to complete Apple Pay session with failure status:', e);
                            }
                        })
                        .always(function () {
                            self.isPlaceOrderActionAllowed(true);
                            self.isProcessing(false);
                        });
                });

                return true;
            },

            /**
             * @returns {string}
             */
            getApplePayButtonId: function () {
                if (typeof this.paymentRequestConfig.applePayButton === 'undefined') {
                    return '';
                }

                return this.paymentRequestConfig.applePayButton.applePayButtonId;
            },

            /**
             * @returns {boolean}
             */
            isApplePayButtonAvailable: function () {
                if (typeof this.paymentRequestConfig.applePayButton === 'undefined') {
                    return false;
                }

                return this.paymentRequestConfig && this.paymentRequestConfig.applePayButton.isActive;
            },

            /**
             * @returns {boolean}
             */
            isAppleButtonVisible: function () {
                return this.isApplePayButtonAvailable();
            },

            /**
             * @returns {boolean}
             */
            isAllowed: function () {
                try {
                    $(this.getApplePayButtonId()).hide();

                    if (window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
                        return true;
                    }
                } catch (error) {
                    console.warn('MultiSafepay error when trying to initialize Apple Pay:', error);
                    return false;
                }
            }
        });
    }
);
