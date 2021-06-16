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
use MultiSafepay\Client\Client;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Service\OrderService;
use MultiSafepay\ConnectCore\Util\JsonHandler;
use MultiSafepay\ConnectCore\Util\OrderUtil;
use MultiSafepay\ConnectFrontend\Validator\RequestValidator;
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
     * @var RequestValidator
     */
    private $requestValidator;

    /**
     * @var JsonHandler
     */
    private $jsonHandler;

    /**
     * Notification constructor.
     *
     * @param Context $context
     * @param JsonHandler $jsonHandler
     * @param Logger $logger
     * @param OrderService $orderService
     * @param OrderUtil $orderUtil
     * @param RequestValidator $requestValidator
     */
    public function __construct(
        Context $context,
        JsonHandler $jsonHandler,
        Logger $logger,
        OrderService $orderService,
        OrderUtil $orderUtil,
        RequestValidator $requestValidator
    ) {
        parent::__construct($context);
        $this->jsonHandler = $jsonHandler;
        $this->logger = $logger;
        $this->orderService = $orderService;
        $this->orderUtil = $orderUtil;
        $this->requestValidator = $requestValidator;
    }

    /**
     * @inheritDoc
     * @throws Exception
     */
    public function execute()
    {
        if ($this->getRequest()->getMethod() === Client::METHOD_GET) {
            return $this->getResponse()->setContent('ng');
        }

        $params = $this->getRequest()->getParams();

        if (!isset($params['transactionid'], $params['timestamp'])) {
            return $this->getResponse()->setContent('ng');
        }

        $orderIncrementId = $params['transactionid'];

        try {
            /** @var Order $order */
            $order = $this->orderUtil->getOrderByIncrementId($orderIncrementId);
        } catch (NoSuchEntityException $noSuchEntityException) {
            $this->logger->logExceptionForOrder($orderIncrementId, $noSuchEntityException);

            return $this->getResponse()->setContent('ng');
        }

        try {
            $transaction = $this->getRequest()->getContent();

            if (!$this->requestValidator->validatePostNotification(
                $this->getRequest()->getHeader('Auth'),
                $transaction,
                (int)$order->getStoreId()
            )) {
                $this->logger->logInfoForOrder($orderIncrementId, 'Hashes do not match, process aborted');

                return $this->getResponse()->setContent('ng');
            }
            $this->orderService->processOrderTransaction($order, $this->jsonHandler->ReadJson($transaction));
        } catch (InvalidApiKeyException $invalidApiKeyException) {
            $this->logger->logInvalidApiKeyException($invalidApiKeyException);

            return $this->getResponse()->setContent('ng');
        } catch (ApiException $e) {
            $this->logger->logGetRequestApiException($orderIncrementId, $e);

            return $this->getResponse()->setContent('ng');
        } catch (ClientExceptionInterface $clientException) {
            $this->logger->logClientException($orderIncrementId, $clientException);

            return $this->getResponse()->setContent('ng');
        } catch (Exception $exception) {
            $this->logger->logExceptionForOrder($orderIncrementId, $exception);

            return $this->getResponse()->setContent('ng');
        }

        return $this->getResponse()->setContent('ok');
    }
}
