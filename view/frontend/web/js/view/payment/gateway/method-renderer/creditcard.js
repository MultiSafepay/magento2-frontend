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
        'Magento_Vault/js/view/payment/vault-enabler',
        'mage/url',
        'multisafepayPaymentRequest',
        'Magento_Checkout/js/action/select-payment-method',
        'Magento_Checkout/js/model/payment/additional-validators',
        'Magento_Checkout/js/action/place-order',
        'Magento_Customer/js/customer-data',
        'multisafepayCreditCardComponent'
    ],

    /**
     *
     * @param $
     * @param Component
     * @param checkoutData
     * @param redirectOnSuccessAction
     * @param VaultEnabler
     * @param url
     * @param paymentRequest
     * @param selectPaymentMethodAction
     * @param additionalValidators
     * @param placeOrderAction
     * @param customerData
     * @param multisafepayCreditCardComponent
     * @returns {*}
     */
    function (
        $,
        Component,
        checkoutData,
        redirectOnSuccessAction,
        VaultEnabler,
        url,
        paymentRequest,
        selectPaymentMethodAction,
        additionalValidators,
        placeOrderAction,
        customerData,
        multisafepayCreditCardComponent
    ) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'MultiSafepay_ConnectFrontend/payment/gateway/creditcard'
            },

            initialize: function () {
                this.vaultEnabler = new VaultEnabler();
                this._super();
                this.vaultEnabler.setPaymentCode(this.getVaultCode());
                this.paymentRequestConfig = customerData.get('multisafepay-payment-request')();
                this.paymentComponent = false;

                return this;
            },

            /**
             * @returns {Object}
             */
            getData: function () {
                return  {
                    'method': this.getCode(),
                    'additional_data': {}
                };
            },

            /**
             * @return {Boolean}
             */
            selectPaymentMethod: function () {
                selectPaymentMethodAction(this.getData());
                checkoutData.setSelectedPaymentMethod(this.item.method);

                if (this.isCreditCardComponentEnabled()) {
                    this.paymentComponent = multisafepayCreditCardComponent.init(this.getCode());
                }

                return true;
            },

            /**
             * @returns {Boolean}
             */
            isVaultEnabled: function () {
                return this.vaultEnabler.isVaultEnabled();
            },

            /**
             * @returns {Boolean}
             */
            isCreditCardComponentEnabled: function () {
                return this.paymentRequestConfig.creditCardComponent;
            },

            /**
             *
             * @returns {string|*}
             */
            getCreditCardComponentContainerId: function () {
                return this.paymentRequestConfig.cardComponentContainerId + "-" + this.getCode();
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
             * Place order.
             */
            placeOrder: function (data, event) {
                var self = this;

                if (event) {
                    event.preventDefault();
                }

                if (this.validate() &&
                    additionalValidators.validate() &&
                    this.isPlaceOrderActionAllowed() === true
                ) {
                    let paymentRequestData = this.getData();
                    if (this.isCreditCardComponentEnabled() && this.paymentComponent) {
                        console.log(this.paymentComponent);
                    } else {
                        var deferred = $.Deferred();
                        this.isPlaceOrderActionAllowed(false);
                        paymentRequest.init(this.getCode(), deferred);

                        $.when(deferred).then(function (paymentData) {
                            if (paymentData) {
                                paymentRequestData['additional_data']['payload'] = paymentData;
                            }

                            self.vaultEnabler.visitAdditionalData(paymentRequestData);

                            $.when(placeOrderAction(paymentRequestData, self.messageContainer)).done(
                                function () {
                                    self.afterPlaceOrder();

                                    if (self.redirectAfterPlaceOrder) {
                                        redirectOnSuccessAction.execute();
                                    }
                                }
                            ).always(function () {
                                    self.isPlaceOrderActionAllowed(true);
                                }
                            );
                        });

                        return true;
                    }
                }

                return false;
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
