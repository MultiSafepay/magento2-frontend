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

namespace MultiSafepay\ConnectFrontend\Service;

use Magento\Checkout\Model\Session;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Quote\Api\CartRepositoryInterface;
use MultiSafepay\ConnectCore\Logger\Logger;

class ResetAdditionalInformation
{
    /**
     * @var CartRepositoryInterface
     */
    private $quoteRepository;

    /**
     * @var Logger
     */
    private $logger;

    /**
     * @param CartRepositoryInterface $quoteRepository
     * @param Logger $logger
     */
    public function __construct(
        CartRepositoryInterface $quoteRepository,
        Logger $logger
    ) {
        $this->quoteRepository = $quoteRepository;
        $this->logger = $logger;
    }

    /**
     * Reset the additional information array and save the quote
     */
    public function execute(Session $checkoutSession): void
    {
        try {
            $quote = $checkoutSession->getQuote();
            $payment = $quote->getPayment();
        } catch (LocalizedException|NoSuchEntityException $exception) {
            $this->logger->logException($exception);

            return;
        }

        if (!$payment) {
            return;
        }

        $additionalInformation = $payment->getAdditionalInformation();

        if (!$additionalInformation) {
            return;
        }

        $transactionType = $additionalInformation['transaction_type'] ?? null;

        if ($transactionType === 'direct') {
            $payment->unsAdditionalInformation();

            try {
                $quote->setPayment($payment);
                $this->quoteRepository->save($quote);
            } catch (LocalizedException $exception) {
                $this->logger->logException($exception);
            }
        }
    }
}
