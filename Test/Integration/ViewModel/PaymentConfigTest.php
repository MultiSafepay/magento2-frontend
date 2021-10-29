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
use Magento\Framework\UrlInterface;
use Magento\Quote\Api\Data\CartInterface;
use MultiSafepay\ConnectCore\Model\Ui\ConfigProviderPool;
use MultiSafepay\ConnectCore\Model\Ui\Gateway\AmexConfigProvider;
use MultiSafepay\ConnectCore\Model\Ui\Gateway\CreditCardConfigProvider;
use MultiSafepay\ConnectCore\Model\Ui\Gateway\MaestroConfigProvider;
use MultiSafepay\ConnectCore\Test\Integration\AbstractTestCase;
use MultiSafepay\ConnectFrontend\ViewModel\PaymentConfig;
use PHPUnit\Framework\MockObject\MockObject;

class PaymentConfigTest extends AbstractTestCase
{
    /**
     * @var PaymentConfig
     */
    private $paymentConfig;

    /**
     * {@inheritdoc}
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->paymentConfig = $this->getObjectManager()->create(PaymentConfig::class);
    }

    /**
     * @magentoConfigFixture default_store payment/multisafepay_amex/active 1
     * @magentoConfigFixture default_store payment/multisafepay_creditcard/active 1
     * @magentoConfigFixture default_store payment/multisafepay_maestro/active 1
     *
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    public function testGetCardsConfigForEnabledPaymentMethods(): void
    {
        $returnValue = [
            'multisafepay_amex' => [
                'types' => ['credit', 'debit'],
                'flags' => ['amex'],
                'paymentMethod' => 'multisafepay_amex',
                'gatewayCode' => 'CREDITCARD',
                'paymentType' => 'redirect',
                'additionalInfo' => $this->getObjectManager()->create(AmexConfigProvider::class)
                                        ->getConfig()['payment'][AmexConfigProvider::CODE],
            ],
            'multisafepay_maestro' => [
                'types' => ['credit', 'debit'],
                'flags' => ['visa', 'maestro', 'mastercard'],
                'paymentMethod' => 'multisafepay_maestro',
                'gatewayCode' => 'CREDITCARD',
                'paymentType' => 'redirect',
                'additionalInfo' => $this->getObjectManager()->create(MaestroConfigProvider::class)
                                        ->getConfig()['payment'][MaestroConfigProvider::CODE],
            ],
            'multisafepay_creditcard' => [
                'types' => ['credit', 'debit'],
                'flags' => ['amex', 'visa', 'maestro', 'mastercard'],
                'paymentMethod' => 'multisafepay_creditcard',
                'gatewayCode' => 'CREDITCARD',
                'paymentType' => 'redirect',
                'additionalInfo' => $this->getObjectManager()->create(CreditCardConfigProvider::class)
                                        ->getConfig()['payment'][CreditCardConfigProvider::CODE],
            ],
        ];

        self::assertEquals($returnValue, $this->paymentConfig->getCardsConfig());
    }

    /**
     * @magentoConfigFixture default_store payment/multisafepay_creditcard/active 0
     * @magentoConfigFixture default_store payment/multisafepay_ideal/active 0
     *
     */
    public function testGetCardsConfigForDisabledPaymentMethods(): void
    {
        self::assertEmpty($this->paymentConfig->getCardsConfig());
    }

    /**
     * @magentoDataFixture   Magento/Sales/_files/quote.php
     *
     */
    public function testGenerateProductLabel(): void
    {
        /** @var CartInterface $paymentConfigMockWithQuote */
        $paymentConfigMockWithQuote = $this->getPaymentConfigMockWithQuote($this->getQuote('test01'));

        self::assertEquals(
            [
                'simple' => [
                    'label' => 'Simple Product (SKU: simple); Qty: 1.00',
                    'price' => 10.0,
                ],
            ],
            $paymentConfigMockWithQuote->getQuoteItems()
        );
    }

    /**
     * @magentoDataFixture   Magento/Sales/_files/quote.php
     */
    public function testGetQuoteId(): void
    {
        $quote = $this->getQuote('test01');

        self::assertEquals(
            $quote->getId(),
            $this->getPaymentConfigMockWithQuote($quote)->getQuoteId()
        );
    }

    /**
     * @magentoDataFixture   Magento/Sales/_files/quote.php
     */
    public function testGetQuoteTotal(): void
    {
        $quote = $this->getQuote('test01');

        self::assertEquals(
            (float)$quote->getGrandTotal(),
            $this->getPaymentConfigMockWithQuote($quote)->getQuoteTotal()
        );
    }

    /**
     * @magentoDataFixture   Magento/Sales/_files/quote.php
     */
    public function testGetCurrency(): void
    {
        self::assertEquals(
            'USD',
            $this->getPaymentConfigMockWithQuote($this->getQuote('test01'))->getCurrency()
        );
    }

    /**
     * @magentoDataFixture   Magento/Checkout/_files/quote_with_coupon_saved.php
     */
    public function testGetAdditionalTotalItemsWithActiveCoupon(): void
    {
        $quote = $this->getQuote('test_order_1');
        $shippingAddress = $quote->getShippingAddress();

        self::assertEquals(
            [
                [
                    'label' => __("Discount (%1)", $quote->getCouponCode())->render(),
                    'amount' => $shippingAddress->getDiscountAmount(),
                ],
            ],
            $this->getPaymentConfigMockWithQuote($quote)->getAdditionalTotalItems()
        );
    }

    /**
     * @magentoDataFixture   Magento/Checkout/_files/quote_with_shipping_method.php
     */
    public function testGetAdditionalTotalItemsWithActiveShippingMethod(): void
    {
        $quote = $this->getQuote('test_order_1');
        $shippingAddress = $quote->getShippingAddress();

        self::assertEquals(
            [
                [
                    "label" => __("Shipping Method: (%1)", $shippingAddress->getShippingDescription())->render(),
                    "amount" => $shippingAddress->getShippingInclTax(),
                ],
            ],
            $this->getPaymentConfigMockWithQuote($quote)->getAdditionalTotalItems()
        );
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
