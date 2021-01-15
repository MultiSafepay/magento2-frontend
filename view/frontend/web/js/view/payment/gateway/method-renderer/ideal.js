/**
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is provided with Magento in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * Copyright © 2020 MultiSafepay, Inc. All rights reserved.
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
        const config = window.checkoutConfig.payment.multisafepay_ideal;
        'use strict';

        let self;

        return Component.extend({
            defaults: {
                template: 'MultiSafepay_ConnectFrontend/payment/gateway/ideal',
                issuerId: '',
                is_preselected: false,
                transactionResult: ''
            },

            initialize: function () {
                this._super()._super().observe('issuerId');

                if (config.is_preselected) {
                    selectPaymentMethodAction(this.getData());
                    checkoutData.setSelectedPaymentMethod(this.item.method);
                }

                self = this;
            },

            /**
             * Get the gateway code
             *
             * @returns {string}
             */
            getCode: function () {
                return 'multisafepay_ideal';
            },

            /**
             * Get the gateway image
             *
             * @returns {string}
             */
            getImage: function () {
                return config.image;
            },

            /**
             * Get list of issuers
             *
             * @returns {*}
             */
            getIssuers: function () {
                return config.issuers;
            },

            /**
             * Add issuer_id to additional data
             *
             * @returns {{additional_data: {issuerid: *}, method: *}}
             */
            getData: function () {
                return {
                    "method": this.item.method,
                    "additional_data": {
                        'issuer_id': this.issuerId(),
                    }
                };
            },

            /**
             * Redirect to controller after place order
             */
            afterPlaceOrder: function () {
                redirectOnSuccessAction.redirectUrl = url.build('multisafepay/connect/redirect/');
                this.redirectAfterPlaceOrder = true;
            },
        });
    }
);
