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

namespace MultiSafepay\ConnectFrontend\Test\Integration\Observer;

use Magento\Checkout\Model\Session;
use Magento\Customer\Api\CustomerRepositoryInterface;
use Magento\Customer\Model\Session as CustomerSession;
use Magento\Framework\App\Request\Http;
use Magento\Framework\App\State;
use Magento\Framework\Event\ManagerInterface;
use Magento\Framework\Event\Observer;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
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
use PHPUnit\Framework\MockObject\Exception;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
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
        $this->cartRepositoryInterface = $this->getObjectManager()->get(CartRepositoryInterface::class);
    }

    /**
     * Test restoring quote with empty order
     *
     * @return void
     * @throws LocalizedException
     */
    public function testRestoreQuoteWithEmptyOrder(): void
    {
        $this->restoreQuoteObserver->execute($this->getObserverObject());
    }

    /**
     * Test restoring quote with not empty order
     *
     * @magentoDataFixture   Magento/Sales/_files/order.php
     * @magentoDataFixture   Magento/Sales/_files/quote.php
     * @magentoConfigFixture default_store multisafepay/general/test_api_key testkey
     * @magentoConfigFixture default_store multisafepay/general/mode 0
     *
     * @throws LocalizedException
     * @throws Exception
     * @throws \Exception
     *
     * @noinspection PhpParamsInspection
     */
    public function testRestoreQuoteWithNotEmptyOrder(): void
    {
        $observerObject = $this->getObserverObject();

        $quote = $this->getQuote('test01');
        $quote->setIsActive(false);
        $quote->setReservedOrderId('reserved_id_123');
        $this->cartRepositoryInterface->save($quote);
        $quoteId = $quote->getEntityId();

        $order = $this->getOrderWithVisaPaymentMethod();
        $order->setQuoteId($quoteId);
        $payment = $order->getPayment();

        $paymentMethodUtilMock = $this->getPaymentMethodUtilMock();

        $payment->setMethod('checkmo');

        $restoreQuoteObserver = new RestoreQuoteObserver(
            $this->getCheckoutSessionMockWithOrder($order),
            $paymentMethodUtilMock,
            $this->cartRepositoryInterface
        );
        $restoreQuoteObserver->execute($observerObject);

        $quote = $this->cartRepositoryInterface->get($quoteId);
        self::assertFalse((bool)$quote->getIsActive(), 'Quote should remain inactive for non-MSP order');

        $payment->setMethod(BankTransferConfigProvider::CODE);

        $restoreQuoteObserver = new RestoreQuoteObserver(
            $this->getCheckoutSessionMockWithOrder($order),
            $paymentMethodUtilMock,
            $this->cartRepositoryInterface
        );
        $restoreQuoteObserver->execute($observerObject);

        $quote = $this->cartRepositoryInterface->get($quoteId);
        self::assertFalse((bool)$quote->getIsActive(), 'Quote should remain inactive for BankTransfer');

        $payment->setMethod(VisaConfigProvider::CODE);
        $order->setState(Order::STATE_PROCESSING);

        $restoreQuoteObserver = new RestoreQuoteObserver(
            $this->getCheckoutSessionMockWithOrder($order),
            $paymentMethodUtilMock,
            $this->cartRepositoryInterface
        );
        $restoreQuoteObserver->execute($observerObject);

        $quote = $this->cartRepositoryInterface->get($quoteId);
        self::assertFalse((bool)$quote->getIsActive(), 'Quote should remain inactive for wrong order state');

        $order->setState(Order::STATE_PENDING_PAYMENT);

        $restoreQuoteObserver = new RestoreQuoteObserver(
            $this->getCheckoutSessionMockWithOrder($order),
            $paymentMethodUtilMock,
            $this->cartRepositoryInterface
        );
        $restoreQuoteObserver->execute($observerObject);

        $quote = $this->cartRepositoryInterface->get($quoteId);
        self::assertTrue((bool)$quote->getIsActive(), 'Quote should be restored (active)');
        self::assertFalse((bool)$quote->getReservedOrderId(), 'Reserved Order ID should be cleared');
    }

    /**
     * Get the observer object
     *
     * @return Observer
     */
    private function getObserverObject(): Observer
    {
        return $this->getObjectManager()->create(Observer::class);
    }

    /**
     * Mock PaymentMethodUtil
     *
     * @return MockObject
     * @throws Exception
     */
    private function getPaymentMethodUtilMock(): MockObject
    {
        $mock = $this->createMock(PaymentMethodUtil::class);

        $mock->method('isMultisafepayOrder')
            ->willReturnCallback(function (OrderInterface $order) {
                $method = $order->getPayment()->getMethod();

                return in_array($method, [VisaConfigProvider::CODE, BankTransferConfigProvider::CODE]);
            });

        return $mock;
    }

    /**
     * Get checkout session mock with order
     *
     * @param OrderInterface $order
     * @return MockObject
     * @noinspection PhpParamsInspection
     */
    private function getCheckoutSessionMockWithOrder(OrderInterface $order): MockObject
    {
        $methodsToMock = array_diff(
            get_class_methods(Session::class),
            ['restoreQuote', 'replaceQuote', '__construct']
        );

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
                $this->cartRepositoryInterface,
                $this->getObjectManager()->get(RemoteAddress::class),
                $this->getObjectManager()->get(ManagerInterface::class),
                $this->getObjectManager()->get(StoreManagerInterface::class),
                $this->getObjectManager()->get(CustomerRepositoryInterface::class),
                $this->getObjectManager()->get(QuoteIdMaskFactory::class),
                $this->getObjectManager()->get(QuoteFactory::class),
                $this->getObjectManager()->get(LoggerInterface::class),
            ])
            ->onlyMethods($methodsToMock)
            ->getMock();

        $checkoutSessionMock->method('getLastRealOrder')
            ->willReturn($order);

        $checkoutSessionMock->method('getData')
            ->willReturnCallback(function ($key = '') {
                if ($key === 'multisafepay_restore_quote') {
                    return true;
                }

                return null;
            });

        if ($order->getQuoteId()) {
            try {
                $quote = $this->cartRepositoryInterface->get($order->getQuoteId());
                $checkoutSessionMock->method('getQuote')->willReturn($quote);
            } catch (NoSuchEntityException $e) {
                // Quote might not exist in some test scenarios
            }
        }

        return $checkoutSessionMock;
    }
}
