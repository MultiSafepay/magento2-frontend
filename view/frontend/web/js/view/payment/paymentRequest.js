define([
    'jquery',
    'ko',
    'underscore',
    'mageUtils',
    'Magento_Ui/js/lib/collapsible',
    'mage/translate',
    'Magento_Customer/js/customer-data'
], function (
    $,
    ko,
    _,
    utils,
    Collapsible,
    $t,
    customerData
) {
    'use strict';

    return {
        init: function () {
            var paymentRequest = customerData.get('multisafepay-payment-request')();

            if (paymentRequest && this.isAvailable()) {

                var paymentRequestApi = new PaymentRequest(
                );

                /**
                 * payment process
                 */
                paymentRequestApi.show().then(function (paymentResponse) {

                });


            } else {
                console.log($t("Payment Request Api data not available."));
            }
        },

        /**
         * check is Payment Request Api available for the browser
         */
        isAvailable : function() {
            var sUsrAg = navigator.userAgent;
            if (sUsrAg.indexOf("Chrome") <= -1 && sUsrAg.indexOf("Safari") > -1) {
                return false;
            } else if (window.PaymentRequest) {
                return true;
            }
            return false;
        }
    };
});
