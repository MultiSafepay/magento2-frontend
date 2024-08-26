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
        'mage/translate',
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
     * @param $t
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
        $t,
        selectPaymentMethodAction,
        additionalValidators,
        placeOrderAction,
        customerData,
        multisafepayPaymentComponent
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
                paymentType: 'payment_component',
                dateOfBirth: '',
                genderId: '',
                phoneNumber: getAfterPayTelephone(),
                afterpayTerms: false,
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
                if (this.paymentPayload) {
                    let data = {
                        'method': this.getCode(),
                        'additional_data': {}
                    };

                    data['additional_data']['payload'] = this.paymentPayload;

                    return data;
                }

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
