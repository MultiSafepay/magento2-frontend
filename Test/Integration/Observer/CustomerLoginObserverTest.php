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

use Magento\Customer\Model\Customer;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Event\Observer;
use Magento\Store\Api\Data\StoreInterface;
use Magento\Store\Model\ScopeInterface;
use Magento\Store\Model\StoreManagerInterface;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Model\Api\Builder\TokenRequestBuilder;
use MultiSafepay\ConnectCore\Model\Vault;
use MultiSafepay\ConnectFrontend\Observer\CustomerLoginObserver;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\MockObject\Stub;
use PHPUnit\Framework\TestCase;

class CustomerLoginObserverTest extends TestCase
{
    private const STORE_ID = 5;
    private const CUSTOMER_ID = '42';
    private const VAULT_ACTIVE_PATH = 'payment/multisafepay_visa_vault/active';

    /**
     * @var TokenRequestBuilder|MockObject
     */
    private $tokenRequestBuilder;

    /**
     * @var Vault|MockObject
     */
    private $vault;

    /**
     * @var ScopeConfigInterface|Stub
     */
    private $scopeConfig;

    /**
     * @var CustomerLoginObserver
     */
    private $customerLoginObserver;

    /**
     * {@inheritdoc}
     */
    protected function setUp(): void
    {
        parent::setUp();

        $store = $this->createStub(StoreInterface::class);
        $store->method('getId')->willReturn(self::STORE_ID);

        $storeManager = $this->createStub(StoreManagerInterface::class);
        $storeManager->method('getStore')->willReturn($store);

        $this->tokenRequestBuilder = $this->createMock(TokenRequestBuilder::class);
        $this->vault = $this->createMock(Vault::class);
        $this->scopeConfig = $this->createStub(ScopeConfigInterface::class);

        $this->customerLoginObserver = new CustomerLoginObserver(
            $storeManager,
            $this->tokenRequestBuilder,
            $this->vault,
            $this->createStub(Logger::class),
            $this->scopeConfig
        );
    }

    /**
     * Vault enabled only on the store view the customer logs in on
     */
    public function testExecuteRemovesStaleTokensWhenVaultIsEnabledOnStoreScopeOnly(): void
    {
        $this->scopeConfig->method('getValue')->willReturnCallback(
            static function (string $path, $scope = 'default', $scopeCode = null) {
                return $path === self::VAULT_ACTIVE_PATH
                    && $scope === ScopeInterface::SCOPE_STORE
                    && (int)$scopeCode === self::STORE_ID;
            }
        );

        $tokens = ['gateway-token'];
        $this->tokenRequestBuilder->expects($this->once())
            ->method('getTokensByCustomerReference')
            ->with(self::CUSTOMER_ID, self::STORE_ID)
            ->willReturn($tokens);
        $this->vault->expects($this->once())
            ->method('removePaymentTokensByList')
            ->with($tokens, self::CUSTOMER_ID);

        $this->customerLoginObserver->execute($this->getObserver());
    }

    /**
     * Vault not enabled for the store view
     */
    public function testExecuteDoesNothingWhenVaultIsDisabled(): void
    {
        $this->scopeConfig->method('getValue')->willReturn(false);

        $this->tokenRequestBuilder->expects($this->never())->method('getTokensByCustomerReference');
        $this->vault->expects($this->never())->method('removePaymentTokensByList');

        $this->customerLoginObserver->execute($this->getObserver());
    }

    /**
     * @return Observer
     */
    private function getObserver(): Observer
    {
        $customer = $this->createStub(Customer::class);
        $customer->method('getId')->willReturn(self::CUSTOMER_ID);

        return new Observer(['customer' => $customer]);
    }
}
