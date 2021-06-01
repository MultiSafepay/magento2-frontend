<?php
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

declare(strict_types=1);

namespace MultiSafepay\ConnectFrontend\Observer;

use Magento\Checkout\Model\Session;
use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Exception\LocalizedException;
use Magento\Sales\Model\Order;
use Magento\Sales\Model\Order\Payment;
use MultiSafepay\ConnectCore\Model\Ui\Gateway\BankTransferConfigProvider;
use MultiSafepay\ConnectCore\Util\PaymentMethodUtil;

class RestoreQuoteObserver implements ObserverInterface
{

    /**
     * @var Session
     */
    private $checkoutSession;

    /**
     * @var PaymentMethodUtil
     */
    private $paymentMethodUtil;

    /**
     * RestoreQuoteObserver constructor.
     *
     * @param Session $checkoutSession
     * @param PaymentMethodUtil $paymentMethodUtil
     */
    public function __construct(
        Session $checkoutSession,
        PaymentMethodUtil $paymentMethodUtil
    ) {
        $this->checkoutSession = $checkoutSession;
        $this->paymentMethodUtil = $paymentMethodUtil;
    }

    /**
     * @param Observer $observer
     */
    public function execute(Observer $observer): void
    {
        $lastRealOrder = $this->checkoutSession->getLastRealOrder();

        if ($this->checkoutSession->getQuoteId() || !$lastRealOrder->getPayment()) {
            return;
        }

        /** @var Payment $payment */
        $payment = $lastRealOrder->getPayment();

        if (!$this->paymentMethodUtil->isMultisafepayOrder($lastRealOrder)) {
            return;
        }

        if ($payment->getMethod() === BankTransferConfigProvider::CODE) {
            return;
        }

        if ($lastRealOrder->getState() !== Order::STATE_PENDING_PAYMENT) {
            return;
        }

        $this->checkoutSession->restoreQuote();
    }
}
