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
use Magento\Store\Model\Store;
use Magento\Store\Model\StoreManagerInterface;
use MultiSafepay\ConnectCore\Test\Integration\AbstractTestCase;
use MultiSafepay\ConnectFrontend\Util\HostUtil;

class HostUtilTest extends AbstractTestCase
{
    /**
     * Test getBaseHost returns correct host from base URL
     *
     * @return void
     * @throws NoSuchEntityException
     */
    public function testGetBaseHostReturnsCorrectHost()
    {
        $baseUrl = 'https://example.com/';
        $expectedHost = 'example.com';

        // Create a mock StoreManagerInterface
        $storeManagerMock = $this->createMock(StoreManagerInterface::class);
        $storeMock = $this->getMockBuilder(Store::class)
            ->disableOriginalConstructor()
            ->getMock();
        $storeMock->method('getBaseUrl')->willReturn($baseUrl);
        $storeManagerMock->method('getStore')->willReturn($storeMock);

        $hostUtil = new HostUtil($storeManagerMock);
        $host = $hostUtil->getBaseHost();
        $this->assertEquals($expectedHost, $host);
    }
}
