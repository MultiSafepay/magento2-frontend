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
        'MultiSafepay_ConnectFrontend/js/view/payment/vault-enabler',
        'mage/url',
        'Magento_Checkout/js/action/select-payment-method',
        'Magento_Checkout/js/model/payment/additional-validators',
        'Magento_Checkout/js/action/place-order',
        'Magento_Customer/js/customer-data',
        'multisafepayPaymentComponent'
    ],

    /**
     *
     * @param $
     * @param Component
     * @param checkoutData
     * @param redirectOnSuccessAction
     * @param VaultEnabler
     * @param url
     * @param selectPaymentMethodAction
     * @param additionalValidators
     * @param placeOrderAction
     * @param customerData
     * @param multisafepayPaymentComponent
     * @returns {*}
     */
    function (
        $,
        Component,
        checkoutData,
        redirectOnSuccessAction,
        VaultEnabler,
        url,
        selectPaymentMethodAction,
        additionalValidators,
        placeOrderAction,
        customerData,
        multisafepayPaymentComponent
    ) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'MultiSafepay_ConnectFrontend/payment/gateway/creditcard',
                creditCardPaymentType: 'payment_component',
            },

            initialize: function () {
                this.vaultEnabler = new VaultEnabler();
                this._super();
                this.vaultEnabler.setPaymentCode(this.getVaultCode());
                this.paymentRequestConfig = customerData.get('multisafepay-payment-request')();
                this.paymentComponent = false;
                this.paymentPayload = false;

                return this;
            },

            /**
             * @returns {Object}
             */
            getData: function () {
                let data = {
                    'method': this.getCode(),
                    'additional_data': {}
                };

                if (this.paymentPayload) {
                    data['additional_data']['payload'] = this.paymentPayload;
                }

                this.vaultEnabler.visitAdditionalData(data);

                return data;
            },

            /**
             * @return {Boolean}
             */
            selectPaymentMethod: function () {
                selectPaymentMethodAction(this.getData());
                checkoutData.setSelectedPaymentMethod(this.item.method);

                if (this.isPaymentComponentEnabled() && !this.paymentComponent) {
                    this.initializePaymentComponent();
                }

                return true;
            },

            /**
             *
             * @returns {boolean|*}
             */
            initializePaymentComponent: function () {
                this.paymentComponent = multisafepayPaymentComponent.init(
                    this.getCode(),
                    this.paymentRequestConfig,
                    this.getPaymentData()
                );

                return this.paymentComponent;
            },

            /**
             *
             * @returns {*}
             */
            PreRenderPaymentComponent: function () {
                if (checkoutData.getSelectedPaymentMethod() === this.getCode() && this.isPaymentComponentEnabled()) {
                    this.initializePaymentComponent();
                }

                return this;
            },

            /**
             * @returns {Boolean}
             */
            isVaultEnabled: function () {
                return this.vaultEnabler.isVaultEnabled();
            },

            /**
             *
             * @returns {*|{}|boolean}
             */
            isPaymentComponentEnabled: function () {
                return this.paymentRequestConfig && this.getPaymentData()
                    && this.getPaymentData().paymentType === this.creditCardPaymentType;
            },

            /**
             *
             * @returns {{}|*}
             */
            getPaymentData: function () {
                if (this.paymentRequestConfig
                    && this.paymentRequestConfig.paymentComponentConfig
                    && this.paymentRequestConfig.paymentComponentConfig.hasOwnProperty(this.getCode())
                ) {
                    return this.paymentRequestConfig.paymentComponentConfig[this.getCode()];
                }

                return {};
            },

            /**
             *
             * @returns {string|*}
             */
            getPaymentComponentId: function () {
                return this.paymentRequestConfig.paymentComponentContainerId + "-" + this.getCode();
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
             *
             * @param data
             * @param event
             * @returns {boolean}
             */
            placeOrder: function (data, event) {
                if (event) {
                    event.preventDefault();
                }

                if (this.validate() && additionalValidators.validate() && this.isPlaceOrderActionAllowed() === true) {
                    let paymentRequestData = this.getData();

                    if (this.isPaymentComponentEnabled() && this.paymentComponent) {
                        if (!this.paymentComponent.hasErrors()) {
                            this.isPlaceOrderActionAllowed(false);

                            let paymentData = this.paymentComponent.getOrderData().payment_data;

                            let payload = paymentData.payload;
                            let tokenize = paymentData.tokenize;
                            let cardBrand = '';

                            if (payload) {
                                this.paymentPayload = payload;
                                paymentRequestData['additional_data']['payload'] = payload;
                                paymentRequestData['additional_data']['card_brand'] = cardBrand;
                            }

                            if (tokenize) {
                                paymentRequestData['additional_data']['tokenize'] = tokenize;
                            }

                            this.placeOderDefault(paymentRequestData);

                            return true;
                        }
                    } else {
                        this.isPlaceOrderActionAllowed(false);
                        this.placeOderDefault(paymentRequestData);

                        return true;
                    }
                }

                return false;
            },

            /**
             *
             * @param paymentRequestData
             */
            placeOderDefault: function (paymentRequestData) {
                let self = this;
                this.vaultEnabler.visitAdditionalData(paymentRequestData);

                $.when(placeOrderAction(paymentRequestData, self.messageContainer)).done(
                    function () {
                        customerData.set("multisafepay-payment-component", {});
                        self.afterPlaceOrder();

                        if (self.redirectAfterPlaceOrder) {
                            redirectOnSuccessAction.execute();
                        }
                    }
                ).always(function () {
                        self.isPlaceOrderActionAllowed(true);
                    }
                );
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
