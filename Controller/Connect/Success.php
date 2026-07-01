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
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Controller\Result\Redirect;
use Magento\Sales\Api\Data\OrderInterface;
use Magento\Sales\Model\Order;
use MultiSafepay\ConnectCore\Config\Config;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectFrontend\Util\CheckoutSessionUtil;
use MultiSafepay\ConnectFrontend\Util\OrderUtil;
use MultiSafepay\ConnectFrontend\Util\UrlUtil;
use MultiSafepay\ConnectFrontend\Validator\RequestValidator;

class Success extends Action
{
    /**
     * @var OrderUtil
     */
    private $orderUtil;

    /**
     * @var Logger
     */
    private $logger;

    /**
     * @var RequestValidator
     */
    private $requestValidator;

    /**
     * @var Config
     */
    private $config;

    /**
     * @var CheckoutSessionUtil
     */
    private $checkoutSessionUtil;

    /**
     * @var UrlUtil
     */
    private $urlUtil;

    /**
     * Success constructor.
     *
     * @param Context $context
     * @param OrderUtil $orderUtil
     * @param RequestValidator $requestValidator
     * @param Logger $logger
     * @param Config $config
     * @param CheckoutSessionUtil $checkoutSessionUtil
     * @param UrlUtil $urlUtil
     */
    public function __construct(
        Context $context,
        OrderUtil $orderUtil,
        RequestValidator $requestValidator,
        Logger $logger,
        Config $config,
        CheckoutSessionUtil $checkoutSessionUtil,
        UrlUtil $urlUtil
    ) {
        parent::__construct($context);
        $this->requestValidator = $requestValidator;
        $this->logger = $logger;
        $this->orderUtil = $orderUtil;
        $this->config = $config;
        $this->checkoutSessionUtil = $checkoutSessionUtil;
        $this->urlUtil = $urlUtil;
    }

    /**
     * @inheritDoc
     * @throws Exception
     */
    public function execute()
    {
        $parameters = $this->getRequest()->getParams();

        if (!$this->requestValidator->validateSecureToken($parameters)) {
            return $this->resultRedirectFactory->create()->setPath('checkout/cart');
        }

        $orderIncrementId = $parameters['transactionid'];

        $this->logger->logInfoForOrder(
            $orderIncrementId,
            'Redirect URL - Customer returned to the store after a successful payment.'
        );

        /** @var Order $order */
        $order = $this->orderUtil->getOrder($orderIncrementId);

        $redirect = $this->buildSuccessRedirect($order, $parameters);

        $order->addCommentToStatusHistory('User redirected to the success page.');
        $this->checkoutSessionUtil->setCheckoutSessionData($order);
        $this->logger->logPaymentSuccessInfo($orderIncrementId);

        return $redirect;
    }

    /**
     * Build the success redirect, preferring the configured custom success URL
     * and falling back to checkout/onepage/success.
     *
     * @param OrderInterface $order
     * @param array $parameters
     * @return Redirect
     * @throws Exception
     */
    private function buildSuccessRedirect(OrderInterface $order, array $parameters): Redirect
    {
        $customReturnUrl = $this->urlUtil->getCustomReturnUrl($order, $parameters);

        if ($customReturnUrl) {
            return $this->resultRedirectFactory->create()->setUrl($customReturnUrl);
        }

        return $this->resultRedirectFactory->create()->setPath(
            'checkout/onepage/success',
            ['_query' => $this->getSuccessQueryParams($order)]
        );
    }

    /**
     * Build the query string for the default checkout success page.
     *
     * @param OrderInterface $order
     * @return array
     */
    private function getSuccessQueryParams(OrderInterface $order): array
    {
        $googleAnalyticsClientId = $order->getPayment()->getAdditionalInformation()['google_analytics_client_id'] ?? '';

        return array_merge(
            $this->config->isUtmNoOverrideDisabled((int)$order->getStoreId()) ? [] : ['utm_nooverride' => 1],
            $googleAnalyticsClientId ? ['_ga' => $googleAnalyticsClientId] : []
        );
    }
}
