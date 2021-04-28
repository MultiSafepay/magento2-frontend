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
        'Magento_Checkout/js/model/quote',
        'mage/url'
    ],

    /**
     *
     * @param $
     * @param Component
     * @param checkoutData
     * @param redirectOnSuccessAction
     * @param quote
     * @param url
     * @returns {*}
     */
    function (
        $,
        Component,
        checkoutData,
        redirectOnSuccessAction,
        quote,
        url
    ) {
        'use strict';

        /**
         * @returns {string}
         */
        function getTelephoneFromBillingAddress() {
            let billingAddress = quote.billingAddress();

            if (billingAddress.telephone) {
                return billingAddress.telephone
            }

            return '';
        }

        return Component.extend({
            defaults: {
                template: 'MultiSafepay_ConnectFrontend/payment/gateway/in3',
                dateOfBirth: '',
                genderId: '',
                telephone: getTelephoneFromBillingAddress()
            },

            initObservable: function () {
                this.observe('dateOfBirth')
                    .observe('genderId')
                    ._super();

                return this;
            },

            /**
             * Get list of genders
             *
             * @returns {*}
             */
            getGenders: function () {
                return [
                    {
                        "code": "mr",
                        "label": 'Mr.'
                    },
                    {
                        "code": "mrs",
                        "label": 'Mrs.'
                    }
                ];
            },

            /**
             * Add payment method specific data to additional data
             *
             * @returns {{additional_data: *, method}}
             */
            getData: function () {
                if (!this.dateOfBirth() && !this.genderId() && !this.telephone()) {
                    return {
                        "method": this.item.method,
                        "additional_data": null
                    };
                }

                return {
                    "method": this.item.method,
                    "additional_data": {
                        'date_of_birth': this.dateOfBirth(),
                        'gender': this.genderId(),
                        'telephone': this.telephone()
                    }
                };
            },
        });
    }
);
