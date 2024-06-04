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
use MultiSafepay\ConnectCore\Config\Config;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Service\Order\CancelMultisafepayOrderPaymentLink;
use MultiSafepay\ConnectCore\Util\CouponUtil;
use MultiSafepay\ConnectCore\Util\CustomReturnUrlUtil;
use MultiSafepay\ConnectFrontend\Service\ResetAdditionalInformation;
use MultiSafepay\ConnectFrontend\Validator\RequestValidator;

class Cancel extends Action
{
    /**
     * @var Session
     */
    private $checkoutSession;

    /**
     * @var RequestValidator
     */
    private $requestValidator;

    /**
     * @var CustomReturnUrlUtil
     */
    private $customReturnUrlUtil;

    /**
     * @var Config
     */
    private $config;

    /**
     * @var CancelMultisafepayOrderPaymentLink
     */
    private $cancelMultisafepayOrderPaymentLink;

    /**
     * @var CouponUtil
     */
    private $couponUtil;

    /**
     * @var Logger
     */
    private $logger;

    /**
     * @var ResetAdditionalInformation
     */
    private $resetAdditionalInformation;

    /**
     * Cancel constructor.
     *
     * @param RequestValidator $requestValidator
     * @param Session $checkoutSession
     * @param Context $context
     * @param CustomReturnUrlUtil $customReturnUrlUtil
     * @param Config $config
     * @param CancelMultisafepayOrderPaymentLink $cancelMultisafepayOrderPaymentLink
     * @param CouponUtil $couponUtil
     * @param Logger $logger
     * @param ResetAdditionalInformation $resetAdditionalInformation
     */
    public function __construct(
        RequestValidator $requestValidator,
        Session $checkoutSession,
        Context $context,
        CustomReturnUrlUtil $customReturnUrlUtil,
        Config $config,
        CancelMultisafepayOrderPaymentLink $cancelMultisafepayOrderPaymentLink,
        CouponUtil $couponUtil,
        Logger $logger,
        ResetAdditionalInformation $resetAdditionalInformation
    ) {
        $this->checkoutSession = $checkoutSession;
        $this->requestValidator = $requestValidator;
        $this->customReturnUrlUtil = $customReturnUrlUtil;
        $this->config = $config;
        $this->cancelMultisafepayOrderPaymentLink = $cancelMultisafepayOrderPaymentLink;
        $this->couponUtil = $couponUtil;
        $this->logger = $logger;
        $this->resetAdditionalInformation = $resetAdditionalInformation;
        parent::__construct($context);
    }

    /**
     * @inheritDoc
     * @throws Exception
     */
    public function execute()
    {
        $parameters = $this->getRequest()->getParams();

        if (!$this->requestValidator->validateSecureToken($parameters)) {
            $customReturnUrl = $this->customReturnUrlUtil->getCustomReturnUrlByType(
                $this->checkoutSession->getLastRealOrder(),
                $parameters
            );

            if ($customReturnUrl) {
                return $this->resultRedirectFactory->create()->setUrl($customReturnUrl);
            }

            return $this->_redirect('checkout/cart');
        }

        $orderId = $parameters['transactionid'];

        $order = $this->checkoutSession->getLastRealOrder()->loadByIncrementId($orderId);

        $this->couponUtil->restoreCoupon($order);
        if ($this->checkoutSession->restoreQuote()) {
            $this->logger->logInfoForOrder($orderId, 'Quote successfully restored by Cancel controller');
        }

        $this->resetAdditionalInformation->execute($this->checkoutSession);

        if ($this->config->getCancelPaymentLinkOption($order->getStoreId())
            === CancelMultisafepayOrderPaymentLink::CANCEL_BACK_BUTTON_PRETRANSACTION_OPTION
        ) {
            $this->cancelMultisafepayOrderPaymentLink->execute($order);
        }

        if ($customReturnUrl = $this->customReturnUrlUtil->getCustomReturnUrlByType($order, $parameters)) {
            return $this->resultRedirectFactory->create()->setUrl($customReturnUrl);
        }

        $msg = __('The transaction was canceled or declined and the order was closed, please try again.');
        $this->messageManager->addErrorMessage($msg);

        return $this->_redirect('checkout/cart');
    }
}
