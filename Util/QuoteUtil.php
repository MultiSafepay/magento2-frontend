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

use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Quote\Api\CartRepositoryInterface;
use Magento\Quote\Api\Data\CartInterface;
use Magento\Quote\Model\Quote;
use Magento\Sales\Api\Data\OrderInterface;
use MultiSafepay\ConnectCore\Logger\Logger;

class QuoteUtil
{
    /**
     * @var CartRepositoryInterface
     */
    private $cartRepository;
    /**
     * @var Logger
     */
    private $logger;

    /**
     * @param CartRepositoryInterface $cartRepository
     * @param Logger $logger
     */
    public function __construct(
        CartRepositoryInterface $cartRepository,
        Logger $logger
    ) {
        $this->cartRepository = $cartRepository;
        $this->logger = $logger;
    }

    /**
     * @param OrderInterface $order
     * @param CartInterface $quote
     * @return void
     * @throws LocalizedException
     */
    public function saveCheckoutDataToQuote(OrderInterface $order, CartInterface $quote)
    {
        $quote->setIsActive(false);
        $this->cartRepository->save($quote);

        try {
            /** @var Quote $orderQuote */
            $orderQuote = $this->cartRepository->get($order->getQuoteId());

            $orderQuote->getPayment()->setAdditionalInformation('multisafepay_success', true);
            $this->cartRepository->save($orderQuote);
        } catch (NoSuchEntityException $exception) {
            $this->logger->logExceptionForOrder($order->getIncrementId(), $exception);
        }
    }
}
