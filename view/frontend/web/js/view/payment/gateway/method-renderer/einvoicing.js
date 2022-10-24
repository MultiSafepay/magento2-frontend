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
        function getEmailAddress()
        {
            return window.checkoutConfig.customerData.email ?? quote.guestEmail ?? '';
        }

        return Component.extend({
            defaults: {
                template: 'MultiSafepay_ConnectFrontend/payment/gateway/einvoicing',
                dateOfBirth: '',
                accountNumber: '',
                emailAddress: getEmailAddress(),
            },

            initObservable: function () {
                this.observe('dateOfBirth')
                    .observe('accountNumber')
                    .observe('emailAddress')
                    ._super();

                return this;
            },

            isCheckoutFieldAvailable: function (currentField) {
                for (let checkoutField of this.paymentConfig.checkout_fields) {
                    if (checkoutField === currentField) {

                        return true;
                    }
                }

                return false;
            },

            /**
             * Add payment method specific data to additional data
             *
             * @returns {{additional_data: {}, method}|{additional_data: null, method}}
             */
            getData: function () {
                let paymentData = {
                    "method": this.item.method,
                    "additional_data": {}
                };

                let dateOfBirth = this.dateOfBirth();
                let accountNumber = this.accountNumber();
                let emailAddress = this.emailAddress();

                if (!dateOfBirth && !accountNumber && !emailAddress) {
                    return paymentData;
                }

                this.paymentConfig.checkout_fields.forEach(function (checkoutField) {
                    if (checkoutField === 'date_of_birth') {
                        paymentData.additional_data.date_of_birth = dateOfBirth;
                    }

                    if (checkoutField === 'account_number') {
                        paymentData.additional_data.account_number = accountNumber;
                    }

                    if (checkoutField === 'email_address') {
                        paymentData.additional_data.email_address = emailAddress;
                    }
                });

                return paymentData;
            },
        });
    }
);
