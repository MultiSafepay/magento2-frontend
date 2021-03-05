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
use Magento\Checkout\Model\Session;
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\App\ResponseInterface;
use Magento\Framework\Controller\ResultInterface;
use Magento\Sales\Api\Data\OrderInterface;
use Magento\Sales\Api\OrderRepositoryInterface;
use Magento\Sales\Model\Order;
use MultiSafepay\ConnectCore\Config\Config;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Model\Ui\Gateway\BankTransferConfigProvider;
use MultiSafepay\ConnectCore\Service\PaymentLink;
use MultiSafepay\Exception\ApiException;
use MultiSafepay\Exception\InvalidApiKeyException;
use Psr\Http\Client\ClientExceptionInterface;

class Redirect extends Action
{
    /**
     * @var OrderRepositoryInterface
     */
    protected $orderRepository;
    /**
     * @var Config
     */
    protected $config;
    /**
     * @var Session
     */
    private $checkoutSession;

    /**
     * @var Logger
     */
    private $logger;

    /**
     * @var PaymentLink
     */
    private $paymentLink;

    /**
     * Redirect constructor.
     *
     * @param Context $context
     * @param Config $config
     * @param PaymentLink $paymentLink
     * @param Session $checkoutSession
     * @param OrderRepositoryInterface $orderRepository
     * @param Logger $logger
     */
    public function __construct(
        Context $context,
        Config $config,
        PaymentLink $paymentLink,
        Session $checkoutSession,
        OrderRepositoryInterface $orderRepository,
        Logger $logger
    ) {
        parent::__construct($context);
        $this->logger = $logger;
        $this->paymentLink = $paymentLink;
        $this->checkoutSession = $checkoutSession;
        $this->orderRepository = $orderRepository;
        $this->config = $config;
    }

    /**
     * @return ResponseInterface|ResultInterface
     * @throws ClientExceptionInterface
     */
    public function execute()
    {
        $order = $this->checkoutSession->getLastRealOrder();
        $orderId = $order->getRealOrderId();

        if (!$orderId) {
            return $this->redirectToCheckout();
        }

        try {
            $paymentUrl = $this->paymentLink->getPaymentLinkByOrder($order);
            $this->logger->logPaymentRedirectInfo($orderId, $paymentUrl);
            $this->paymentLink->addPaymentLink($order, $paymentUrl);
        } catch (InvalidApiKeyException $invalidApiKeyException) {
            $this->logger->logInvalidApiKeyException($invalidApiKeyException);
            return $this->redirectToCheckout();
        } catch (ApiException $apiException) {
            $this->logger->logPaymentLinkError($orderId, $apiException);
            return $this->redirectToCheckout();
        } catch (Exception $exception) {
            $this->logger->logGeneralErrorForOrder($orderId, $exception);
            return $this->redirectToCheckout();
        }

        // For bank transfers we don't want the order to be automatically canceled to give customers time to pay
        if ($order->getPayment()->getMethod() !== BankTransferConfigProvider::CODE) {
            $state = Order::STATE_PENDING_PAYMENT;

            $order->setState($state);
            $order->setStatus($this->getPendingPaymentStatus($order, $state));

            $this->orderRepository->save($order);
        }

        return $this->_redirect($paymentUrl);
    }

    /**
     * @return ResponseInterface
     */
    public function redirectToCheckout(): ResponseInterface
    {
        $this->checkoutSession->restoreQuote();
        $this->messageManager->addErrorMessage(
            __('Something went wrong with the order. Please try again later.')
        );

        return $this->_redirect('checkout/cart');
    }

    /**
     * @param OrderInterface $order
     * @param string $state
     * @return string
     */
    public function getPendingPaymentStatus(OrderInterface $order, string $state): string
    {
        if ($status = $this->config->getPendingPaymentStatus($order->getStoreId())) {
            return $status;
        }
        return $order->getConfig()->getStateDefaultStatus($state) ?? ORDER::STATE_PENDING_PAYMENT;
    }
}
