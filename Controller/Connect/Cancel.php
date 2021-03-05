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
use Magento\Sales\Api\OrderRepositoryInterface;
use MultiSafepay\ConnectCore\Util\CustomReturnUrlUtil;
use MultiSafepay\ConnectFrontend\Validator\RequestValidator;

class Cancel extends Action
{
    /**
     * @var Session
     */
    private $checkoutSession;

    /**
     * @var OrderRepositoryInterface
     */
    private $orderRepository;

    /**
     * @var RequestValidator
     */
    private $requestValidator;

    /**
     * @var CustomReturnUrlUtil
     */
    private $customReturnUrlUtil;

    /**
     * Cancel constructor.
     *
     * @param OrderRepositoryInterface $orderRepository
     * @param RequestValidator $requestValidator
     * @param Session $checkoutSession
     * @param Context $context
     * @param CustomReturnUrlUtil $customReturnUrlUtil
     */
    public function __construct(
        OrderRepositoryInterface $orderRepository,
        RequestValidator $requestValidator,
        Session $checkoutSession,
        Context $context,
        CustomReturnUrlUtil $customReturnUrlUtil
    ) {
        $this->orderRepository = $orderRepository;
        $this->checkoutSession = $checkoutSession;
        $this->requestValidator = $requestValidator;
        $this->customReturnUrlUtil = $customReturnUrlUtil;
        parent::__construct($context);
    }

    /**
     * @inheritDoc
     */
    public function execute()
    {
        $parameters = $this->getRequest()->getParams();

        if (!$this->requestValidator->validate($parameters)) {
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

        $this->checkoutSession->restoreQuote();

        $order = $this->checkoutSession->getLastRealOrder()->loadByIncrementId($orderId);

        $order->cancel();
        $order->addCommentToStatusHistory(__('The order has been canceled'));
        $this->orderRepository->save($order);

        if ($customReturnUrl = $this->customReturnUrlUtil->getCustomReturnUrlByType($order, $parameters)) {
            return $this->resultRedirectFactory->create()->setUrl($customReturnUrl);
        }

        $msg = __('The transaction was canceled or declined and the order was closed, please try again.');
        $this->messageManager->addErrorMessage($msg);

        return $this->_redirect('checkout/cart');
    }
}
