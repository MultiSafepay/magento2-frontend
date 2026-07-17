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
        'Magento_Checkout/js/view/payment/default',
        'Magento_Checkout/js/action/select-payment-method',
        'Magento_Checkout/js/checkout-data',
        'Magento_Checkout/js/model/payment/additional-validators',
        'Magento_Checkout/js/action/place-order',
        'Magento_Customer/js/customer-data',
        'mage/url'
    ],

    /**
     * @param $
     * @param Component
     * @param selectPaymentMethodAction
     * @param checkoutData
     * @param additionalValidators
     * @param placeOrderAction
     * @param customerData
     * @param url
     * @returns {*}
     */
    function (
        $,
        Component,
        selectPaymentMethodAction,
        checkoutData,
        additionalValidators,
        placeOrderAction,
        customerData,
        url
    ) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'MultiSafepay_ConnectFrontend/payment/generic',
                paymentConfig: ''
            },

            redirectToken: null,

            initObservable: function () {
                this._super();
                this.paymentConfig = window.checkoutConfig.payment[this.index];

                if (!checkoutData.getSelectedPaymentMethod() && this.paymentConfig.is_preselected) {
                    this.selectPaymentMethod();
                }

                return this;
            },

            /**
             * Generate a random token to identify the redirect after placing the order
             *
             * @returns {string}
             */
            fetchRedirectToken: function () {
                if (window.crypto && window.crypto.getRandomValues) {
                    const bytes = new Uint8Array(16);
                    window.crypto.getRandomValues(bytes);
                    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
                }

                return (Date.now().toString(16) + Math.random().toString(16).slice(2))
                    .replace('.', '')
                    .slice(0, 32)
                    .padEnd(32, '0');
            },

            /**
             * Get the gateway image
             *
             * @returns {boolean}
             */
            isDirect: function () {
                return this.paymentConfig.transaction_type === 'direct';
            },

            /**
             * Get the gateway image
             *
             * @returns {string}
             */
            getImage: function () {
                return this.paymentConfig.image ?? '';
            },

            /**
             * Get the gateway code
             *
             * @returns {string}
             */
            getCode: function () {
                return this.index;
            },

            /**
             * Get the gateway instructions
             *
             * @returns {*|string}
             */
            getInstructions: function () {
                return this.paymentConfig.instructions ?? '';
            },

            /**
             * Place order and redirect to controller to handle the rest of the payment flow (either show payment page or process direct payment).
             *
             * @param data
             * @param event
             * @returns {boolean}
             */
            placeOrder: function (data, event) {
                if (event) {
                    event.preventDefault();
                }

                if (!this.validate() || !additionalValidators.validate() || !this.isPlaceOrderActionAllowed()) {
                    return false;
                }

                this.isPlaceOrderActionAllowed(false);

                this.redirectToken = this.fetchRedirectToken();

                const paymentRequestData = this.getData();
                paymentRequestData.additional_data = paymentRequestData.additional_data || {};
                paymentRequestData.additional_data.redirect_token = this.redirectToken;

                $.when(placeOrderAction(paymentRequestData, this.messageContainer))
                    .done(() => {
                        customerData.set('multisafepay-payment-component', {});
                        this.afterPlaceOrder();
                    })
                    .always(() => {
                        this.isPlaceOrderActionAllowed(true);
                    });

                return false;
            },

            /**
             * Redirect to controller after place order.
             */
            afterPlaceOrder: function () {
                const redirectUrl = url.build('multisafepay/connect/redirect');
                if (this.redirectToken) {
                    window.location = redirectUrl + '?token=' + encodeURIComponent(this.redirectToken);
                    return;
                }

                window.location = redirectUrl;
            }
        });
    }
);
