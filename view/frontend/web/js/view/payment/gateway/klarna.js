/**
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is provided with Magento in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * Copyright © 2020 MultiSafepay, Inc. All rights reserved.
 * See DISCLAIMER.md for disclaimer details.
 *
 */

/*browser:true*/
/*global define*/
define(
    [
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
        Component,
        rendererList
    ) {
        'use strict';
        rendererList.push(
            {
                type: 'multisafepay_klarna',
                component: 'MultiSafepay_ConnectFrontend/js/view/payment/gateway/method-renderer/klarna'
            }
        );
        /** Add view logic here if needed */
        return Component.extend({});
    }
);
