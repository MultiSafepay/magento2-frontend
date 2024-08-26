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
     * @param quote
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
        quote,
        url,
        selectPaymentMethodAction,
        additionalValidators,
        placeOrderAction,
        customerData,
        multisafepayPaymentComponent
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
                paymentType: 'payment_component',
                dateOfBirth: '',
                accountNumber: '',
                emailAddress: getEmailAddress(),
            },

            initialize: function () {
                this._super();
                this.paymentRequestConfig = customerData.get('multisafepay-payment-request')();
                this.paymentComponent = false;
                this.paymentPayload = false;
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
                if (this.paymentPayload) {
                    let data = {
                        'method': this.getCode(),
                        'additional_data': {}
                    };

                    data['additional_data']['payload'] = this.paymentPayload;

                    return data;
                }

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

            /**
             * @return {Boolean}
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

                /**
                 * Compare the current time with the API Token lifetime and refresh if needed
                 */
                if (Math.floor(Date.now()/1000) - this.paymentComponentLifeTime >= 540) {
                    customerData.invalidate(['multisafepay-payment-request']);
                    customerData.reload(['multisafepay-payment-request']).done(() => {
                            this.paymentRequestConfig = customerData.get('multisafepay-payment-request')();
                            this.initializePaymentComponent();
                            this.paymentComponentLifeTime = this.paymentRequestConfig.apiTokenLifeTime;
                        }
                    );
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
