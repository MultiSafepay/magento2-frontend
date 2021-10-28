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
        'MultiSafepay_ConnectFrontend/js/view/payment/vault-enabler'
    ],

    /**
     *
     * @param $
     * @param Component
     * @param checkoutData
     * @param redirectOnSuccessAction
     * @param url
     * @param VaultEnabler
     * @returns {*}
     */
    function (
        $,
        Component,
        checkoutData,
        redirectOnSuccessAction,
        url,
        VaultEnabler
    ) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'MultiSafepay_ConnectFrontend/payment/gateway/directdebit',
                accountHolderName: '',
                accountHolderIban: '',
            },

            initialize: function () {
                this.vaultEnabler = new VaultEnabler();
                this._super();
                this.vaultEnabler.setPaymentCode(this.getVaultCode());

                return this;
            },

            initObservable: function () {
                this.observe('accountHolderName')
                    .observe('accountHolderIban')
                    ._super();

                return this;
            },

            /**
             * Returns vault code.
             *
             * @returns {String}
             */
            getVaultCode: function () {
                return window.checkoutConfig.payment[this.getCode()].vaultCode;
            },

            /**
             * @returns {Boolean}
             */
            isVaultEnabled: function () {
                return this.vaultEnabler.isVaultEnabled();
            },

            /**
             * Add payment method specific data to additional data
             *
             * @returns {{additional_data: *, method: *}}
             */
            getData: function () {
                if (!this.accountHolderName() && !this.accountHolderIban()) {
                    let data = {
                        "method": this.item.method,
                        "additional_data": {}
                    };

                    this.vaultEnabler.visitAdditionalData(data);

                    return data;
                }

                let data = {
                    "method": this.item.method,
                    "additional_data": {
                        'account_holder_name': this.accountHolderName(),
                        'account_holder_iban': this.accountHolderIban(),
                    }
                };

                this.vaultEnabler.visitAdditionalData(data);

                return data;
            },
        });
    }
);
