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

use Magento\Checkout\Model\Session;
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Quote\Api\CartRepositoryInterface;
use Magento\Sales\Api\Data\OrderInterface;
use Magento\Sales\Api\Data\OrderInterfaceFactory;
use Magento\Sales\Api\OrderRepositoryInterface;
use Magento\Sales\Model\Order;
use MultiSafepay\Api\Transactions\Transaction;
use MultiSafepay\ConnectCore\Config\Config;
use MultiSafepay\ConnectCore\Factory\SdkFactory;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Model\SecondChance;
use MultiSafepay\ConnectFrontend\Validator\RequestValidator;
use MultiSafepay\Exception\ApiException;
use MultiSafepay\Exception\InvalidApiKeyException;
use Psr\Http\Client\ClientExceptionInterface;

class Success extends Action
{

    /**
     * @var OrderRepositoryInterface
     */
    private $orderRepository;

    /**
     * @var OrderInterfaceFactory
     */
    private $orderFactory;

    /**
     * @var Logger
     */
    private $logger;

    /**
     * @var SdkFactory
     */
    private $sdkFactory;

    /**
     * @var Session
     */
    private $checkoutSession;

    /**
     * @var CartRepositoryInterface
     */
    private $cartRepository;

    /**
     * @var Config
     */
    private $config;

    /**
     * @var RequestValidator
     */
    private $requestValidator;

    /**
     * @var SecondChance
     */
    private $secondChance;

    /**
     * Success constructor.
     *
     * @param SdkFactory $sdkFactory
     * @param Config $config
     * @param Context $context
     * @param OrderInterfaceFactory $orderFactory
     * @param OrderRepositoryInterface $orderRepository
     * @param RequestValidator $requestValidator
     * @param Session $checkoutSession
     * @param SecondChance $secondChance
     * @param Logger $logger
     * @param CartRepositoryInterface $cartRepository
     */
    public function __construct(
        SdkFactory $sdkFactory,
        Config $config,
        Context $context,
        OrderInterfaceFactory $orderFactory,
        OrderRepositoryInterface $orderRepository,
        RequestValidator $requestValidator,
        Session $checkoutSession,
        SecondChance $secondChance,
        Logger $logger,
        CartRepositoryInterface $cartRepository
    ) {
        parent::__construct($context);
        $this->config = $config;
        $this->sdkFactory = $sdkFactory;
        $this->orderFactory = $orderFactory;
        $this->orderRepository = $orderRepository;
        $this->requestValidator = $requestValidator;
        $this->secondChance = $secondChance;
        $this->logger = $logger;
        $this->checkoutSession = $checkoutSession;
        $this->cartRepository = $cartRepository;
    }

    /**
     * @inheritDoc
     * @throws ClientExceptionInterface
     * @throws LocalizedException
     */
    public function execute()
    {
        $parameters = $this->getRequest()->getParams();

        if (!$this->requestValidator->validate($parameters)) {
            return $this->_redirect('checkout/cart');
        }

        $orderId = $parameters['transactionid'];

        /** @var OrderInterface $order */
        $order = $this->orderFactory->create()->loadByIncrementId($orderId);

        try {
            $multiSafepaySdk = $this->sdkFactory->create((int)$order->getStoreId())->get();
        } catch (InvalidApiKeyException $invalidApiKeyException) {
            $this->logger->logInvalidApiKeyException($invalidApiKeyException);
            return $this->_redirect('checkout/onepage/success?utm_nooverride=1');
        }

        $transactionManager = $multiSafepaySdk->getTransactionManager();

        try {
            $transaction = $transactionManager->get($orderId);
        } catch (ApiException $e) {
            $this->logger->logGetRequestApiException($orderId, $e);
            return $this->_redirect('checkout/onepage/success?utm_nooverride=1');
        }

        $order->addCommentToStatusHistory('User redirected to the success page.');

        $this->setCheckoutSessionData($order);

        if ($transaction->getStatus() === Transaction::COMPLETED) {
            if ($order->getState() === Order::STATE_COMPLETE) {
                return $this->_redirect('checkout/onepage/success?utm_nooverride=1');
            }

            if ($order->getState() === Order::STATE_CANCELED) {
                $this->secondChance->reopenOrder($order);
            }

            $order->setState(Order::STATE_PROCESSING);
            $order->setStatus($this->setOrderProcessingStatus($order));
            $this->orderRepository->save($order);
        }

        $this->logger->logPaymentSuccessInfo($orderId);
        return $this->_redirect('checkout/onepage/success?utm_nooverride=1');
    }

    /**
     * @param OrderInterface $order
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    public function setCheckoutSessionData(OrderInterface $order): void
    {
        $this->checkoutSession->unsQuoteId();

        $quote = $this->checkoutSession->getQuote();
        $quote->setIsActive(false);

        $this->cartRepository->save($quote);

        $this->checkoutSession->setLastSuccessQuoteId($order->getQuoteId());
        $this->checkoutSession->setLastQuoteId($order->getQuoteId());
        $this->checkoutSession->setLastOrderId($order->getEntityId());
        $this->checkoutSession->setLastRealOrderId($order->getIncrementId());
    }

    /**
     * @param OrderInterface $order
     * @return string|null
     */
    public function setOrderProcessingStatus(OrderInterface $order): ?string
    {
        $orderStatus = $this->config->getValue('processing_order_status');

        if (empty($orderStatus)) {
            $stateDefaultStatus = $order->getConfig()->getStateDefaultStatus(Order::STATE_PROCESSING);
            if ($stateDefaultStatus === null) {
                return Order::STATE_PROCESSING;
            }
            return $stateDefaultStatus;
        }
        return $orderStatus;
    }
}
