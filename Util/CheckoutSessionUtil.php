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

namespace MultiSafepay\ConnectFrontend\Util;

use Magento\Checkout\Model\Session;
use Magento\Framework\Exception\LocalizedException;
use Magento\Sales\Api\Data\OrderInterface;

class CheckoutSessionUtil
{
    /**
     * @var Session
     */
    private $checkoutSession;

    /**
     * @var QuoteUtil
     */
    private $quoteUtil;

    /**
     * @param Session $checkoutSession
     * @param QuoteUtil $quoteUtil
     */
    public function __construct(
        Session $checkoutSession,
        QuoteUtil $quoteUtil
    ) {
        $this->checkoutSession = $checkoutSession;
        $this->quoteUtil = $quoteUtil;
    }

    /**
     * @param OrderInterface $order
     * @throws LocalizedException
     */
    public function setCheckoutSessionData(OrderInterface $order)
    {
        $this->checkoutSession->unsQuoteId();

        $quote = $this->checkoutSession->getQuote();

        $this->quoteUtil->saveCheckoutDataToQuote($order, $quote);

        $this->checkoutSession->setLastSuccessQuoteId($order->getQuoteId());
        $this->checkoutSession->setLastQuoteId($order->getQuoteId());
        $this->checkoutSession->setLastOrderId($order->getEntityId());
        $this->checkoutSession->setLastRealOrderId($order->getIncrementId());
    }
}
