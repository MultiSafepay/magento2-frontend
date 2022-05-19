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

use Magento\Customer\Model\Customer;
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
     * CustomerLoginObserver constructor.
     *
     * @param StoreManagerInterface $storeManager
     * @param TokenRequestBuilder $tokenRequestBuilder
     * @param Vault $vault
     * @param Logger $logger
     */
    public function __construct(
        StoreManagerInterface $storeManager,
        TokenRequestBuilder $tokenRequestBuilder,
        Vault $vault,
        Logger $logger
    ) {
        $this->storeManager = $storeManager;
        $this->tokenRequestBuilder = $tokenRequestBuilder;
        $this->vault = $vault;
        $this->logger = $logger;
    }

    /**
     * Check if MultiSafepay Vault tokens are still up to date
     *
     * @param Observer $observer
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

        try {
            $tokens = $this->tokenRequestBuilder->getTokensByCustomerReference($customerId, (int)$storeId);
        } catch (ClientExceptionInterface $clientException) {
            $this->logger->logException($clientException);

            return;
        } catch (ApiException $apiException) {
            $this->logger->logException($apiException);

            if ($apiException->getCode() === 1000 && $apiException->getMessage() === 'Not found') {
                $this->vault->removePaymentTokensByList([], $customerId);
            }

            return;
        }

        $this->vault->removePaymentTokensByList($tokens, $customerId);
    }
}
