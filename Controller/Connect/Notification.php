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
use Magento\Sales\Api\Data\OrderInterfaceFactory;
use Magento\Sales\Model\Order;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Service\OrderService;
use MultiSafepay\Exception\ApiException;
use MultiSafepay\Exception\InvalidApiKeyException;
use Psr\Http\Client\ClientExceptionInterface;

class Notification extends Action
{
    /**
     * @var OrderInterfaceFactory
     */
    private $orderFactory;

    /**
     * @var Logger
     */
    private $logger;

    /**
     * @var OrderService
     */
    private $orderService;

    /**
     * Notification constructor.
     *
     * @param Context $context
     * @param OrderInterfaceFactory $orderFactory
     * @param Logger $logger
     * @param OrderService $orderService
     */
    public function __construct(
        Context $context,
        OrderInterfaceFactory $orderFactory,
        Logger $logger,
        OrderService $orderService
    ) {
        parent::__construct($context);
        $this->orderFactory = $orderFactory;
        $this->logger = $logger;
        $this->orderService = $orderService;
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

            $orderId = $params['transactionid'];

            /** @var Order $order */
            $order = $this->orderFactory->create()->loadByIncrementId($orderId);

            if (!$order->getId()) {
                throw new NoSuchEntityException(__('Requested order doesn\'t exist'));
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
