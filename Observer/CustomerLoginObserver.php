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
 * Copyright © 2022 MultiSafepay, Inc. All rights reserved.
 * See DISCLAIMER.md for disclaimer details.
 *
 */

declare(strict_types=1);

namespace MultiSafepay\ConnectFrontend\Observer;

use Exception;
use Magento\Customer\Model\Customer;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Store\Model\StoreManagerInterface;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Model\Api\Builder\TokenRequestBuilder;
use MultiSafepay\ConnectCore\Model\Vault;
use MultiSafepay\Exception\ApiException;
use Psr\Http\Client\ClientExceptionInterface;

class CustomerLoginObserver implements ObserverInterface
{

    /**
     * @var StoreManagerInterface
     */
    private $storeManager;

    /**
     * @var TokenRequestBuilder
     */
    private $tokenRequestBuilder;

    /**
     * @var Vault
     */
    private $vault;

    /**
     * @var Logger
     */
    private $logger;

    /**
     * @var ScopeConfigInterface
     */
    private $scopeConfig;

    /**
     * CustomerLoginObserver constructor.
     *
     * @param StoreManagerInterface $storeManager
     * @param TokenRequestBuilder $tokenRequestBuilder
     * @param Vault $vault
     * @param Logger $logger
     * @param ScopeConfigInterface $scopeConfig
     */
    public function __construct(
        StoreManagerInterface $storeManager,
        TokenRequestBuilder $tokenRequestBuilder,
        Vault $vault,
        Logger $logger,
        ScopeConfigInterface $scopeConfig
    ) {
        $this->storeManager = $storeManager;
        $this->tokenRequestBuilder = $tokenRequestBuilder;
        $this->vault = $vault;
        $this->logger = $logger;
        $this->scopeConfig = $scopeConfig;
    }

    /**
     * Check if MultiSafepay Vault tokens are still up-to-date
     *
     * @param Observer $observer
     * @throws Exception
     */
    public function execute(Observer $observer): void
    {
        /** @var Customer $customer */
        $customer = $observer->getCustomer();

        if (!$customer) {
            return;
        }

        $customerId = (string)$customer->getId();

        if (!$customerId) {
            return;
        }

        try {
            $storeId = $this->storeManager->getStore()->getId();
        } catch (NoSuchEntityException $noSuchEntityException) {
            $this->logger->logException($noSuchEntityException);

            return;
        }

        // Early return when vault methods are not enabled
        if (!$this->isVaultEnabled()) {
            return;
        }

        try {
            $tokens = $this->tokenRequestBuilder->getTokensByCustomerReference($customerId, (int)$storeId);
        } catch (ClientExceptionInterface $clientException) {
            $this->logger->info($clientException->getMessage());

            return;
        } catch (ApiException $apiException) {
            if ($apiException->getCode() === 1000 && $apiException->getMessage() === 'Not found') {
                $this->vault->removePaymentTokensByList([], $customerId);
            }

            return;
        }

        $this->vault->removePaymentTokensByList($tokens, $customerId);
    }

    /**
     * Check if any vault methods are enabled
     *
     * @return bool
     */
    private function isVaultEnabled(): bool
    {
        foreach (array_keys(Vault::VAULT_GATEWAYS) as $method) {
            if ($this->scopeConfig->getValue('payment/' . $method . '_vault/active')) {
                return true;
            }
        }

        return false;
    }
}
