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

class RestoreQuoteObserver implements ObserverInterface
{

    /**
     * @var Session
     */
    private $checkoutSession;

    /**
     * RestoreQuoteObserver constructor.
     *
     * @param Session $checkoutSession
     */
    public function __construct(
        Session $checkoutSession
    ) {
        $this->checkoutSession = $checkoutSession;
    }

    /**
     * @param Observer $observer
     * @throws LocalizedException
     */
    public function execute(Observer $observer): void
    {
        $lastRealOrder = $this->checkoutSession->getLastRealOrder();

        if (!$lastRealOrder->getPayment()) {
            return;
        }

        /** @var Payment $payment */
        $payment = $lastRealOrder->getPayment();
        $isMultiSafepay = $payment->getMethodInstance()->getConfigData('is_multisafepay');

        if (!$isMultiSafepay) {
            return;
        }

        if ($payment->getMethod() === BankTransferConfigProvider::CODE) {
            return;
        }

        if ($lastRealOrder->getState() !== Order::STATE_NEW) {
            return;
        }

        $this->checkoutSession->restoreQuote();
    }
}
