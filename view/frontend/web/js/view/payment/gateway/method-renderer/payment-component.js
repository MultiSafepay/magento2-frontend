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
                template: 'MultiSafepay_ConnectFrontend/payment/gateway/payment-component',
                paymentType: 'payment_component',
            },

            initialize: function () {
                this._super();
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
             *
             * @returns {*|{}|boolean}
             */
            isPaymentComponentEnabled: function () {
                return this.paymentRequestConfig && this.getPaymentData()
                    && this.getPaymentData().paymentType === this.paymentType;
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
                            let payload = this.paymentComponent.getOrderData().payment_data.payload;
                            let cardBrand = '';

                            if (payload) {
                                this.paymentPayload = payload;
                                paymentRequestData['additional_data']['payload'] = payload;
                                paymentRequestData['additional_data']['card_brand'] = cardBrand;
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
