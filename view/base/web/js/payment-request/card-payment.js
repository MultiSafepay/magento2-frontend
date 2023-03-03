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
define([
    'multisafepayUtils',
    'mage/translate',
    'jquery'
], function (multisafepayUtils, $t, $) {
    'use strict';

    return {
        /**
         *
         * @param paymentRequest
         * @param paymentResponse
         * @param paymentCode
         * @param paymentRequestData
         * @returns {*|string|boolean|boolean}
         */
        process: function (paymentRequest, paymentResponse, paymentCode, paymentRequestData) {
            let details = paymentResponse.details,
                publicApiToken = paymentRequestData.apiToken;

            if (!publicApiToken) {
                console.log($t("No public API token was provided."));
                paymentResponse.complete('fail');

                return false;
            }

            try {
                let encryptedData = multisafepayUtils.getEncryptedData(details, publicApiToken);

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
        }
    };
});
