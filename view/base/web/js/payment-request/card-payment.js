define([
    'multisafepayUtils',
    'mage/translate',
    'jquery'
], function (multisafepayUtils, $t, $) {
    'use strict';

    return {
        process: function (paymentRequest, paymentResponse, paymentCode, paymentRequestData) {
            let details = paymentResponse.details,
                publicApiToken = paymentRequestData.apiToken;

            if (!publicApiToken) {
                console.log($t("No public API token was provided."));
                paymentResponse.complete('fail');

                return false;
            }

            try {
                let encryptedData = this.getEncryptedData(details, publicApiToken);

                if (!encryptedData) {
                    console.log($t("Can\'t get the payment encrypted data."));
                    paymentResponse.complete('fail');

                    return false;
                }

                paymentResponse.complete('success');

                return encryptedData;
            } catch (e) {
                console.log(e);
                paymentResponse.complete('fail');
                return false;
            }
        },

        /**
         *
         * @param paymentDetails
         * @param publicApiToken
         * @returns {boolean|{payment_data: {payload: *}, gateway: string}}
         */
        getEncryptedData: function (paymentDetails, publicApiToken) {
            var cardNumber = multisafepayUtils.prepareCardNumber(paymentDetails.cardNumber),
                cardholderName = paymentDetails.cardholderName,
                cardDate = paymentDetails.expiryYear.substr(2, 2) + paymentDetails.expiryMonth,
                cardSecurityCode = paymentDetails.cardSecurityCode,
                encrypt = multisafepayUtils.prepareApiToken(publicApiToken),
                gatewayCode = 'CREDITCARD',
                payloadData = false;

            if (!cardNumber || !cardholderName || !cardDate || !cardSecurityCode || !encrypt) {
                return false;
            }

            payloadData = JSON.stringify({
                gateway: gatewayCode,
                customer: {
                    browser: multisafepayUtils.getBrowserInfo()
                },
                fields: {
                    'extvar1': multisafepayUtils.encryptData(cardNumber, encrypt),
                    'extvar2': multisafepayUtils.encryptData(cardholderName, encrypt),
                    'extvar3': multisafepayUtils.encryptData(cardDate, encrypt),
                    'extvar4': multisafepayUtils.encryptData(cardSecurityCode, encrypt)
                },
                encrypted: true
            });

            return multisafepayUtils.base64Encode(payloadData);
        },
    };
});
