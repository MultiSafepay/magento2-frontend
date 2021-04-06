define([
    'mspCrypt',
    'mage/translate',
    'jquery'
], function (mspCrypt, $t, $) {
    'use strict';

    return {
        /**
         *
         * @param publicApiToken
         * @returns {*}
         */
        prepareApiToken: function (publicApiToken) {
            var splittedApiToken = publicApiToken.split('.');

            return splittedApiToken[splittedApiToken.length - 1]
        },

        /**
         *
         * @param publicApiToken
         * @returns {string|boolean}
         */
        prepareCardNumber: function (publicApiToken) {
            let v = publicApiToken.replace(/\s+/g, '').replace(/[^0-9]/gi, ''),
                matches = v.match(/\d{4,16}/g),
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
            const encrypt = new MSPCrypt();
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
        }
    };
});
