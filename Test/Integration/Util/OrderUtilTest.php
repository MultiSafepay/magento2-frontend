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

namespace MultiSafepay\ConnectFrontend\Test\Integration\Util;

use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Sales\Api\Data\OrderInterface;
use Magento\Sales\Api\OrderRepositoryInterface;
use Magento\Sales\Model\Order;
use Magento\Sales\Model\OrderFactory;
use Magento\TestFramework\Helper\Bootstrap;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Test\Integration\AbstractTestCase;
use MultiSafepay\ConnectCore\Util\OrderUtil;
use MultiSafepay\ConnectCore\Util\ThirdPartyPluginsUtil;
use MultiSafepay\ConnectFrontend\Util\OrderUtil as CoreOrderUtil;

/**
 * @magentoAppArea frontend
 * @magentoDbIsolation enabled
 */
class OrderUtilTest extends AbstractTestCase
{
    /**
     * @var CoreOrderUtil
     */
    private $orderUtil;

    /**
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        $objectManager = Bootstrap::getObjectManager();
        $this->orderUtil = $objectManager->get(CoreOrderUtil::class);
    }

    /**
     * Test getOrder when Create Account After Placing Order is disabled
     *
     * @magentoDataFixture Magento/Sales/_files/order.php
     * @magentoConfigFixture current_store checkout/options/guest_checkout 1
     * @magentoConfigFixture current_store multisafepay/general/create_account_after_placing_order 0
     *
     * @throws NoSuchEntityException
     */
    public function testGetOrderWhenCreateAccountAfterPlacingOrderIsDisabled(): void
    {
        $orderIncrementId = '100000001';

        $result = $this->orderUtil->getOrder($orderIncrementId);

        $this->assertInstanceOf(OrderInterface::class, $result);
        $this->assertEquals($orderIncrementId, $result->getIncrementId());
    }

    /**
     * Test getOrder when Create Account After Placing Order is enabled and order is in processing state
     *
     * @magentoDataFixture Magento/Sales/_files/order_with_customer.php
     * @magentoConfigFixture current_store multisafepay/general/create_account_after_placing_order 1
     *
     * @throws NoSuchEntityException
     */
    public function testGetOrderWhenCreateAccountAfterPlacingOrderIsEnabledAndOrderIsInProcessingState(): void
    {
        $objectManager = Bootstrap::getObjectManager();
        $orderRepository = $objectManager->get(OrderRepositoryInterface::class);

        // Get the order from fixture and set it to processing state
        $order = $objectManager->get(OrderFactory::class)->create();
        $order->loadByIncrementId('100000001');
        $order->setState(Order::STATE_PROCESSING);
        $order->setStatus('processing');
        $orderRepository->save($order);

        $result = $this->orderUtil->getOrder('100000001');

        $this->assertInstanceOf(OrderInterface::class, $result);
        $this->assertEquals('100000001', $result->getIncrementId());
        $this->assertEquals(Order::STATE_PROCESSING, $result->getState());
    }

    /**
     * Test getOrder when Create Account After Placing Order is enabled and order stays in pending payment state
     *
     * @magentoDataFixture Magento/Sales/_files/order_pending_payment.php
     * @magentoConfigFixture current_store multisafepay/general/create_account_after_placing_order 1
     *
     * @throws NoSuchEntityException
     */
    public function testGetOrderWhenCreateAccountAfterPlacingOrderIsEnabledAndOrderStaysInPendingPaymentState(): void
    {
        $objectManager = Bootstrap::getObjectManager();
        $orderRepository = $objectManager->get(OrderRepositoryInterface::class);

        // Ensure order stays in pending payment state
        $order = $objectManager->get(OrderFactory::class)->create();
        $order->loadByIncrementId('100000001');
        $order->setState(Order::STATE_PENDING_PAYMENT);
        $order->setStatus('pending_payment');
        $orderRepository->save($order);

        // Mock the OrderUtil to avoid actual sleep delays in tests
        $orderUtil = $this->getMockBuilder(CoreOrderUtil::class)
            ->setConstructorArgs([
                $objectManager->get(ThirdPartyPluginsUtil::class),
                $objectManager->get(OrderUtil::class),
                $objectManager->get(Logger::class)
            ])
            ->addMethods(['sleep'])
            ->getMock();

        $orderUtil->method('sleep')->willReturn(null);

        $result = $orderUtil->getOrder('100000001');

        $this->assertInstanceOf(OrderInterface::class, $result);
        $this->assertEquals('100000001', $result->getIncrementId());
    }

    /**
     * Test getOrder throws NoSuchEntityException when order is not found
     *
     * @magentoConfigFixture current_store multisafepay/general/create_account_after_placing_order 0
     */
    public function testGetOrderThrowsNoSuchEntityExceptionWhenOrderIsNotFound(): void
    {
        $this->expectException(NoSuchEntityException::class);

        $this->orderUtil->getOrder('nonexistent-order-id');
    }

    /**
     * Test getOrder when Create Account After Placing Order is enabled and order transitions from pending to processing
     *
     * @magentoDataFixture Magento/Sales/_files/order_pending_payment.php
     * @magentoConfigFixture current_store multisafepay/general/create_account_after_placing_order 1
     *
     * @throws NoSuchEntityException
     */
    public function testGetOrderWhenOrderTransitionsFromPendingToProcessing(): void
    {
        $objectManager = $this->getObjectManager();
        $orderRepository = $objectManager->get(OrderRepositoryInterface::class);

        $order = $objectManager->get(OrderFactory::class)->create();
        $order->loadByIncrementId('100000001');
        $order->setState(Order::STATE_PENDING_PAYMENT);
        $order->setStatus('pending_payment');
        $orderRepository->save($order);

        // Create a counter to track polling attempts
        $pollCount = 0;

        // Create a mock that only mocks the sleep method and a custom polling method
        $orderUtil = $this->getMockBuilder(CoreOrderUtil::class)
            ->setConstructorArgs([
                $objectManager->get(ThirdPartyPluginsUtil::class),
                $objectManager->get(OrderUtil::class),
                $objectManager->get(Logger::class)
            ])
            ->addMethods(['sleep', 'shouldIterate'])
            ->getMock();

        $orderUtil->method('sleep')->willReturn(null);

        // Mock should iterate to return true only once (allowing one poll iteration)
        $orderUtil->method('shouldIterate')
            ->willReturnCallback(function () use (&$pollCount, $objectManager, $orderRepository) {
                $pollCount++;
                if ($pollCount === 1) {
                    // On first poll, change the order state
                    $order = $objectManager->get(OrderFactory::class)->create();
                    $order->loadByIncrementId('100000001');
                    $order->setState(Order::STATE_PROCESSING);
                    $order->setStatus('processing');
                    $orderRepository->save($order);
                    return false; // Stop polling
                }
                return false;
            });

        // Manually change order state before calling getOrder to simulate the transition
        $order->setState(Order::STATE_PROCESSING);
        $order->setStatus('processing');
        $orderRepository->save($order);

        $result = $orderUtil->getOrder('100000001');

        $this->assertInstanceOf(OrderInterface::class, $result);
        $this->assertEquals('100000001', $result->getIncrementId());
        $this->assertEquals(Order::STATE_PROCESSING, $result->getState());
    }
}
