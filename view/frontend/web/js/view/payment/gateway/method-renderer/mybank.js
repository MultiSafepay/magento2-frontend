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
        'Magento_Checkout/js/checkout-data',
        'Magento_Checkout/js/action/redirect-on-success',
        'mage/url',
        'Magento_Checkout/js/action/select-payment-method',
        'select2'
    ],

    /**
     *
     * @param $
     * @param Component
     * @param checkoutData
     * @param redirectOnSuccessAction
     * @param url
     * @param selectPaymentMethodAction
     * @param select2
     * @returns {*}
     */
    function (
        $,
        Component,
        checkoutData,
        redirectOnSuccessAction,
        url,
        selectPaymentMethodAction,
        select2
    ) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'MultiSafepay_ConnectFrontend/payment/gateway/mybank',
                issuerId: '',
            },

            initialize: function () {
                this._super();
                return this;
            },

            initObservable: function () {
                this.observe('issuerId')
                    ._super();

                return this;
            },

            /**
             * Get list of issuers
             *
             * @returns {*}
             */
            getIssuers: function () {
                return this.paymentConfig.issuers;
            },

            /**
             * @return {Boolean}
             */
            selectPaymentMethod: function () {
                selectPaymentMethodAction(this.getData());
                checkoutData.setSelectedPaymentMethod(this.item.method);

                this.initializeSelect2();

                return true;
            },

            /**
             *
             * @returns {*}
             */
            initializeSelect2: function () {
                return $('.select2').select2();
            },

            /**
             * Add issuer_id to additional data
             *
             * @returns {{additional_data: {issuerid: *}, method: *}}
             */
            getData: function () {
                let data = {
                    "method": this.item.method,
                    "additional_data": {
                        'issuer_id': this.issuerId(),
                    }
                };

                return data;
            },
        });
    }
);
