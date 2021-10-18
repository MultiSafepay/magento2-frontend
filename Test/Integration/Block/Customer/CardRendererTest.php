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

namespace MultiSafepay\ConnectFrontend\Test\Integration\Block\Customer;

use Magento\Framework\View\Element\Template\Context;
use Magento\Payment\Model\CcConfigProvider;
use Magento\Vault\Api\Data\PaymentTokenInterface;
use MultiSafepay\ConnectCore\Model\Ui\Gateway\CreditCardRecurringConfigProvider;
use MultiSafepay\ConnectCore\Test\Integration\AbstractTestCase;
use MultiSafepay\ConnectCore\Util\VaultUtil;
use MultiSafepay\ConnectFrontend\Block\Customer\CardRenderer;
use MultiSafepay\ConnectFrontend\CustomerData\PaymentRequest;
use PHPUnit\Framework\MockObject\MockObject;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class CardRendererTest extends AbstractTestCase
{
    /**
     * @var PaymentRequest
     */
    private $paymentRequest;

    /**
     * {@inheritdoc}
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->paymentRequest = $this->getObjectManager()->create(PaymentRequest::class);
    }

    public function testGetSectionDataWithCardsConfigData(): void
    {
        $paymentToken = $this->getObjectManager()->create(PaymentTokenInterface::class);
        $paymentToken->setTokenDetails('{"type":"VISA","maskedCC":1111,"expirationDate":"12\/2024"}');
        $paymentToken->setPaymentCode(CreditCardRecurringConfigProvider::CODE);
        $cardRenderer = $this->getCardRendererMock($paymentToken);
        $cardRenderer->render($paymentToken);

        self::assertEquals('1111', $cardRenderer->getNumberLast4Digits());
        self::assertEquals('12/2024', $cardRenderer->getExpDate());
        self::isEmpty($cardRenderer->getIconUrl());
        self::assertEquals(0, $cardRenderer->getIconHeight());
        self::assertEquals(0, $cardRenderer->getIconWidth());
        self::assertEquals(
            [
                'url' => '',
                'width' => 0,
                'height' => 0,
            ],
            $cardRenderer->getIcon()
        );
        self::isTrue($cardRenderer->canRender($paymentToken));
    }

    /**
     * @param PaymentTokenInterface $paymentToken
     * @return MockObject
     */
    private function getCardRendererMock(PaymentTokenInterface $paymentToken): MockObject
    {
        $cardRenderer = $this->getMockBuilder(CardRenderer::class)
            ->setConstructorArgs([
                $this->getObjectManager()->create(Context::class),
                $this->getObjectManager()->create(CcConfigProvider::class),
                $this->getObjectManager()->create(VaultUtil::class),
                [],
            ])
            ->setMethodsExcept([
                'getNumberLast4Digits',
                'getTokenDetails',
                'render',
                'canRender',
                'getExpDate',
                'getIconUrl',
                'getIconHeight',
                'getIconWidth',
                'getIcon',
            ])
            ->getMock();

        $cardRenderer->expects(self::any())
            ->method('getToken')
            ->willReturn($paymentToken);

        return $cardRenderer;
    }
}
