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
 * Copyright © 2020 MultiSafepay, Inc. All rights reserved.
 * See DISCLAIMER.md for disclaimer details.
 *
 */

declare(strict_types=1);

namespace MultiSafepay\ConnectFrontend\Test\Integration\Observer;

use Magento\Checkout\Model\Session;
use Magento\Customer\Api\CustomerRepositoryInterface;
use Magento\Customer\Model\Session as CustomerSession;
use Magento\Framework\App\Request\Http;
use Magento\Framework\App\State;
use Magento\Framework\Event\ManagerInterface;
use Magento\Framework\Event\Observer;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\HTTP\PhpEnvironment\RemoteAddress;
use Magento\Framework\Session\Config\ConfigInterface;
use Magento\Framework\Session\SaveHandlerInterface;
use Magento\Framework\Session\SidResolverInterface;
use Magento\Framework\Session\StorageInterface;
use Magento\Framework\Session\ValidatorInterface;
use Magento\Framework\Stdlib\CookieManagerInterface;
use Magento\Framework\Stdlib\Cookie\CookieMetadataFactory;
use Magento\Quote\Api\CartRepositoryInterface;
use Magento\Quote\Model\QuoteFactory;
use Magento\Quote\Model\QuoteIdMaskFactory;
use Magento\Sales\Api\Data\OrderInterface;
use Magento\Sales\Model\Order;
use Magento\Sales\Model\OrderFactory;
use Magento\Store\Model\StoreManagerInterface;
use MultiSafepay\ConnectCore\Model\Ui\Gateway\BankTransferConfigProvider;
use MultiSafepay\ConnectCore\Model\Ui\Gateway\VisaConfigProvider;
use MultiSafepay\ConnectCore\Test\Integration\AbstractTestCase;
use MultiSafepay\ConnectCore\Util\PaymentMethodUtil;
use MultiSafepay\ConnectFrontend\Observer\RestoreQuoteObserver;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;

class RestoreQuoteObserverTest extends AbstractTestCase
{
    /**
     * @var RestoreQuoteObserver
     */
    private $restoreQuoteObserver;

    /**
     * @var CartRepositoryInterface
     */
    private $cartRepositoryInterface;

    /**
     * {@inheritdoc}
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->restoreQuoteObserver = $this->getObjectManager()->create(RestoreQuoteObserver::class);
        $this->cartRepositoryInterface = $this->getObjectManager()->create(CartRepositoryInterface::class);
    }

    public function testRestoreQuoteWithEmptyOrder(): void
    {
        self::isNull($this->restoreQuoteObserver->execute($this->getObserverObject()));
    }

    /**
     * @magentoDataFixture   Magento/Sales/_files/order.php
     * @magentoDataFixture   Magento/Sales/_files/quote.php
     * @magentoConfigFixture default_store multisafepay/general/test_api_key testkey
     * @magentoConfigFixture default_store multisafepay/general/mode 0
     *
     * @throws LocalizedException
     */
    public function testRestoreQuoteWithNotEmptyOrder(): void
    {
        $observerObject = $this->getObserverObject();
        $restoreQuoteObserverMock = $this->getMockBuilder(RestoreQuoteObserver::class)->setConstructorArgs([
            $this->getCheckoutSessionMockWithOrder($this->getOrder()),
            $this->getObjectManager()->get(PaymentMethodUtil::class),
        ])->setMethodsExcept(['execute'])->getMock();

        self::isNull($restoreQuoteObserverMock->execute($observerObject));

        $order = $this->getOrderWithVisaPaymentMethod();
        $payment = $order->getPayment();
        $payment->setMethod(BankTransferConfigProvider::CODE);

        $restoreQuoteObserverMock = $this->getMockBuilder(RestoreQuoteObserver::class)->setConstructorArgs([
            $this->getCheckoutSessionMockWithOrder($order),
            $this->getObjectManager()->get(PaymentMethodUtil::class),
        ])->setMethodsExcept(['execute'])->getMock();

        self::isNull($restoreQuoteObserverMock->execute($observerObject));

        $payment->setMethod(VisaConfigProvider::CODE);

        $restoreQuoteObserverMock = $this->getMockBuilder(RestoreQuoteObserver::class)->setConstructorArgs([
            $this->getCheckoutSessionMockWithOrder($order),
            $this->getObjectManager()->get(PaymentMethodUtil::class),
        ])->setMethodsExcept(['execute'])->getMock();

        self::isNull($restoreQuoteObserverMock->execute($observerObject));

        $order->setState(Order::STATE_PENDING_PAYMENT);
        $quote = $this->getQuote('test01');
        $quote->setIsActive(false);
        $this->cartRepositoryInterface->save($quote);
        $quoteId = $quote->getEntityId();
        $order->setQuoteId($quoteId);

        $restoreQuoteObserverMock = $this->getMockBuilder(RestoreQuoteObserver::class)->setConstructorArgs([
            $this->getCheckoutSessionMockWithOrder($order),
            $this->getObjectManager()->get(PaymentMethodUtil::class),
        ])->setMethodsExcept(['execute'])->getMock();

        $restoreQuoteObserverMock->execute($observerObject);
        $updatedQuote = $this->cartRepositoryInterface->get($quoteId);

        self::isTrue((bool)$updatedQuote->getIsActive());
        self::isNull((bool)$updatedQuote->getReservedOrderId());
    }

    /**
     * @return Observer
     */
    private function getObserverObject(): Observer
    {
        return $this->getObjectManager()->create(Observer::class);
    }

    /**
     * @param OrderInterface $order
     * @return MockObject
     */
    private function getCheckoutSessionMockWithOrder(OrderInterface $order): MockObject
    {
        $checkoutSessionMock = $this->getMockBuilder(Session::class)
            ->setConstructorArgs([
                $this->getObjectManager()->get(Http::class),
                $this->getObjectManager()->get(SidResolverInterface::class),
                $this->getObjectManager()->get(ConfigInterface::class),
                $this->getObjectManager()->get(SaveHandlerInterface::class),
                $this->getObjectManager()->get(ValidatorInterface::class),
                $this->getObjectManager()->get(StorageInterface::class),
                $this->getObjectManager()->get(CookieManagerInterface::class),
                $this->getObjectManager()->get(CookieMetadataFactory::class),
                $this->getObjectManager()->get(State::class),
                $this->getObjectManager()->get(OrderFactory::class),
                $this->getObjectManager()->get(CustomerSession::class),
                $this->getObjectManager()->get(CartRepositoryInterface::class),
                $this->getObjectManager()->get(RemoteAddress::class),
                $this->getObjectManager()->get(ManagerInterface::class),
                $this->getObjectManager()->get(StoreManagerInterface::class),
                $this->getObjectManager()->get(CustomerRepositoryInterface::class),
                $this->getObjectManager()->get(QuoteIdMaskFactory::class),
                $this->getObjectManager()->get(QuoteFactory::class),
                $this->getObjectManager()->get(LoggerInterface::class),
            ])->setMethodsExcept(['restoreQuote', 'replaceQuote'])->getMock();

        $checkoutSessionMock->method('getLastRealOrder')
            ->willReturn($order);

        return $checkoutSessionMock;
    }
}
