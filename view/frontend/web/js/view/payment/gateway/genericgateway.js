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

/*browser:true*/
/*global define*/
define(
    [
        'jquery',
        'uiComponent',
        'Magento_Checkout/js/model/payment/renderer-list'
    ],

    /**
     *
     * @param Component
     * @param rendererList
     * @returns {*}
     */
    function (
        $,
        Component,
        rendererList
    ) {
        'use strict';
        var currentPayments = window.checkoutConfig.payment;

        $.each(currentPayments, function(key, value) {
            if (key.indexOf("multisafepay_genericgateway") !== -1) {
                rendererList.push(
                    {
                        type: key,
                        component: 'MultiSafepay_ConnectFrontend/js/view/payment/gateway/method-renderer/genericgateway',
                        config: value
                    }
                );
            }
        });

        /** Add view logic here if needed */
        return Component.extend({});
    }
);
