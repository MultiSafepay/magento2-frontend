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
 * Copyright © 2020 MultiSafepay, Inc. All rights reserved.
 * See DISCLAIMER.md for disclaimer details.
 *
 */

declare(strict_types=1);

namespace MultiSafepay\ConnectFrontend\Controller\Connect;

use Magento\Checkout\Model\Session;
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\App\ResponseInterface;
use Magento\Framework\Exception\LocalizedException;
use Magento\Sales\Api\OrderRepositoryInterface;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Model\Api\Initializer\OrderRequestInitializer;
use MultiSafepay\ConnectCore\Model\PaymentLink;
use MultiSafepay\Exception\ApiException;
use MultiSafepay\Exception\InvalidApiKeyException;
use Psr\Http\Client\ClientExceptionInterface;

class Redirect extends Action
{
    /**
     * @var Session
     */
    private $checkoutSession;

    /**
     * @var Logger
     */
    private $logger;

    /**
     * @var OrderRepositoryInterface
     */
    private $orderRepository;

    /**
     * @var OrderRequestInitializer
     */
    private $orderRequestInitializer;

    /**
     * @var PaymentLink
     */
    private $paymentLink;

    /**
     * Redirect constructor.
     *
     * @param Context $context
     * @param OrderRequestInitializer $orderRequestInitializer
     * @param OrderRepositoryInterface $orderRepository
     * @param PaymentLink $paymentLink
     * @param Session $checkoutSession
     * @param Logger $logger
     */
    public function __construct(
        Context $context,
        OrderRequestInitializer $orderRequestInitializer,
        OrderRepositoryInterface $orderRepository,
        PaymentLink $paymentLink,
        Session $checkoutSession,
        Logger $logger
    ) {
        parent::__construct($context);
        $this->orderRequestInitializer = $orderRequestInitializer;
        $this->logger = $logger;
        $this->orderRepository = $orderRepository;
        $this->paymentLink = $paymentLink;
        $this->checkoutSession = $checkoutSession;
    }

    /**
     * @inheritDoc
     * @throws LocalizedException
     * @throws ClientExceptionInterface
     */
    public function execute()
    {
        $order = $this->checkoutSession->getLastRealOrder();
        $orderId = $order->getRealOrderId();

        try {
            $transaction = $this->orderRequestInitializer->initialize($order);
        } catch (InvalidApiKeyException $invalidApiKeyException) {
            $this->logger->logInvalidApiKeyException($invalidApiKeyException);
            return $this->redirectToCheckout();
        } catch (ApiException $apiException) {
            $this->logger->logPaymentLinkError($orderId, $apiException);
            return $this->redirectToCheckout();
        }

        $paymentUrl = $transaction->getPaymentUrl();

        $this->logger->logPaymentRedirectInfo($orderId, $paymentUrl);
        $this->paymentLink->addToAdditionalInformation($order->getPayment(), $paymentUrl);

        $msg = __('The user has been redirected to the following page: ') . $paymentUrl;
        $order->addCommentToStatusHistory($msg);
        $this->orderRepository->save($order);

        return $this->_redirect($paymentUrl);
    }

    /**
     * @return ResponseInterface
     */
    public function redirectToCheckout(): ResponseInterface
    {
        $this->checkoutSession->restoreQuote();
        $this->messageManager->addErrorMessage(__('Something went wrong with the order. Please try again later.'));
        return $this->_redirect('checkout/cart');
    }
}
