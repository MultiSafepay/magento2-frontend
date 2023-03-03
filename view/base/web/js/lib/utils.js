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
    'mspCrypt'
], function (mspCrypt) {
    'use strict';

    return {
        /**
         *
         * @param publicApiToken
         * @returns {*}
         */
        prepareApiToken: function (publicApiToken) {
            let splittedApiToken = publicApiToken.split('.');

            return splittedApiToken[splittedApiToken.length - 1]
        },

        /**
         *
         * @param publicApiToken
         * @returns {string|boolean}
         */
        prepareCardNumber: function (publicApiToken) {
            let value = publicApiToken.replace(/\s+/g, '').replace(/[^0-9]/gi, ''),
                matches = value.match(/\d{4,16}/g),
                match = matches && matches[0] || '',
                parts = [],
                i = 0, len = 0;

            for (i = 0, len = match.length; i < len; i += 4) {
                parts.push(match.substring(i, i + 4))
            }

            return parts.length ? parts.join(' ') : false;
        },

        /**
         *
         * @param value
         * @param publicKey
         * @returns {*}
         */
        encryptData: function (value, publicKey) {
            const lib = 'MSPCrypt';

            if (!window[lib]) {
                throw 'Encryption library not loaded';
            }

            const encrypt = new window[lib]();
            encrypt.setPublicKey(publicKey);

            return encrypt.encrypt(value);
        },

        /**
         *
         * @returns {{}}
         */
        getBrowserPlugins: function () {
            const plugins = {};

            if (navigator.plugins && navigator.plugins.length) {
                for (let x = 0; x < navigator.plugins.length; x++) {
                    const plugin_name = navigator.plugins[x].name;
                    if (plugin_name.indexOf('Java(TM)') != -1) {
                        plugins['java'] = true;
                        break;
                    } else if (plugin_name.indexOf('Java ') != -1) {
                        plugins['java'] = true;
                        break;
                    }
                }
            }
            return plugins;
        },

        /**
         *
         * @returns {{javascript_enabled: number, screen_color_depth: number, screen_width: number, screen_height: number, java_enabled: number, cookies_enabled: number, language: string, time_zone: number, user_agent: string, platform: string}}
         */
        getBrowserInfo: function () {
            const plugins = this.getBrowserPlugins();

            return {
                java_enabled: (plugins['java'] ? 1 : 0),
                javascript_enabled: 1,
                language: navigator.language,
                screen_color_depth: window.screen.colorDepth,
                screen_height: window.screen.height,
                screen_width: window.screen.width,
                time_zone: (new Date()).getTimezoneOffset(),
                user_agent: navigator.userAgent,
                cookies_enabled: (navigator.cookieEnabled ? 1 : 0),
                platform: navigator.platform,
            };
        },

        /**
         *
         * @param string
         * @returns {string}
         */
        base64Encode: function (string) {
            return btoa(unescape(encodeURIComponent(string)))
        },

        /**
         *
         * @param string
         * @returns {string}
         */
        base64Decode: function (string) {
            return decodeURIComponent(escape(window.atob(str)));
        },

        /**
         *
         * @param paymentDetails
         * @param publicApiToken
         * @returns {string|boolean}
         */
        getEncryptedData: function (paymentDetails, publicApiToken) {
            const gatewayCode = 'CREDITCARD';
            let cardNumber = this.prepareCardNumber(paymentDetails.cardNumber),
                cardholderName = paymentDetails.cardholderName,
                cardDate = paymentDetails.expiryYear.substr(2, 2) + paymentDetails.expiryMonth,
                cardSecurityCode = paymentDetails.cardSecurityCode,
                encrypt = this.prepareApiToken(publicApiToken),
                payloadData = false;

            if (!cardNumber || !cardholderName || !cardDate || !cardSecurityCode || !encrypt) {
                return false;
            }

            payloadData = JSON.stringify({
                gateway: gatewayCode,
                customer: {
                    browser: this.getBrowserInfo()
                },
                fields: {
                    'extvar1': this.encryptData(cardNumber, encrypt),
                    'extvar2': this.encryptData(cardholderName, encrypt),
                    'extvar3': this.encryptData(cardDate, encrypt),
                    'extvar4': this.encryptData(cardSecurityCode, encrypt)
                },
                encrypted: true
            });

            return this.base64Encode(payloadData);
        },

        /**
         *
         * @returns {boolean}
         */
        isPaymentRequestAvailable: function () {
            let userAgent = navigator.userAgent;

            if (userAgent.indexOf("Chrome") <= -1 && userAgent.indexOf("Safari") > -1) {
                return false;
            } else if (window.PaymentRequest) {
                return true;
            }

            return false;
        }
    };
});
