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
use Magento\Framework\App\CsrfAwareActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\Request\InvalidRequestException;
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

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class Notification extends Action implements CsrfAwareActionInterface
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
     * @param RequestInterface $request
     * @return InvalidRequestException|null
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function createCsrfValidationException(RequestInterface $request): ?InvalidRequestException
    {
        return null;
    }

    /**
     * @param RequestInterface $request
     * @return bool|null
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function validateForCsrf(RequestInterface $request): ?bool
    {
        return true;
    }

    /**
     * @inheritDoc
     * @throws Exception
     */
    public function execute()
    {
        $params = $this->getRequest()->getParams();

        if (!isset($params['transactionid'], $params['timestamp'])) {
            return $this->getResponse()->setContent('ng: Missing transaction id or timestamp');
        }

        $orderIncrementId = $params['transactionid'];

        try {
            /** @var Order $order */
            $order = $this->orderUtil->getOrderByIncrementId($orderIncrementId);
        } catch (NoSuchEntityException $noSuchEntityException) {
            $this->logger->logExceptionForOrder($orderIncrementId, $noSuchEntityException);

            return $this->getResponse()->setContent(
                sprintf(
                    'ng: %1$s',
                    $noSuchEntityException->getMessage()
                )
            );
        }

        try {
            if ($this->getRequest()->getMethod() !== Client::METHOD_POST) {
                $this->orderService->processOrderTransaction($order);
            } else {
                $transaction = $this->getRequest()->getContent();

                if (!$this->requestValidator->validatePostNotification(
                    $this->getRequest()->getHeader('Auth'),
                    $transaction,
                    (int)$order->getStoreId()
                )) {
                    $this->logger->logInfoForOrder($orderIncrementId, 'Validating POST Notification failed');
                    $this->orderService->processOrderTransaction($order);
                }

                $this->orderService->processOrderTransaction($order, $this->jsonHandler->ReadJson($transaction));
            }
        } catch (InvalidApiKeyException $invalidApiKeyException) {
            $this->logger->logInvalidApiKeyException($invalidApiKeyException);

            return $this->getResponse()->setContent(
                sprintf('ng: %1$s', $invalidApiKeyException->getMessage())
            );
        } catch (ApiException $apiException) {
            $this->logger->logGetRequestApiException($orderIncrementId, $apiException);

            return $this->getResponse()->setContent(
                sprintf(
                    'ng: (%1$s) %2$s. Please check 
                    https://docs.multisafepay.com/developer/errors-explained/understanding-and-resolving-errors/ 
                    for a detailed explanation',
                    $apiException->getCode(),
                    $apiException->getMessage()
                )
            );
        } catch (ClientExceptionInterface $clientException) {
            $this->logger->logClientException($orderIncrementId, $clientException);

            return $this->getResponse()->setContent(
                sprintf('ng: ClientException occured. %1$s', $clientException->getMessage())
            );
        } catch (Exception $exception) {
            $this->logger->logExceptionForOrder($orderIncrementId, $exception);

            return $this->getResponse()->setContent(
                sprintf('ng: Exception occured when trying to process the order: %1$s', $exception->getMessage())
            );
        }

        return $this->getResponse()->setContent('ok');
    }
}
