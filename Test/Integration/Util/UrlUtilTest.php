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

use Exception;
use Magento\Checkout\Model\Session;
use Magento\Sales\Model\Order;
use MultiSafepay\ConnectCore\Test\Integration\AbstractTestCase;
use MultiSafepay\ConnectCore\Util\CustomReturnUrlUtil;
use MultiSafepay\ConnectFrontend\Util\UrlUtil;

class UrlUtilTest extends AbstractTestCase
{
    /**
     * @var UrlUtil
     */
    private $urlUtil;

    /**
     * @var Session
     */
    private $checkoutSession;

    /**
     * @return void
     */
    protected function setUp(): void
    {
        $objectManager = $this->getObjectManager();

        $customReturnUrlUtil = $objectManager->get(CustomReturnUrlUtil::class);
        $this->checkoutSession = $objectManager->get(Session::class);

        $this->urlUtil = $objectManager->create(UrlUtil::class, [
            'customReturnUrlUtil' => $customReturnUrlUtil,
            'session' => $this->checkoutSession
        ]);
    }

    /**
     * Test getCustomReturnUrl with a valid order and parameters
     *
     * @magentoDataFixture Magento/Sales/_files/order.php
     *
     * @throws Exception
     */
    public function testGetCustomReturnUrlWithValidOrder(): void
    {
        $objectManager = $this->getObjectManager();
        $order = $objectManager->get(Order::class)->loadByIncrementId('100000001');

        $this->checkoutSession->setLastRealOrder($order);

        $parameters = ['param1' => 'value1', 'param2' => 'value2'];
        $result = $this->urlUtil->getCustomReturnUrl($parameters);

        $this->assertIsString($result);
    }

    /**
     * Test getCustomReturnUrl with a valid order but empty parameters
     *
     * @magentoDataFixture Magento/Sales/_files/order.php
     *
     * @throws Exception
     */
    public function testGetCustomReturnUrlWithEmptyParameters(): void
    {
        $objectManager = $this->getObjectManager();
        $order = $objectManager->get(Order::class)->loadByIncrementId('100000001');

        $this->checkoutSession->setLastRealOrder($order);

        $result = $this->urlUtil->getCustomReturnUrl([]);

        $this->assertIsString($result);
    }

    /**
     * Test getCustomReturnUrl without an order in the session
     *
     * @throws Exception
     */
    public function testGetCustomReturnUrlWithoutOrder(): void
    {
        $this->checkoutSession->setLastRealOrder(null);

        $parameters = ['param1' => 'value1'];
        $result = $this->urlUtil->getCustomReturnUrl($parameters);

        $this->assertSame('', $result);
    }

    /**
     * Test getCustomReturnUrl when custom return URL is not found
     *
     * @magentoDataFixture Magento/Sales/_files/order.php
     *
     * @throws Exception
     */
    public function testGetCustomReturnUrlReturnsEmptyStringWhenCustomUrlNotFound(): void
    {
        $objectManager = $this->getObjectManager();
        $order = $objectManager->get(Order::class)->loadByIncrementId('100000001');

        $mockCustomReturnUrlUtil = $this->createMock(CustomReturnUrlUtil::class);
        $mockCustomReturnUrlUtil->method('getCustomReturnUrlByType')
            ->willReturn(null);

        $urlUtil = $objectManager->create(UrlUtil::class, [
            'customReturnUrlUtil' => $mockCustomReturnUrlUtil,
            'session' => $this->checkoutSession
        ]);

        $this->checkoutSession->setLastRealOrder($order);

        $result = $urlUtil->getCustomReturnUrl(['param1' => 'value1']);

        $this->assertSame('', $result);
    }

    /**
     * @return void
     */
    protected function tearDown(): void
    {
        $this->checkoutSession->clearStorage();
        parent::tearDown();
    }
}
