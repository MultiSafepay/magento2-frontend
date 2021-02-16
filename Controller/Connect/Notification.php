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

use Magento\Framework\Api\SearchCriteriaBuilder;
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Exception\LocalizedException;
use Magento\Sales\Api\Data\InvoiceInterface;
use Magento\Sales\Api\Data\OrderInterfaceFactory;
use Magento\Sales\Api\InvoiceRepositoryInterface;
use Magento\Sales\Api\OrderPaymentRepositoryInterface;
use Magento\Sales\Api\OrderRepositoryInterface;
use Magento\Sales\Api\TransactionRepositoryInterface;
use Magento\Sales\Model\Order;
use Magento\Sales\Model\Order\Payment;
use Magento\Sales\Model\Order\Payment\Transaction as PaymentTransaction;
use MultiSafepay\Api\Transactions\Transaction;
use MultiSafepay\Api\Transactions\UpdateRequest;
use MultiSafepay\ConnectCore\Factory\SdkFactory;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Model\SecondChance;
use MultiSafepay\ConnectCore\Service\EmailSender;
use MultiSafepay\ConnectCore\Util\PaymentMethodUtil;
use MultiSafepay\Exception\ApiException;
use MultiSafepay\Exception\InvalidApiKeyException;
use Psr\Http\Client\ClientExceptionInterface;

class Notification extends Action
{

    /**
     * @var OrderInterfaceFactory
     */
    private $orderFactory;

    /**
     * @var OrderRepositoryInterface
     */
    private $orderRepository;

    /**
     * @var SdkFactory
     */
    private $sdkFactory;

    /**
     * @var OrderPaymentRepositoryInterface
     */
    private $orderPaymentRepository;

    /**
     * @var TransactionRepositoryInterface
     */
    private $transactionRepository;

    /**
     * @var Logger
     */
    private $logger;

    /**
     * @var SecondChance
     */
    private $secondChance;

    /**
     * @var UpdateRequest
     */
    private $updateRequest;

    /**
     * @var InvoiceRepositoryInterface
     */
    private $invoiceRepository;

    /**
     * @var SearchCriteriaBuilder
     */
    private $searchCriteriaBuilder;

    /**
     * @var ScopeConfigInterface
     */
    private $scopeConfig;

    /**
     * @var EmailSender
     */
    private $emailSender;

    /**
     * @var PaymentMethodUtil
     */
    private $paymentMethodUtil;

    /**
     * Notification constructor.
     *
     * @param SdkFactory $sdkFactory
     * @param Context $context
     * @param EmailSender $emailSender
     * @param OrderInterfaceFactory $orderFactory
     * @param OrderPaymentRepositoryInterface $orderPaymentRepository
     * @param OrderRepositoryInterface $orderRepository
     * @param SecondChance $secondChance
     * @param TransactionRepositoryInterface $transactionRepository
     * @param Logger $logger
     * @param UpdateRequest $updateRequest
     * @param InvoiceRepositoryInterface $invoiceRepository
     * @param ScopeConfigInterface $scopeConfig
     * @param SearchCriteriaBuilder $searchCriteriaBuilder
     * @param PaymentMethodUtil $paymentMethodUtil
     */
    public function __construct(
        SdkFactory $sdkFactory,
        Context $context,
        EmailSender $emailSender,
        OrderInterfaceFactory $orderFactory,
        OrderPaymentRepositoryInterface $orderPaymentRepository,
        OrderRepositoryInterface $orderRepository,
        SecondChance $secondChance,
        TransactionRepositoryInterface $transactionRepository,
        Logger $logger,
        UpdateRequest $updateRequest,
        InvoiceRepositoryInterface $invoiceRepository,
        ScopeConfigInterface $scopeConfig,
        SearchCriteriaBuilder $searchCriteriaBuilder,
        PaymentMethodUtil $paymentMethodUtil
    ) {
        parent::__construct($context);
        $this->emailSender = $emailSender;
        $this->sdkFactory = $sdkFactory;
        $this->orderFactory = $orderFactory;
        $this->orderPaymentRepository = $orderPaymentRepository;
        $this->orderRepository = $orderRepository;
        $this->secondChance = $secondChance;
        $this->transactionRepository = $transactionRepository;
        $this->logger = $logger;
        $this->updateRequest = $updateRequest;
        $this->invoiceRepository = $invoiceRepository;
        $this->searchCriteriaBuilder = $searchCriteriaBuilder;
        $this->scopeConfig = $scopeConfig;
        $this->paymentMethodUtil = $paymentMethodUtil;
    }

