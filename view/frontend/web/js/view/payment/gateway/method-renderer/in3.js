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
        'MultiSafepay_ConnectFrontend/js/view/payment/method-renderer/base-renderer',
        'Magento_Checkout/js/checkout-data',
        'Magento_Checkout/js/action/select-payment-method',
        'Magento_Checkout/js/model/payment/additional-validators',
        'Magento_Customer/js/customer-data',
        'multisafepayPaymentComponent'
    ],

    /**
     * @param Component
     * @param checkoutData
     * @param selectPaymentMethodAction
     * @param additionalValidators
     * @param customerData
     * @param multisafepayPaymentComponent
     * @returns {*}
     */
    function (
        Component,
        checkoutData,
        selectPaymentMethodAction,
        additionalValidators,
        customerData,
        multisafepayPaymentComponent
    ) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'MultiSafepay_ConnectFrontend/payment/gateway/in3',
                paymentType: 'payment_component',
            },

            initialize: function () {
                this._super();
                this.paymentRequestConfig = customerData.get('multisafepay-payment-request')();
                this.paymentComponent = false;
                this.paymentComponentPromise = null;
                this.paymentPayload = null;

                return this;
            },

            /**
             * Set the data that will be sent to the server on place order.
             *
             * @returns {{method: (string|string|*), additional_data: {}}}
             */
            getData: function () {
                let data = {
                    method: this.item.method,
                    additional_data: {}
                };

                if (this.paymentPayload) {
                    data.additional_data.payload = this.paymentPayload;
                }

                return data;
            },

            /**
             * Select this payment method and initialize the payment component if enabled.
             *
             * @returns {boolean}
             */
            selectPaymentMethod: function () {
                selectPaymentMethodAction(this.getData());
                checkoutData.setSelectedPaymentMethod(this.item.method);

                if (!this.isPaymentComponentEnabled()) {
                    return true;
                }

                if (!this.paymentComponent) {
                    this.initializePaymentComponent();
                }

                return true;
            },

            /**
             * Initialize the payment component for this payment method.
             *
             * Deduplicates concurrent calls by caching the in-flight Promise so
             * `selectPaymentMethod` and `PreRenderPaymentComponent` cannot start
             * multiple parallel SDK initialisations. Only assigns
             * `this.paymentComponent` when the resolved value exposes the
             * expected SDK contract.
             *
             * @returns {Promise<MultiSafepay|null>}
             */
            initializePaymentComponent: function () {
                if (this.paymentComponent) {
                    return Promise.resolve(this.paymentComponent);
                }

                if (this.paymentComponentPromise) {
                    return this.paymentComponentPromise;
                }

                let self = this;

                this.paymentComponentPromise = multisafepayPaymentComponent.init(
                    this.getCode(),
                    this.paymentRequestConfig,
                    this.getPaymentData()
                ).then(function (component) {
                    if (component && typeof component.getOrderData === 'function') {
                        self.paymentComponent = component;
                    }

                    return self.paymentComponent || null;
                }).catch(function (error) {
                    self.paymentComponentPromise = null;
                    throw error;
                });

                return this.paymentComponentPromise;
            },

            /**
             * Pre-render the payment component if this payment method is selected and the component is enabled for this method.
             *
             * @returns {*}
             * @constructor
             */
            PreRenderPaymentComponent: function () {
                if (checkoutData.getSelectedPaymentMethod() === this.getCode() && this.isPaymentComponentEnabled()) {
                    this.initializePaymentComponent();
                }

                return this;
            },

            /**
             * Check if the payment component should be rendered for this payment method.
             *
             * @returns {*|{}|boolean}
             */
            isPaymentComponentEnabled: function () {
                return this.paymentRequestConfig && this.getPaymentData()
                    && this.getPaymentData().paymentType === this.paymentType;
            },

            /**
             * Get the payment data for this payment method from the payment request config.
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
             * Get the ID of the container where the payment component will be rendered.
             *
             * @returns {string}
             */
            getPaymentComponentId: function () {
                return this.paymentRequestConfig.paymentComponentContainerId + "-" + this.getCode();
            },

            /**
             * Place order. If payment component is enabled, also include the component data in the payload.
             *
             * @param data
             * @param event
             * @returns {*|boolean}
             */
            placeOrder: function (data, event) {
                if (event) {
                    event.preventDefault();
                }

                if (!(this.validate() && additionalValidators.validate() && this.isPlaceOrderActionAllowed() === true)) {
                    return false;
                }

                // If the component is still initialising, wait for it before
                // continuing so a fast click cannot bypass component validation.
                if (this.isPaymentComponentEnabled() && !this.paymentComponent && this.paymentComponentPromise) {
                    let self = this;
                    this.paymentComponentPromise.then(function () {
                        self.placeOrder(data, event);
                    });

                    return false;
                }

                if (this.isPaymentComponentEnabled() && this.paymentComponent) {
                    if (this.paymentComponent.hasErrors()) {
                        return false;
                    }

                    const payload = this.paymentComponent.getOrderData().payment_data.payload;
                    this.paymentPayload = payload || null;
                }

                return this._super(data, event);
            }
        });
    }
);
