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

namespace MultiSafepay\ConnectFrontend\Service\Notification;

use Exception;
use Magento\Sales\Model\Order;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Service\OrderService;
use MultiSafepay\Exception\ApiException;
use MultiSafepay\Exception\InvalidApiKeyException;
use Psr\Http\Client\ClientExceptionInterface;

class ProcessOrderTransaction
{
    /**
     * @var Logger
     */
    private $logger;

    /**
     * @var OrderService
     */
    private $orderService;

    /**
     * @param Logger $logger
     * @param OrderService $orderService
     */
    public function __construct(
        Logger $logger,
        OrderService $orderService
    ) {
        $this->logger = $logger;
        $this->orderService = $orderService;
    }

    /**
     * Process the order by the transaction
     *
     * @param Order $order
     * @param array $transaction
     * @return array
     * @throws Exception
     */
    public function execute(Order $order, array $transaction): array
    {
        $orderIncrementId = $order->getIncrementId();

        try {
            $this->orderService->processOrderTransaction($order, $transaction);
            return ['success' => true];
        } catch (InvalidApiKeyException $invalidApiKeyException) {
            $this->logger->logInvalidApiKeyException($invalidApiKeyException);

            return ['success' => false, 'message' => sprintf('%1$s', $invalidApiKeyException->getMessage())];
        } catch (ApiException $apiException) {
            $this->logger->logGetRequestApiException($orderIncrementId, $apiException);

            return [
                'success' => false,
                'message' => sprintf(
                    '(%1$s) %2$s. Please check
                    https://docs.multisafepay.com/developers/errors/
                    for a detailed explanation',
                    $apiException->getCode(),
                    $apiException->getMessage()
                )
            ];
        } catch (ClientExceptionInterface $clientException) {
            $this->logger->logClientException($orderIncrementId, $clientException);

            return [
                'success' => false,
                'message' => sprintf('ClientException occured. %1$s', $clientException->getMessage())
            ];
        } catch (Exception $exception) {
            $this->logger->logExceptionForOrder($orderIncrementId, $exception);

            return [
                'success' => false,
                'message' => sprintf(
                    'Exception occured when trying to process the order: %1$s',
                    $exception->getMessage()
                )
            ];
        }
    }
}
