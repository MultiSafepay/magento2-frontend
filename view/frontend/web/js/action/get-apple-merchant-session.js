/**
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is provided with Magento in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * Copyright © 2021 MultiSafepay, Inc. All rights reserved.
 * See DISCLAIMER.md for disclaimer details.
 *
 */
define(
    [
        'mage/storage',
        'Magento_Checkout/js/model/error-processor',
        'Magento_Checkout/js/model/full-screen-loader',
        'underscore'
    ],
    function (storage, errorProcessor, fullScreenLoader, _) {
        'use strict';

        return function (serviceUrl, validationUrl) {
            let payload = {
                originDomain: window.location.hostname,
                validationUrl: validationUrl
            };

            fullScreenLoader.startLoader();

            console.log(payload);

            return storage.post(
                serviceUrl, JSON.stringify(payload), false
            ).fail(
                function (response) {
                    // errorProcessor.process(response, messageContainer);
                }
            ).success(
                function (response) {

                }
            ).always(
                function () {
                    fullScreenLoader.stopLoader();
                }
            );
        };
    }
);
