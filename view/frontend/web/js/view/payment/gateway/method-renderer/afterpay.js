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
        'mage/translate',
        'Magento_Checkout/js/action/select-payment-method',
        'Magento_Checkout/js/model/payment/additional-validators',
        'Magento_Customer/js/customer-data',
        'multisafepayPaymentComponent'
    ],

    /**
     * @param Component
     * @param checkoutData
     * @param quote
     * @param $t
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
        $t,
        selectPaymentMethodAction,
        additionalValidators,
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
                this.paymentPayload = null;

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
             * Get the available genders for AfterPay as an array of objects with code and label to be used in the template.
             *
             * @returns {[{code: string, label},{code: string, label},{code: string, label}]}
             */
            getGenders: function () {
                return [
                    {"code": "mr", "label": $t('Mr.')},
                    {"code": "mrs", "label": $t('Mrs.')},
                    {"code": "miss", "label": $t('Miss')}
                ];
            },

            /**
             * Get the URL for the AfterPay terms and conditions from the config to be used in the template.
             *
             * @returns {*}
             */
            getAfterpayTermsUrl: function () {
                return this.paymentConfig.afterpay_terms_url;
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

                if (this.dateOfBirth()) {
                    data.additional_data.date_of_birth = this.dateOfBirth();
                }

                if (this.genderId()) {
                    data.additional_data.gender = this.genderId();
                }

                if (this.phoneNumber()) {
                    data.additional_data.phone_number = this.phoneNumber();
                }

                if (this.afterpayTerms()) {
                    data.additional_data.afterpay_terms = this.afterpayTerms();
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
             * Override placeOrder to include validation of the payment component (if enabled) and include its payload in the request.
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

                    if (payload) {
                        this.paymentPayload = payload;
                    }
                }

                return this._super(data, event);
            }
        });
    }
);
