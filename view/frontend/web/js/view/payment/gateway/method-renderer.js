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

        let gatewayPath = 'MultiSafepay_ConnectFrontend/js/view/payment/gateway/method-renderer/';

        rendererList.push(
            {type: 'multisafepay_afterpay', component: gatewayPath + 'afterpay'},
            {type: 'multisafepay_alipay', component: gatewayPath + 'alipay'},
            {type: 'multisafepay_amex', component: gatewayPath + 'amex'},
            {type: 'multisafepay_applepay', component: gatewayPath + 'applepay'},
            {type: 'multisafepay_bancontact', component: gatewayPath + 'bancontact'},
            {type: 'multisafepay_banktransfer', component: gatewayPath + 'banktransfer'},
            {type: 'multisafepay_belfius', component: gatewayPath + 'belfius'},
            {type: 'multisafepay_cbc', component: gatewayPath + 'cbc'},
            {type: 'multisafepay_creditcard', component: gatewayPath + 'creditcard'},
            {type: 'multisafepay_directbanktransfer', component: gatewayPath + 'directbanktransfer'},
            {type: 'multisafepay_directdebit', component: gatewayPath + 'directdebit'},
            {type: 'multisafepay_dotpay', component: gatewayPath + 'dotpay'},
            {type: 'multisafepay_einvoicing', component: gatewayPath + 'einvoicing'},
            {type: 'multisafepay_eps', component: gatewayPath + 'eps'},
            {type: 'multisafepay_genericgateway', component: gatewayPath + 'genericgateway'},
            {type: 'multisafepay_giropay', component: gatewayPath + 'giropay'},
            {type: 'multisafepay_ideal', component: gatewayPath + 'ideal'},
            {type: 'multisafepay_idealqr', component: gatewayPath + 'idealqr'},
            {type: 'multisafepay_in3', component: gatewayPath + 'in3'},
            {type: 'multisafepay_inghomepay', component: gatewayPath + 'inghomepay'},
            {type: 'multisafepay_kbc', component: gatewayPath + 'kbc'},
            {type: 'multisafepay_klarna', component: gatewayPath + 'klarna'},
            {type: 'multisafepay_maestro', component: gatewayPath + 'maestro'},
            {type: 'multisafepay_mastercard', component: 'mastercard'},
            {type: 'multisafepay', component: gatewayPath + 'multisafepay'},
            {type: 'multisafepay_payafter', component: gatewayPath + 'payafter'},
            {type: 'multisafepay_paypal', component: gatewayPath + 'paypal'},
            {type: 'multisafepay_paysafecard', component: gatewayPath + 'paysafecard'},
            {type: 'multisafepay_santander', component: gatewayPath + 'santander'},
            {type: 'multisafepay_sofort', component: gatewayPath + 'sofort'},
            {type: 'multisafepay_trustly', component: gatewayPath + 'trustly'},
            {type: 'multisafepay_trustpay', component: gatewayPath + 'trustpay'},
            {type: 'multisafepay_visa', component: 'visa'},
        );

        /** Add view logic here if needed */
        return Component.extend({});
    }
);
