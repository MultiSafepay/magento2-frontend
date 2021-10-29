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

use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use MultiSafepay\ConnectFrontend\Validator\RequestValidator;
use MultiSafepay\ConnectCore\Test\Integration\AbstractTestCase;
use MultiSafepay\ConnectCore\Model\SecureToken;

class RequestValidatorTest extends AbstractTestCase
{
    /**
     * @var RequestValidator
     */
    private $requestValidator;

    /**
     * @var SecureToken
     */
    private $secureToken;

    /**
     * {@inheritdoc}
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->requestValidator = $this->getObjectManager()->create(RequestValidator::class);
        $this->secureToken = $this->getObjectManager()->create(SecureToken::class);
    }

    /**
     * @magentoDataFixture   Magento/Sales/_files/order.php
     * @magentoConfigFixture default_store multisafepay/general/test_api_key testkey
     * @magentoConfigFixture default_store multisafepay/general/mode 0
     *
     */
    public function testValidateSecureToken(): void
    {
        $order = $this->getOrder();
        $requestParams = [];

        self::assertFalse($this->requestValidator->validateSecureToken($requestParams));

        $requestParams['transactionid'] = $order->getIncrementId();

        self::assertFalse($this->requestValidator->validateSecureToken($requestParams));

        $requestParams['secureToken'] = $this->secureToken->generate($order->getIncrementId());

        self::assertTrue($this->requestValidator->validateSecureToken($requestParams));

        $requestParams['secureToken'] = 'wrongSecureToken';

        self::assertFalse($this->requestValidator->validateSecureToken($requestParams));
    }
}
