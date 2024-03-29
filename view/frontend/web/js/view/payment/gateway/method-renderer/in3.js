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
        'Magento_Checkout/js/model/quote',
        'mage/url',
        'mage/translate'
    ],

    /**
     *
     * @param $
     * @param Component
     * @param checkoutData
     * @param redirectOnSuccessAction
     * @param quote
     * @param url
     * @param $t
     * @returns {*}
     */
    function (
        $,
        Component,
        checkoutData,
        redirectOnSuccessAction,
        quote,
        url,
        $t
    ) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'MultiSafepay_ConnectFrontend/payment/gateway/in3',
                genderId: ''
            },

            initObservable: function () {
                this.observe('genderId')
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
                        "label": $t('Mr.')
                    },
                    {
                        "code": "mrs",
                        "label": $t('Mrs.')
                    }
                ];
            },

            /**
             * Add payment method specific data to additional data
             *
             * @returns {{additional_data: *, method: *}}
             */
            getData: function () {
                if (!this.genderId()) {
                    return {
                        "method": this.item.method,
                        "additional_data": null
                    };
                }

                return {
                    "method": this.item.method,
                    "additional_data": {
                        'gender': this.genderId()
                    }
                };
            },
        });
    }
);
