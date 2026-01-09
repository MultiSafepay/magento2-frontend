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
use Magento\Sales\Api\OrderPaymentRepositoryInterface;
use Magento\Sales\Api\OrderRepositoryInterface;
use Magento\Sales\Model\Order;
use Magento\Sales\Model\Order\Payment;
use MultiSafepay\ConnectCore\Config\Config;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Service\Payment\RemoveAdditionalInformation;
use MultiSafepay\ConnectCore\Service\PaymentLink;

class Redirect extends Action
{
    /**
     * @var OrderPaymentRepositoryInterface
     */
    private $orderPaymentRepository;

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
     * @var Config
     */
    private $config;

    /**
     * @var OrderRepositoryInterface
     */
    private $orderRepository;

    /**
     * Redirect constructor.
     *
     * @param Context $context
     * @param PaymentLink $paymentLink
     * @param Session $checkoutSession
     * @param OrderRepositoryInterface $orderRepository
     * @param OrderPaymentRepositoryInterface $orderPaymentRepository
     * @param Logger $logger
     * @param RemoveAdditionalInformation $removeAdditionalInformation
     * @param Config $config
     */
    public function __construct(
        Context $context,
        PaymentLink $paymentLink,
        Session $checkoutSession,
        OrderRepositoryInterface $orderRepository,
        OrderPaymentRepositoryInterface $orderPaymentRepository,
        Logger $logger,
        RemoveAdditionalInformation $removeAdditionalInformation,
        Config $config
    ) {
        parent::__construct($context);
        $this->logger = $logger;
        $this->paymentLink = $paymentLink;
        $this->checkoutSession = $checkoutSession;
        $this->orderRepository = $orderRepository;
        $this->orderPaymentRepository = $orderPaymentRepository;
        $this->removeAdditionalInformation = $removeAdditionalInformation;
        $this->config = $config;
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

        if ($this->config->getAdvancedValue('add_google_analytics_client_id_to_urls')) {
            $googleAnalyticsCookie = $this->getRequest()->getCookie('_ga', null) ?? '';

            // The Google Analytics _ga cookie has the format: GA<version>.<instance>.<clientId>
            // Example: GA1.2.123456789.987654321
            // This regex extracts the clientId component (the last two dot-separated numbers).
            if (preg_match('/^GA\d+\.\d+\.(\d+\.\d+)$/', $googleAnalyticsCookie, $matches)) {
                $clientId = $matches[1];

                if ($clientId) {
                    /** @var Payment $payment */
                    $payment = $order->getPayment();

                    $payment->setAdditionalInformation('google_analytics_client_id', $clientId);
                    $this->orderPaymentRepository->save($payment);
                }
            }
        }

        $this->logger->logPaymentRedirectInfo($orderIncrementId, $paymentUrl);
        $this->removeAdditionalInformation->execute($order);

        $this->checkoutSession->setData('multisafepay_restore_quote', true);

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
