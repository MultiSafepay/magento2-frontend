<?php
/**
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is provided with Magento in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * See DISCLAIMER.md for disclaimer details.
 */

declare(strict_types=1);

namespace MultiSafepay\ConnectFrontend\Service;

use Exception;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Sales\Model\Order;
use MultiSafepay\ConnectCore\Factory\SdkFactory;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Util\OrderUtil;
use MultiSafepay\ConnectFrontend\Service\Notification\DelayExecution;
use MultiSafepay\ConnectFrontend\Service\Notification\ProcessOrderTransaction;
use Psr\Http\Client\ClientExceptionInterface;

class GetNotification
{
    /**
     * @var Logger
     */
    private $logger;

    /**
     * @var OrderUtil
     */
    private $orderUtil;

    /**
     * @var SdkFactory
     */
    private $sdkFactory;

    /**
     * @var DelayExecution
     */
    private $delayExecution;

    /**
     * @var ProcessOrderTransaction
     */
    private $processOrderTransaction;

    /**
     * GetNotification constructor.
     *
     * @param Logger $logger
     * @param OrderUtil $orderUtil
     * @param SdkFactory $sdkFactory
     * @param DelayExecution $delayExecution
     * @param ProcessOrderTransaction $processOrderTransaction
     */
    public function __construct(
        Logger $logger,
        OrderUtil $orderUtil,
        SdkFactory $sdkFactory,
        DelayExecution $delayExecution,
        ProcessOrderTransaction $processOrderTransaction
    ) {
        $this->logger = $logger;
        $this->orderUtil = $orderUtil;
        $this->sdkFactory = $sdkFactory;
        $this->delayExecution = $delayExecution;
        $this->processOrderTransaction = $processOrderTransaction;
    }

    /**
     * Execute the GET notification process
     *
     * @param string $orderIncrementId
     * @param int $storeId
     * @return array
     * @throws Exception
     */
    public function execute(string $orderIncrementId, int $storeId): array
    {
        //Retrieve transaction from API call
        $transactionManager = $this->sdkFactory->create($storeId)->getTransactionManager();

        try {
            $transactionResponse = $transactionManager->get($orderIncrementId);
        } catch (ClientExceptionInterface $clientException) {
            $this->logger->logExceptionForOrder($orderIncrementId, $clientException);
            return ['success' => false, 'message' => sprintf('%1$s', $clientException->getMessage())];
        }

        $transaction = $transactionResponse->getData();
        $this->logger->logInfoForOrder(
            $orderIncrementId,
            __('Transaction data retrieved through API call')->render(),
            Logger::DEBUG
        );

        $this->delayExecution->execute($transaction['status'] ?? '');

        try {
            /** @var Order $order */
            $order = $this->orderUtil->getOrderByIncrementId($orderIncrementId);
        } catch (NoSuchEntityException $noSuchEntityException) {
            $this->logger->logExceptionForOrder($orderIncrementId, $noSuchEntityException);

            return ['success' => false, 'message' => $noSuchEntityException->getMessage()];
        }

        return $this->processOrderTransaction->execute($order, $transaction);
    }
}
