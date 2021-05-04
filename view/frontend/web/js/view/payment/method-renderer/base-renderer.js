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
        'Magento_Checkout/js/view/payment/default',
        'Magento_Checkout/js/action/select-payment-method',
        'Magento_Checkout/js/checkout-data',
        'Magento_Checkout/js/action/redirect-on-success',
        'mage/url'
    ],

    /**
     *
     * @param $
     * @param Component
     * @param selectPaymentMethodAction
     * @param checkoutData
     * @param redirectOnSuccessAction
     * @param url
     * @returns {*}
     */
    function (
        $,
        Component,
        selectPaymentMethodAction,
        checkoutData,
        redirectOnSuccessAction,
        url
    ) {
        'use strict';

        let self;

        return Component.extend({
            defaults: {
                template: 'MultiSafepay_ConnectFrontend/payment/generic',
                paymentConfig: ''
            },

            initObservable: function () {
                this._super();
                this.paymentConfig = window.checkoutConfig.payment[this.index];

                if (!checkoutData.getSelectedPaymentMethod() && this.paymentConfig.is_preselected) {
                    this.selectPaymentMethod();
                }

                return this;
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
                return this.paymentConfig.image;
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
             * Redirect to controller after place order
             */
            afterPlaceOrder: function () {
                redirectOnSuccessAction.redirectUrl = url.build('multisafepay/connect/redirect/');
                this.redirectAfterPlaceOrder = true;
            }
        });
    }
);
