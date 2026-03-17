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
        'Magento_Checkout/js/model/quote',
        'Magento_Checkout/js/action/select-payment-method',
        'Magento_Checkout/js/model/payment/additional-validators',
        'Magento_Customer/js/customer-data',
        'multisafepayPaymentComponent'
    ],

    /**
     * @param Component
     * @param checkoutData
     * @param quote
     * @param selectPaymentMethodAction
     * @param additionalValidators
     * @param customerData
     * @param multisafepayPaymentComponent
     * @returns {*}
     */
    function (
        Component,
        checkoutData,
        quote,
        selectPaymentMethodAction,
        additionalValidators,
        customerData,
        multisafepayPaymentComponent
    ) {
        'use strict';

        /**
         * Get the email address to pre-fill in the checkout field.
         *
         * @returns {string}
         */
        function getEmailAddress() {
            return window.checkoutConfig.customerData.email ?? quote.guestEmail ?? '';
        }

        return Component.extend({
            defaults: {
                template: 'MultiSafepay_ConnectFrontend/payment/gateway/einvoicing',
                paymentType: 'payment_component',
                dateOfBirth: '',
                accountNumber: '',
                emailAddress: getEmailAddress(),
            },

            initialize: function () {
                this._super();
                this.paymentRequestConfig = customerData.get('multisafepay-payment-request')();
                this.paymentComponent = false;
                this.paymentPayload = null;
                this.paymentComponentLifeTime = this.paymentRequestConfig.apiTokenLifeTime;

                return this;
            },

            initObservable: function () {
                this.observe('dateOfBirth')
                    .observe('accountNumber')
                    .observe('emailAddress')
                    ._super();

                return this;
            },

            /**
             * Check if a checkout field is enabled for this payment method.
             *
             * @param currentField
             * @returns {boolean}
             */
            isCheckoutFieldAvailable: function (currentField) {
                for (let checkoutField of this.paymentConfig.checkout_fields) {
                    if (checkoutField === currentField) {
                        return true;
                    }
                }

                return false;
            },

            /**
             * Set the data that will be sent to the server on place order.
             *
             * @returns {{method: (string|string|*), additional_data: {}}}
             */
            getData: function () {
                let paymentData = {
                    method: this.item.method,
                    additional_data: {}
                };

                if (this.paymentPayload) {
                    paymentData.additional_data.payload = this.paymentPayload;
                    return paymentData;
                }

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

                if (Math.floor(Date.now() / 1000) - this.paymentComponentLifeTime >= 540) {
                    customerData.invalidate(['multisafepay-payment-request']);
                    customerData.reload(['multisafepay-payment-request']).done(() => {
                        this.paymentRequestConfig = customerData.get('multisafepay-payment-request')();
                        this.initializePaymentComponent();
                        this.paymentComponentLifeTime = this.paymentRequestConfig.apiTokenLifeTime;
                    });
                }

                return true;
            },

            /**
             * Initialize the payment component for this payment method with the config from the server and the payment data for this method.
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
