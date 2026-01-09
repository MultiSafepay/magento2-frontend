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
use Magento\Framework\App\Request\Http;
use Magento\Framework\Event;
use Magento\Framework\Event\Observer;
use MultiSafepay\ConnectCore\Test\Integration\AbstractTestCase;
use MultiSafepay\ConnectFrontend\Observer\CancelRestoreOnNonCheckoutObserver;
use PHPUnit\Framework\MockObject\MockObject;

class CancelRestoreOnNonCheckoutObserverTest extends AbstractTestCase
{
    /**
     * @var CancelRestoreOnNonCheckoutObserver
     */
    private $observer;

    /**
     * @var Session
     */
    private $checkoutSession;

    /**
     * @var Http|MockObject
     */
    private $requestMock;

    /**
     * @return void
     */
    protected function setUp(): void
    {
        $this->checkoutSession = $this->getObjectManager()->get(Session::class);
        $this->observer = $this->getObjectManager()->get(CancelRestoreOnNonCheckoutObserver::class);

        $this->requestMock = $this->getMockBuilder(Http::class)
            ->disableOriginalConstructor()
            ->getMock();
    }

    /**
     * Test that the observer keeps the restore quote flag on checkout-related pages.
     *
     * @magentoAppArea frontend
     */
    public function testExecuteKeepsFlagOnCheckoutIndex(): void
    {
        $this->validateObserverExecution('checkout_index_index', '/checkout/index/index', true);
    }

    /**
     * Test that the observer keeps the restore quote flag on the cart page.
     *
     * @magentoAppArea frontend
     */
    public function testExecuteKeepsFlagOnCartIndex(): void
    {
        $this->validateObserverExecution('checkout_cart_index', '/checkout/cart/index', true);
    }

    /**
     * Test that the observer keeps the restore quote flag on the FireCheckout page.
     *
     * @magentoAppArea frontend
     */
    public function testExecuteKeepsFlagOnFireCheckout(): void
    {
        $this->validateObserverExecution('', '/firecheckout/index/index', true);
    }

    /**
     * Test that the observer clears the restore quote flag on non-checkout pages.
     *
     * @magentoAppArea frontend
     */
    public function testExecuteClearsFlagOnOtherPages(): void
    {
        $this->validateObserverExecution('cms_index_index', '/', false);
    }

    /**
     * Validate the observer execution for given action and path info.
     *
     * @param string $fullActionName
     * @param string $pathInfo
     * @param bool $shouldPreserve
     * @return void
     * @noinspection PhpParamsInspection
     */
    private function validateObserverExecution(string $fullActionName, string $pathInfo, bool $shouldPreserve): void
    {
        $this->checkoutSession->setData('multisafepay_restore_quote', true);

        $this->requestMock->expects($this->any())
            ->method('getFullActionName')
            ->willReturn($fullActionName);
        $this->requestMock->expects($this->any())
            ->method('getPathInfo')
            ->willReturn($pathInfo);

        $event = new Event(['request' => $this->requestMock]);
        $observer = new Observer(['event' => $event]);

        $this->observer->execute($observer);

        $actual = (bool)$this->checkoutSession->getData('multisafepay_restore_quote');

        if ($shouldPreserve) {
            $this->assertTrue($actual, "The restore quote flag should be preserved for action: $fullActionName");
        } else {
            $this->assertFalse($actual, "The restore quote flag should be cleared for action: $fullActionName");
        }
    }
}
