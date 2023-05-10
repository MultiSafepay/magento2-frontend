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

        /**
         * Try to retrieve the phone number from the billing address if available to be used as default
         *
         * @returns {string}
         */
        function getAfterPayTelephone() {
            // If the billing address is empty, then there is no phone number to take from it
            if (!quote.billingAddress()) {
                return '';
            }

            return quote.billingAddress().telephone ?? '';
        }

        return Component.extend({
            defaults: {
                template: 'MultiSafepay_ConnectFrontend/payment/gateway/afterpay',
                dateOfBirth: '',
                genderId: '',
                phoneNumber: getAfterPayTelephone(),
                afterpayTerms: false,
            },

            initObservable: function () {
                this.observe('dateOfBirth')
                    .observe('genderId')
                    .observe('phoneNumber')
                    .observe('afterpayTerms')
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
                    },
                    {
                        "code": "miss",
                        "label": $t('Miss')
                    }
                ];
            },

            /**
             * Return the link of Afterpay terms and conditions
             * according country id defined in billing address
             *
             * @returns {string}
             */
            getAfterpayTermsUrl: function () {
                return this.paymentConfig.afterpay_terms_url;
            },

            /**
             * Add payment method specific data to additional data
             *
             * @returns {{additional_data: *, method: *}}
             */
            getData: function () {
                if (!this.dateOfBirth() && !this.genderId() && !this.phoneNumber() && !this.afterpayTerms()) {
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
                        'phone_number': this.phoneNumber(),
                        'afterpay_terms': this.afterpayTerms()
                    }
                };
            },
        });
    }
);
