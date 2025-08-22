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

namespace MultiSafepay\ConnectFrontend\Controller\Connect;

use Exception;
use Magento\Checkout\Model\Session;
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\App\Response\Http;
use Magento\Framework\App\ResponseInterface;
use Magento\Sales\Api\OrderRepositoryInterface;
use Magento\Sales\Model\Order;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Service\Payment\RemoveAdditionalInformation;
use MultiSafepay\ConnectCore\Service\PaymentLink;

class Redirect extends Action
{
    /**
     * @var OrderRepositoryInterface
     */
    protected $orderRepository;

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
     * @var RemoveAdditionalInformation
     */
    private $removeAdditionalInformation;

    /**
     * Redirect constructor.
     *
     * @param Context $context
     * @param PaymentLink $paymentLink
     * @param Session $checkoutSession
     * @param OrderRepositoryInterface $orderRepository
     * @param Logger $logger
     * @param RemoveAdditionalInformation $removeAdditionalInformation
     */
    public function __construct(
        Context $context,
        PaymentLink $paymentLink,
        Session $checkoutSession,
        OrderRepositoryInterface $orderRepository,
        Logger $logger,
        RemoveAdditionalInformation $removeAdditionalInformation
    ) {
        parent::__construct($context);
        $this->logger = $logger;
        $this->paymentLink = $paymentLink;
        $this->checkoutSession = $checkoutSession;
        $this->orderRepository = $orderRepository;
        $this->removeAdditionalInformation = $removeAdditionalInformation;
    }

    /**
     * @return ResponseInterface
     * @throws Exception
     */
    public function execute(): ResponseInterface
    {
        $orderId = $this->checkoutSession->getLastRealOrder()->getId();

        if (!$orderId) {
            return $this->redirectToCheckout(__('Something went wrong with the order. Please try again.')->render());
        }

        /** @var Order $order */
        $order = $this->orderRepository->get($orderId);
        $orderIncrementId = $order->getRealOrderId();

        if (!($paymentUrl = $this->paymentLink->getPaymentLinkFromOrder($order))) {
            return $this->redirectToCheckout(__(
            // phpcs:ignore
                'There was a problem processing your payment. Possible reasons could be: &quot;insufficient funds&quot;, or &quot;verification failed&quot;.'
            )->render());
        }

        $this->logger->logPaymentRedirectInfo($orderIncrementId, $paymentUrl);
        $this->removeAdditionalInformation->execute($order);

        /** @var Http $response */
        $response = $this->getResponse();

        return $response->setRedirect($paymentUrl);
    }

    /**
     * Redirect the customer to the checkout and show an error message
     *
     * @param string $message
     * @return ResponseInterface
     */
    public function redirectToCheckout(string $message): ResponseInterface
    {
        $this->checkoutSession->restoreQuote();
        $this->messageManager->addErrorMessage(
            __($message)
        );

        return $this->_redirect('checkout/cart', ['_current' => true]);
    }
}
