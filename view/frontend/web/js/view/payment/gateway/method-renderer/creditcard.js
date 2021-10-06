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
                template: 'MultiSafepay_ConnectFrontend/payment/gateway/creditcard',
                creditCardPaymentType: 'credit_card',
                paymentRequestPaymentType: 'payment_request'
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
                let data =  {
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

                if (this.isCreditCardComponentEnabled() && !this.paymentComponent) {
                    this.initializeCreditCardComponent();
                }

                return true;
            },

            /**
             *
             * @returns {boolean|*}
             */
            initializeCreditCardComponent: function () {
                this.paymentComponent = multisafepayCreditCardComponent.init(
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
            checkIfNeedPreRenderCreditCardComponent: function () {
                if (checkoutData.getSelectedPaymentMethod() === this.getCode() && this.isCreditCardComponentEnabled()) {
                    this.initializeCreditCardComponent();
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
            isCreditCardComponentEnabled: function () {
                return this.paymentRequestConfig && this.getPaymentData()
                    && this.getPaymentData().paymentType === this.creditCardPaymentType;
            },

            /**
             *
             * @returns {*|{}|boolean}
             */
            isPaymentRequestApiEnabled: function () {
                return this.paymentRequestConfig && this.getPaymentData()
                    && this.getPaymentData().paymentType === this.paymentRequestPaymentType;
            },

            /**
             *
             * @returns {{}|*}
             */
            getPaymentData: function () {
                if (this.paymentRequestConfig
                    && this.paymentRequestConfig.cardsConfig
                    && this.paymentRequestConfig.cardsConfig.hasOwnProperty(this.getCode())
                ) {
                    return this.paymentRequestConfig.cardsConfig[this.getCode()];
                }

                return {};
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
             *
             * @param data
             * @param event
             * @returns {boolean}
             */
            placeOrder: function (data, event) {
                var self = this;

                if (event) {
                    event.preventDefault();
                }

                if (this.validate() && additionalValidators.validate() && this.isPlaceOrderActionAllowed() === true) {
                    let paymentRequestData = this.getData();

                    if (this.isCreditCardComponentEnabled() && this.paymentComponent) {
                        if (!this.paymentComponent.hasErrors()) {
                            this.isPlaceOrderActionAllowed(false);
                            let payload = this.paymentComponent.getOrderData().payment_data.payload;

//                            todo need to do it right way
//                             let cardBrand = this.paymentComponent.ref.paymentFormRef.state.brandsAllowed[0].id;
                            let cardBrand = '';

                            if (payload) {
                                this.paymentPayload = payload;
                                paymentRequestData['additional_data']['payload'] = payload;
                                paymentRequestData['additional_data']['card_brand'] = cardBrand;
                            }

                            this.placeOderDefault(paymentRequestData);

                            return true;
                        }
                    } else if (this.isPaymentRequestApiEnabled()) {
                        let deferred = $.Deferred();
                        this.isPlaceOrderActionAllowed(false);
                        paymentRequest.init(this.getCode(), deferred);

                        $.when(deferred).then(function (paymentData) {
                            if (paymentData) {
                                self.paymentPayload = paymentData;
                                paymentRequestData['additional_data']['payload'] = paymentData;
                            }

                            self.placeOderDefault(paymentRequestData);
                        });

                        return true;
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
                var self = this;
                this.vaultEnabler.visitAdditionalData(paymentRequestData);

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
