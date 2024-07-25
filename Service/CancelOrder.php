<?php

declare(strict_types=1);

namespace MultiSafepay\ConnectFrontend\Service;

use Exception;
use Magento\Sales\Api\Data\OrderInterface;
use Magento\Sales\Model\Service\OrderService;
use MultiSafepay\ConnectCore\Factory\SdkFactory;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\Exception\ApiException;
use Psr\Http\Client\ClientExceptionInterface;

class CancelOrder
{
    /**
     * @var OrderService
     */
    private $orderService;

    /**
     * @var Logger
     */
    private $logger;

    /**
     * @var SdkFactory
     */
    private $sdkFactory;

    /**
     * @param OrderService $orderService
     * @param Logger $logger
     * @param SdkFactory $sdkFactory
     */
    public function __construct(
        OrderService $orderService,
        Logger $logger,
        SdkFactory $sdkFactory
    ) {
        $this->orderService = $orderService;
        $this->logger = $logger;
        $this->sdkFactory = $sdkFactory;
    }

    /**
     * Cancel the order whenever the transaction is a payment link and has not yet been converted to an order
     *
     * @param OrderInterface $order
     * @return void
     * @throws Exception
     */
    public function execute(OrderInterface $order)
    {
        $orderId = $order->getIncrementId();

        try {
            if ($this->isPaymentLink((int)$order->getStoreId(), $orderId)) {
                $this->orderService->cancel($order->getEntityId());
                $this->logger->logInfoForOrder($orderId, 'Pretransaction found, order canceled by Cancel controller');
            }
        } catch (Exception | ClientExceptionInterface $exception) {
            $this->logger->logInfoForOrder($orderId, 'Exception occurred when trying to cancel order');
            $this->logger->logExceptionForOrder($orderId, $exception);
        }
    }

    /**
     * Check if the transaction has already been converted from a payment link to an order
     *
     * @param int $storeId
     * @param string $orderId
     * @return bool
     * @throws ApiException
     * @throws ClientExceptionInterface
     * @throws Exception
     */
    private function isPaymentLink(int $storeId, string $orderId): bool
    {
        $sdk = $this->sdkFactory->create($storeId);
        $transaction = $sdk->getTransactionManager()->get($orderId);

        if ($transaction->getOrderId()) {
            return false;
        }

        return true;
    }
}
