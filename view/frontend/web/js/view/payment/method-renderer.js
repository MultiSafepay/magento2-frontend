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
     * @param $
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

        let currentPaymentsList = window.checkoutConfig.payment;
        let gatewayPath = 'MultiSafepay_ConnectFrontend/js/view/payment/gateway/method-renderer/';
        let baseRenderer = 'MultiSafepay_ConnectFrontend/js/view/payment/method-renderer/base-renderer';

        $.each(currentPaymentsList, function(key, value) {
            if (key.indexOf("multisafepay_genericgateway") !== -1) {
                rendererList.push(
                    {
                        type: key,
                        component: gatewayPath + 'genericgateway',
                        config: value
                    }
                );
            }
        });

        rendererList.push(
            {type: 'multisafepay_afterpay', component: gatewayPath + 'afterpay'},
            {type: 'multisafepay_alipay', component: baseRenderer},
            {type: 'multisafepay_amex', component: gatewayPath + 'creditcard'},
            {type: 'multisafepay_applepay', component: gatewayPath + 'applepay'},
            {type: 'multisafepay_bancontact', component: baseRenderer},
            {type: 'multisafepay_banktransfer', component: baseRenderer},
            {type: 'multisafepay_belfius', component: baseRenderer},
            {type: 'multisafepay_cbc', component: baseRenderer},
            {type: 'multisafepay_creditcard', component: gatewayPath + 'creditcard'},
            {type: 'multisafepay_directbanktransfer', component: gatewayPath + 'directbanktransfer'},
            {type: 'multisafepay_directdebit', component: gatewayPath + 'directdebit'},
            {type: 'multisafepay_dotpay', component: baseRenderer},
            {type: 'multisafepay_einvoicing', component: gatewayPath + 'einvoicing'},
            {type: 'multisafepay_eps', component: baseRenderer},
            {type: 'multisafepay_giropay', component: baseRenderer},
            {type: 'multisafepay_ideal', component: gatewayPath + 'ideal'},
            {type: 'multisafepay_idealqr', component: baseRenderer},
            {type: 'multisafepay_in3', component: gatewayPath + 'in3'},
            {type: 'multisafepay_inghomepay', component: baseRenderer},
            {type: 'multisafepay_kbc', component: baseRenderer},
            {type: 'multisafepay_klarna', component: baseRenderer},
            {type: 'multisafepay_maestro', component: baseRenderer},
            {type: 'multisafepay_mastercard', component: gatewayPath + 'creditcard'},
            {type: 'multisafepay', component: baseRenderer},
            {type: 'multisafepay_payafter', component: gatewayPath + 'payafter'},
            {type: 'multisafepay_paypal', component: baseRenderer},
            {type: 'multisafepay_paysafecard', component: baseRenderer},
            {type: 'multisafepay_santander', component: baseRenderer},
            {type: 'multisafepay_sofort', component: baseRenderer},
            {type: 'multisafepay_trustly', component: baseRenderer},
            {type: 'multisafepay_trustpay', component: baseRenderer},
            {type: 'multisafepay_visa', component: gatewayPath + 'creditcard'},
            {type: 'multisafepay_babygiftcard', component: baseRenderer},
            {type: 'multisafepay_beautyandwellness', component: baseRenderer},
            {type: 'multisafepay_boekenbon', component: baseRenderer},
            {type: 'multisafepay_fashioncheque', component: baseRenderer},
            {type: 'multisafepay_fashiongiftcard', component: baseRenderer},
            {type: 'multisafepay_fietsenbon', component: baseRenderer},
            {type: 'multisafepay_gezondheidsbon', component: baseRenderer},
            {type: 'multisafepay_givacard', component: baseRenderer},
            {type: 'multisafepay_good4fun', component: baseRenderer},
            {type: 'multisafepay_goodcard', component: baseRenderer},
            {type: 'multisafepay_nationaletuinbon', component: baseRenderer},
            {type: 'multisafepay_parfumcadeaukaart', component: baseRenderer},
            {type: 'multisafepay_podiumcadeaukaart', component: baseRenderer},
            {type: 'multisafepay_sportenfit', component: baseRenderer},
            {type: 'multisafepay_vvvcadeaukaart', component: baseRenderer},
            {type: 'multisafepay_webshopgiftcard', component: baseRenderer},
            {type: 'multisafepay_wellnessgiftcard', component: baseRenderer},
            {type: 'multisafepay_wijncadeau', component: baseRenderer},
            {type: 'multisafepay_winkelcheque', component: baseRenderer},
            {type: 'multisafepay_yourgift', component: baseRenderer},
        );

        /** Add view logic here if needed */
        return Component.extend({});
    }
);
