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
 * Copyright © 2021 MultiSafepay, Inc. All rights reserved.
 * See DISCLAIMER.md for disclaimer details.
 *
 */

declare(strict_types=1);

namespace MultiSafepay\ConnectFrontend\Plugin\Checkout\Block\Checkout;

use Magento\Checkout\Block\Checkout\LayoutProcessor;
use Magento\Checkout\Model\CompositeConfigProvider as CheckoutCompositeConfigProvider;
use Magento\Framework\Stdlib\ArrayManager;
use Magento\Store\Model\StoreManagerInterface;
use MultiSafepay\ConnectCore\Model\Ui\Gateway\GenericGatewayConfigProvider;

class LayoutProcessorPlugin
{
    /**
     * @var GenericGatewayConfigProvider
     */
    private $genericGatewayConfigProvider;

    /**
     * @var StoreManagerInterface
     */
    private $storeManager;

    /**
     * @var ArrayManager
     */
    private $arrayManager;

    /**
     * LayoutProcessorPlugin constructor.
     *
     * @param StoreManagerInterface $storeManager
     * @param GenericGatewayConfigProvider $genericGatewayConfigProvider
     * @param ArrayManager $arrayManager
     */
    public function __construct(
        StoreManagerInterface $storeManager,
        GenericGatewayConfigProvider $genericGatewayConfigProvider,
        ArrayManager $arrayManager
    ) {
        $this->genericGatewayConfigProvider = $genericGatewayConfigProvider;
        $this->storeManager = $storeManager;
        $this->arrayManager = $arrayManager;
    }

    /**
     * @param CheckoutCompositeConfigProvider $subject
     * @param array $config
     * @return array
     */
    public function beforeProcess(LayoutProcessor $subject, array $jsLayout): array
    {
        $currentPaymentComponents = $jsLayout["components"]["checkout"]["children"]["steps"]["children"]["billing-step"]
                                    ["children"]["payment"]["children"]["renders"]["children"];

        if (!isset($currentPaymentComponents[GenericGatewayConfigProvider::CODE])) {
            $genericGatewaysList = $this->genericGatewayConfigProvider
                ->getGenericGatewaysList($this->storeManager->getStore()->getId());

            foreach ($genericGatewaysList as $gatewayCode) {
                $currentPaymentComponents[$gatewayCode] = [
                    'component' => $this->genericGatewayConfigProvider->getPaymentJsComponent(),
                    'methods' => [
                        $gatewayCode => [
                            'isBillingAddressRequired' => true,
                            'code' => $gatewayCode
                        ]
                    ]
                ];
            }

            $jsLayout["components"]["checkout"]["children"]["steps"]["children"]["billing-step"]
            ["children"]["payment"]["children"]["renders"]["children"] = $currentPaymentComponents;
        }

        return [$jsLayout];
    }
}