    /**
     * @inheritDoc
     * @throws LocalizedException
     * @throws ClientExceptionInterface
     * @throws \Exception
     */
    public function execute()
    {
        $params = $this->getRequest()->getParams();

        if (!$this->validateParams($params)) {
            return $this->getResponse()->setContent('ng');
        }

        try {
            $multiSafepaySdk = $this->sdkFactory->get();
        } catch (InvalidApiKeyException $invalidApiKeyException) {
            $this->logger->logInvalidApiKeyException($invalidApiKeyException);
            return $this->getResponse()->setContent('ng');
        }

        $orderId = $params['transactionid'];

        $transactionManager = $multiSafepaySdk->getTransactionManager();
        try {
            $transaction = $transactionManager->get($orderId);
        } catch (ApiException $e) {
            $this->logger->logGetRequestApiException($orderId, $e);
            return $this->getResponse()->setContent('ng');
        }

        /** @var Order $order */
        $order = $this->orderFactory->create()->loadByIncrementId($orderId);

        $this->emailSender->sendOrderConfirmationEmailAfterTransaction($order);

        /** @var Payment $payment */
        $payment = $order->getPayment();
        $gatewayCode = $payment->getMethodInstance()->getConfigData('gateway_code');
        $transactionType = $transaction->getPaymentDetails()->getType();

        if ($transactionType !== $gatewayCode && $this->paymentMethodUtil->isMultisafepayOrder($order)) {
            $payment->setMethod($this->setDifferentPaymentMethod($transactionType));
            $order->addCommentToStatusHistory(__('Payment method changed to ') . $transactionType);
        }

        $transactionStatus = $transaction->getStatus();

        $transactionStatusMessage = __('MultiSafepay Transaction status: ') . $transactionStatus;
        $order->addCommentToStatusHistory($transactionStatusMessage);

        switch ($transactionStatus) {
            case Transaction::COMPLETED:
            case Transaction::SHIPPED:
                if ($order->getState() === Order::STATE_CANCELED) {
                    $this->secondChance->reopenOrder($order);
                }

                $this->emailSender->sendOrderConfirmationEmailAfterPaidTransaction($order);

                if ($order->canInvoice()) {
                    $payment->setTransactionId($transaction->getData()['transaction_id']);
                    $payment->setAdditionalInformation(
                        [PaymentTransaction::RAW_DETAILS => (array)$payment->getAdditionalInformation()]
                    );

                    $payment->setParentTransactionId($transaction->getData()['transaction_id']);
                    $payment->setShouldCloseParentTransaction(false);
                    $payment->setIsTransactionClosed(0);
                    $payment->registerCaptureNotification($order->getBaseTotalDue(), true);
                    $this->logger->info('(Order ID: ' . $orderId . ') Invoice created');
                    $this->orderPaymentRepository->save($payment);

                    $paymentTransaction = $payment->addTransaction(PaymentTransaction::TYPE_CAPTURE, null, true);
                    if ($paymentTransaction !== null) {
                        $paymentTransaction->setParentTxnId($transaction->getData()['transaction_id']);
                    }

                    $paymentTransaction->setIsClosed(1);

                    $this->transactionRepository->save($paymentTransaction);
                    $this->orderRepository->save($order);
                }

                foreach ($this->getInvoicesByOrderId($order->getId()) as $invoice) {
                    $this->emailSender->sendInvoiceEmail($payment, $invoice);

                    $updateRequest = $this->updateRequest->addData([
                        "invoice_id" => $invoice->getIncrementId()
                    ]);

                    try {
                        $transactionManager->update($orderId, $updateRequest)->getResponseData();
                        $msg = '(Order ID: ' . $orderId . ') Invoice update request has been sent to MultiSafepay';
                        $this->logger->info($msg);
                    } catch (ApiException $e) {
                        $this->logger->logUpdateRequestApiException($orderId, $e);
                    }
                }
                break;

            case Transaction::UNCLEARED:
                if ($gatewayCode !== 'SANTANDER') {
                    $msg = __('Uncleared Transaction. You can accept the transaction manually in MultiSafepay Control');
                    $order->addCommentToStatusHistory($msg);
                }
                break;

            case Transaction::EXPIRED:
            case Transaction::DECLINED:
            case Transaction::CANCELLED:
            case Transaction::VOID:
                $order->cancel();
                $order->addCommentToStatusHistory($transactionStatusMessage);
                break;
        }
        $this->orderRepository->save($order);
        return $this->getResponse()->setContent('ok');
    }

    /**
     * @param $params
     * @return bool
     */
    public function validateParams($params): bool
    {
        if (!isset($params['transactionid'])) {
            return false;
        }

        if (!isset($params['timestamp'])) {
            return false;
        }
        return true;
    }

    /**
     * @param string $orderId
     * @return InvoiceInterface[]|null
     */
    public function getInvoicesByOrderId(string $orderId): ?array
    {
        $searchCriteria = $this->searchCriteriaBuilder->addFilter('order_id', $orderId)->create();

        return $this->invoiceRepository->getList($searchCriteria)->getItems();
    }

    /**
     * @param string $transactionType
     * @return string
     */
    public function setDifferentPaymentMethod(string $transactionType): string
    {
        $methodList = $this->scopeConfig->getValue('payment');

        foreach ($methodList as $code => $method) {
            if (isset($method['gateway_code']) && $method['gateway_code'] === $transactionType) {
                return (string) $code;
            }
        }

        return $transactionType;
    }
}
