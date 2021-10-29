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

namespace MultiSafepay\ConnectFrontend\Test\Integration\ViewModel;

use Magento\Checkout\Model\Session;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Locale\ResolverInterface;
use Magento\Framework\UrlInterface;
use Magento\Quote\Api\Data\CartInterface;
use MultiSafepay\ConnectCore\Config\Config;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Model\Ui\ConfigProviderPool;
use MultiSafepay\ConnectCore\Model\Ui\Gateway\ApplePayConfigProvider;
use MultiSafepay\ConnectCore\Model\Ui\Gateway\GooglePayConfigProvider;
use MultiSafepay\ConnectCore\Model\Ui\GenericConfigProvider;
use MultiSafepay\ConnectCore\Test\Integration\AbstractTestCase;
use MultiSafepay\ConnectFrontend\CustomerData\PaymentRequest;
use MultiSafepay\ConnectFrontend\ViewModel\PaymentConfig;
use PHPUnit\Framework\MockObject\MockObject;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class PaymentRequestTest extends AbstractTestCase
{
    private const TEST_API_TOKEN_NAME = 'test_api_token';

    /**
     * @var ResolverInterface
     */
    private $localeResolver;

    /**
     * @var GooglePayConfigProvider
     */
    private $googlePayConfigProvider;

    /**
     * @var ApplePayConfigProvider
     */
    private $applePayConfigProvider;

    /**
     * {@inheritdoc}
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->localeResolver = $this->getObjectManager()->create(ResolverInterface::class);
        $this->googlePayConfigProvider = $this->getObjectManager()->create(GooglePayConfigProvider::class);
        $this->applePayConfigProvider = $this->getObjectManager()->create(ApplePayConfigProvider::class);
    }

    /**
     * @magentoDataFixture   Magento/Sales/_files/quote.php
     * @magentoConfigFixture default_store payment/multisafepay_maestro/active 1
     * @magentoConfigFixture default_store multisafepay/general/test_api_key testkey
     * @magentoConfigFixture default_store multisafepay/general/mode 0
     *
     * @throws NoSuchEntityException
     * @throws LocalizedException
     */
    public function testGetSectionDataWithCardsConfigData(): void
    {
        $quote = $this->getQuote('test01');
        /** @var PaymentConfig $paymentConfigMock */
        $paymentConfigMock = $this->getPaymentConfigMockWithQuote($quote);
        $storeId = $paymentConfigMock->getStoreIdFromQuote();
        $result = [
            'enabled' => true,
            'environment' => 'test',
            'locale' => $this->localeResolver->getLocale(),
            'cartItems' => $paymentConfigMock->getQuoteItems(),
            'additionalTotalItems' => $paymentConfigMock->getAdditionalTotalItems(),
            'cartTotal' => $paymentConfigMock->getQuoteTotal(),
            'currency' => $paymentConfigMock->getCurrency(),
            'quoteId' => $paymentConfigMock->getQuoteId(),
            'applePayButton' => [
                'isActive' => false,
                'applePayButtonId' => ApplePayConfigProvider::APPLE_PAY_BUTTON_ID,
                'getMerchantSessionUrl' => $this->applePayConfigProvider->getApplePayMerchantSessionUrl($storeId),
            ],
            'googlePayButton' => [
                'isActive' => false,
                'googlePayButtonId' => GooglePayConfigProvider::GOOGLE_PAY_BUTTON_ID,
                'mode' => $this->googlePayConfigProvider->getGooglePayMode($storeId),
                'accountId' => '',
                'merchantInfo' => [
                    'merchantName' => '',
                    'merchantId' => '',
                ],
            ],
            'cardComponentContainerId' => PaymentRequest::CREDIT_CARD_COMPONENT_CONTAINER_ID,
            'cardsConfig' => $paymentConfigMock->getCardsConfig(),
            'apiToken' => 'test_api_token',
        ];

        self::assertEquals($result, $this->getPaymentRequestMockWithQuote($quote)->getSectionData());
    }

    /**
     * @magentoDataFixture   Magento/Sales/_files/quote.php
     * @magentoConfigFixture default_store multisafepay/general/test_api_key testkey
     * @magentoConfigFixture default_store multisafepay/general/mode 0
     */
    public function testGetSectionDataWithoutCardsConfigData(): void
    {
        $result = $this->getPaymentRequestMockWithQuote($this->getQuote('test01'))->getSectionData();

        self::assertFalse($result['enabled']);
        self::assertTrue(!isset($result['cardsConfig']));
    }

    /**
     * @param CartInterface $quote
     * @return MockObject
     */
    private function getPaymentRequestMockWithQuote(CartInterface $quote): MockObject
    {
        $genericConfigProviderMock = $this->getMockBuilder(GenericConfigProvider::class)
            ->disableOriginalConstructor()
            ->getMock();

        $genericConfigProviderMock->expects(self::any())
            ->method('getApiToken')
            ->willReturn(self::TEST_API_TOKEN_NAME);

        return $this->getMockBuilder(PaymentRequest::class)
            ->setConstructorArgs([
                $this->getPaymentConfigMockWithQuote($quote),
                $genericConfigProviderMock,
                $this->getObjectManager()->create(Logger::class),
                $this->getObjectManager()->create(Config::class),
                $this->localeResolver,
                $this->getObjectManager()->create(GooglePayConfigProvider::class),
                $this->getObjectManager()->create(ApplePayConfigProvider::class),
            ])
            ->setMethodsExcept(['getSectionData'])
            ->getMock();
    }

    /**
     * @param CartInterface $quote
     * @return MockObject
     */
    private function getPaymentConfigMockWithQuote(CartInterface $quote): MockObject
    {
        $checkoutSessionMock = $this->getMockBuilder(Session::class)
            ->disableOriginalConstructor()
            ->getMock();

        $checkoutSessionMock->expects(self::any())
            ->method('getQuote')
            ->willReturn($quote);

        return $this->getMockBuilder(PaymentConfig::class)
            ->setConstructorArgs([
                $checkoutSessionMock,
                $this->getObjectManager()->create(UrlInterface::class),
                $this->getObjectManager()->create(ConfigProviderPool::class),

            ])
            ->setMethodsExcept([
                'getCardsConfig',
                'getQuoteItems',
                'getQuoteId',
                'getQuoteTotal',
                'getStoreIdFromQuote',
                'getCurrency',
                'getAdditionalTotalItems',
            ])
            ->getMock();
    }
}
