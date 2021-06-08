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
 * Copyright © 2021 MultiSafepay, Inc. All rights reserved.
 * See DISCLAIMER.md for disclaimer details.
 *
 */

declare(strict_types=1);

namespace MultiSafepay\ConnectFrontend\Controller\Connect;

use Exception;
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Sales\Model\Order;
use MultiSafepay\ConnectCore\Config\Config;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Service\OrderService;
use MultiSafepay\ConnectCore\Util\OrderUtil;
use MultiSafepay\Exception\ApiException;
use MultiSafepay\Exception\InvalidApiKeyException;
use Psr\Http\Client\ClientExceptionInterface;

class Notification extends Action
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
     * @var OrderUtil
     */
    private $orderUtil;

    /**
     * @var Config
     */
    private $config;

    /**
     * Notification constructor.
     *
     * @param Context $context
     * @param Config $config
     * @param Logger $logger
     * @param OrderService $orderService
     * @param OrderUtil $orderUtil
     */
    public function __construct(
        Context $context,
        Config $config,
        Logger $logger,
        OrderService $orderService,
        OrderUtil $orderUtil
    ) {
        parent::__construct($context);
        $this->logger = $logger;
        $this->orderService = $orderService;
        $this->orderUtil = $orderUtil;
        $this->config = $config;
    }

    /**
     * @inheritDoc
     * @throws Exception
     */
    public function execute()
    {
        $params = $this->getRequest()->getParams();

        $orderId = '';

        try {
            if (!isset($params['transactionid'], $params['timestamp'])) {
                throw new LocalizedException(__('Transaction params are not correct.'));
            }

            $orderIncrementId = $params['transactionid'];

            /** @var Order $order */
            $order = $this->orderUtil->getOrderByIncrementId($orderIncrementId);
            if (!$order->getId()) {
                throw new NoSuchEntityException(__('Requested order doesn\'t exist'));
            }

            $authHeader = $this->getRequest()->getHeader('Auth');

            // phpcs:ignore Magento2.Functions.DiscouragedFunction
            $base64Auth = base64_decode($authHeader);
            $timestampAndHash = explode(':', $base64Auth);

            $dataToHash = $timestampAndHash[0] . ':' . $this->getRequest()->getContent();

            $hashToCheck = hash_hmac('sha512', $dataToHash, $this->config->getApiKey($order->getStoreId()));

            if ($hashToCheck !== $timestampAndHash[1]) {
                $this->logger->logInfoForOrder($orderIncrementId, 'Hashes do not match, process aborted');
                return $this->getResponse()->setContent('ng');
            }

            $this->orderService->processOrderTransaction($order);
        } catch (InvalidApiKeyException $invalidApiKeyException) {
            $this->logger->logInvalidApiKeyException($invalidApiKeyException);

            return $this->getResponse()->setContent('ng');
        } catch (ApiException $e) {
            $this->logger->logGetRequestApiException($orderId, $e);

            return $this->getResponse()->setContent('ng');
        } catch (ClientExceptionInterface $clientException) {
            $this->logger->logClientException($orderId, $clientException);

            return $this->getResponse()->setContent('ng');
        } catch (Exception $exception) {
            $this->logger->logExceptionForOrder($orderId, $exception);

            return $this->getResponse()->setContent('ng');
        }

        return $this->getResponse()->setContent('ok');
    }
}
