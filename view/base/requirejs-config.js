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

let config = {
    map: {
        '*': {
            mspCrypt: 'MultiSafepay_ConnectFrontend/js/lib/msp-crypt',
            multisafepayUtils: 'MultiSafepay_ConnectFrontend/js/lib/utils',
            multisafepayPaymentRequest: 'MultiSafepay_ConnectFrontend/js/payment-request',
            multisafepayCreditCardComponent: 'MultiSafepay_ConnectFrontend/js/credit-card-component',
            multisafepayCreditCardComponentLib:  'https://pay.multisafepay.com/sdk/components/v1/components.js',
            multisafepayCardPaymentProcessor: 'MultiSafepay_ConnectFrontend/js/payment-request/card-payment',
            multisafepayApplePayButton: 'MultiSafepay_ConnectFrontend/js/apple-pay',
        }
    }
};
