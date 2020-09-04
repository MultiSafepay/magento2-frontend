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
        'Magento_Checkout/js/action/redirect-on-success',
        'mage/url'
    ],

    /**
     *
     * @param $
     * @param Component
     * @param redirectOnSuccessAction
     * @param url
     * @returns {*}
     */
    function (
        $,
        Component,
        redirectOnSuccessAction,
        url
    ) {
        const config = window.checkoutConfig.payment.multisafepay_directbanktransfer;
        'use strict';

        let self;

        return Component.extend({
            defaults: {
                template: 'MultiSafepay_ConnectFrontend/payment/gateway/directbanktransfer',
                accountId: '',
                accountHolderName: '',
                accountHolderCity: '',
                accountHolderCountry: '',
                accountHolderIban: '',
                accountHolderBic: '',
                transactionResult: ''
            },

            initialize: function () {
                this._super()
                    .observe('accountId')
                    .observe('accountHolderName')
                    .observe('accountHolderCity')
                    .observe('accountHolderCountry')
                    .observe('accountHolderIban')
                    .observe('accountHolderBic');
                self = this;
            },

            /**
             * Get the gateway code
             *
             * @returns {string}
             */
            getCode: function () {
                return 'multisafepay_directbanktransfer';
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
             * Add payment method specific data to additional data
             *
             * @returns {{additional_data: {account_holder_iban: *, account_id: *, account_holder_name: *, account_holder_country: *, account_holder_city: *, account_holder_bic: *}, method: *}}
             */
            getData: function () {
                return {
                    "method": this.item.method,
                    "additional_data": {
                        'account_id': this.accountId(),
                        'account_holder_name': this.accountHolderName(),
                        'account_holder_city': this.accountHolderCity(),
                        'account_holder_country': this.accountHolderCountry(),
                        'account_holder_iban': this.accountHolderIban(),
                        'account_holder_bic': this.accountHolderBic()
                    }
                };
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
