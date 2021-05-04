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
        'mage/url'
    ],

    /**
     *
     * @param $
     * @param Component
     * @param checkoutData
     * @param redirectOnSuccessAction
     * @param url
     * @returns {*}
     */
    function (
        $,
        Component,
        checkoutData,
        redirectOnSuccessAction,
        url
    ) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'MultiSafepay_ConnectFrontend/payment/gateway/einvoicing',
                dateOfBirth: '',
                accountNumber: '',
            },

            initObservable: function () {
                this.observe('dateOfBirth')
                    .observe('accountNumber')
                    ._super();

                return this;
            },

            /**
             * Add payment method specific data to additional data
             *
             * @returns {{additional_data: *, method: *}}
             */
            getData: function () {
                if (!this.dateOfBirth() && !this.accountNumber()) {
                    return {
                        "method": this.item.method,
                        "additional_data": null
                    };
                }

                return {
                    "method": this.item.method,
                    "additional_data": {
                        'date_of_birth': this.dateOfBirth(),
                        'account_number': this.accountNumber()
                    }
                };
            },
        });
    }
);
