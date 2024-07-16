<?php

declare(strict_types=1);

namespace MultiSafepay\ConnectFrontend\Plugin\CustomerBalance\Observer;

use Magento\CustomerBalance\Observer\RevertStoreCreditObserver;
use Magento\Framework\Event\Observer;

class RevertStoreCreditObserverPlugin
{
    /**
     * @param RevertStoreCreditObserver $subject
     * @param Observer $observer
     * @return array|null
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function beforeExecute(
        \Magento\CustomerBalance\Observer\RevertStoreCreditObserver $subject,
        Observer $observer
    ): ?array {
        if ($observer->getEvent()->getName() !== 'restore_quote') {
            return null;
        }

        $order = $observer->getOrder();
        $payment = $order->getPayment();

        if (!$payment) {
            return null;
        }

        $methodInstance = $payment->getMethodInstance();

        if (!$methodInstance) {
            return null;
        }

        if (!$methodInstance->getConfigData('is_multisafepay')) {
            return null;
        }

        $order->setBaseCustomerBalanceAmount(0);

        return [$observer];
    }
}
