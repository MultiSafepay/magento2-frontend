<?php
/**
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is provided with Magento in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * Copyright © 2022 MultiSafepay, Inc. All rights reserved.
 * See DISCLAIMER.md for disclaimer details.
 */

declare(strict_types=1);

namespace MultiSafepay\ConnectFrontend\Plugin\Customer\Controller\Cards;

use Exception;
use Magento\Customer\Model\SessionFactory;
use Magento\Framework\App\Request\Http;
use Magento\Framework\App\ResponseInterface;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Vault\Api\Data\PaymentTokenInterface;
use Magento\Vault\Controller\Cards\DeleteAction;
use Magento\Vault\Model\PaymentTokenManagement;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Model\Api\Builder\TokenRequestBuilder;
use MultiSafepay\ConnectCore\Model\Vault;
use Psr\Http\Client\ClientExceptionInterface;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class DeleteActionPlugin
{
    /**
     * @var SessionFactory
     */
    private $customerSession;

    /**
     * @var PaymentTokenManagement
     */
    private $paymentTokenManagement;

    /**
     * @var TokenRequestBuilder
     */
    private $tokenRequestBuilder;

    /**
     * @var Logger
     */
    private $logger;

    /**
     * @var StoreManagerInterface
     */
    private $storeManager;

    /**
     * DeleteActionPlugin constructor.
     *
     * @param SessionFactory $customerSession
     * @param PaymentTokenManagement $paymentTokenManagement
     * @param TokenRequestBuilder $tokenRequestBuilder
     * @param Logger $logger
     * @param StoreManagerInterface $storeManager
     */
    public function __construct(
        SessionFactory $customerSession,
        PaymentTokenManagement $paymentTokenManagement,
        TokenRequestBuilder $tokenRequestBuilder,
        Logger $logger,
        StoreManagerInterface $storeManager
    ) {
        $this->customerSession = $customerSession;
        $this->paymentTokenManagement = $paymentTokenManagement;
        $this->tokenRequestBuilder = $tokenRequestBuilder;
        $this->logger = $logger;
        $this->storeManager = $storeManager;
    }

    /**
     * Check if Vault token was deleted and if so, delete at MultiSafepay as well
     *
     * @param DeleteAction $subject
     * @param ResponseInterface $result
     *
     * @return ResponseInterface
     * @throws LocalizedException
     * @throws Exception
     */
    public function afterExecute(DeleteAction $subject, ResponseInterface $result): ResponseInterface
    {
        $customerId = $this->customerSession->create()->getCustomerId();

        /** @var Http $request */
        $request = $subject->getRequest();

        $token = $this->getGatewayToken($request, (int)$customerId);

        if (!$token) {
            return $result;
        }

        try {
            $storeId = (int)$this->storeManager->getStore()->getId();
        } catch (NoSuchEntityException $noSuchEntityException) {
            $this->logger->logException($noSuchEntityException);
            $this->logger->debug('Store ID could not be found, token could not be deleted at MultiSafepay');

            return $result;
        }

        try {
            $this->tokenRequestBuilder->deleteToken((string)$customerId, $token, $storeId);
        } catch (ClientExceptionInterface $clientException) {
            $this->logger->logException($clientException);

            return $result;
        }

        return $result;
    }

    /**
     * Get the token from the database based on the public hash
     *
     * @param Http $request
     * @param int $customerId
     * @return string|null
     * @throws LocalizedException
     * @throws Exception
     */
    private function getGatewayToken(Http $request, int $customerId): ?string
    {
        $publicHash = $request->getPostValue(PaymentTokenInterface::PUBLIC_HASH);

        if ($publicHash === null) {
            $this->logger->debug(
                'Failed to delete the token at MultiSafepay, public hash is missing from the request'
            );

            return null;
        }

        $token = $this->paymentTokenManagement->getByPublicHash($publicHash, $customerId);

        if (!$token) {
            $this->logger->debug(
                'Failed to delete the token at MultiSafepay,
                unable to find the Vault token based on the public hash and customer id'
            );

            return null;
        }

        if (!in_array($token->getPaymentMethodCode(), Vault::VAULT_GATEWAYS, true)) {
            // Not a MultiSafepay token, doing an early return to skip the MultiSafepay token request
            $this->logger->debug(
                'Failed to delete the token at MultiSafepay,
                found a token but it was not a MultiSafepay Vault token'
            );

            return null;
        }

        return $token->getGatewayToken();
    }
}
