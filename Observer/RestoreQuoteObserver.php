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

namespace MultiSafepay\ConnectFrontend\Observer;

use Magento\Checkout\Model\Session;
use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Quote\Api\CartRepositoryInterface;
use Magento\Quote\Model\Quote;
use Magento\Sales\Model\Order;
use Magento\Sales\Model\Order\Payment;
use MultiSafepay\ConnectCore\Model\Ui\Gateway\BankTransferConfigProvider;
use MultiSafepay\ConnectCore\Util\PaymentMethodUtil;

class RestoreQuoteObserver implements ObserverInterface
{

    /**
     * @var Session
     */
    private $checkoutSession;

    /**
     * @var PaymentMethodUtil
     */
    private $paymentMethodUtil;

    /**
     * @var CartRepositoryInterface
     */
    private $quoteRepository;

    /**
     * RestoreQuoteObserver constructor.
     *
     * @param Session $checkoutSession
     * @param PaymentMethodUtil $paymentMethodUtil
     * @param CartRepositoryInterface $quoteRepository
     */
    public function __construct(
        Session $checkoutSession,
        PaymentMethodUtil $paymentMethodUtil,
        CartRepositoryInterface $quoteRepository
    ) {
        $this->checkoutSession = $checkoutSession;
        $this->paymentMethodUtil = $paymentMethodUtil;
        $this->quoteRepository = $quoteRepository;
    }

    /**
     * @param Observer $observer
     *
     * @throws LocalizedException
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function execute(Observer $observer): void
    {
        $lastRealOrder = $this->checkoutSession->getLastRealOrder();

        if (!$this->paymentMethodUtil->isMultisafepayOrder($lastRealOrder)) {
            return;
        }

        try {
            /** @var Quote $quote */
            $quote = $this->quoteRepository->get($lastRealOrder->getQuoteId());
            $quotePayment = $quote->getPayment();

            if ($quotePayment && $quotePayment->getAdditionalInformation('multisafepay_success')) {
                return;
            }

            if ((bool)$this->checkoutSession->getData('multisafepay_restore_quote') === false) {
                return;
            }
        } catch (NoSuchEntityException $exception) {
            return;
        }

        /** @var Payment $payment */
        $payment = $lastRealOrder->getPayment();

        if ($payment->getMethod() === BankTransferConfigProvider::CODE) {
            return;
        }

        if ($lastRealOrder->getState() !== Order::STATE_PENDING_PAYMENT) {
            return;
        }

        $this->checkoutSession->restoreQuote();
    }
}
