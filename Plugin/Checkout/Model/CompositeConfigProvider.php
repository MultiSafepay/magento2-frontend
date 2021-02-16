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

namespace MultiSafepay\ConnectFrontend\Plugin\Checkout\Model;

use Magento\Checkout\Model\CompositeConfigProvider as CheckoutCompositeConfigProvider;
use MultiSafepay\ConnectCore\Model\Ui\ConfigProviderPool;

class CompositeConfigProvider
{
    /**
     * @var ConfigProviderPool
     */
    private $configProviderPool;

    /**
     * CompositeConfigProvider constructor.
     *
     * @param ConfigProviderPool $configProviderPool
     */
    public function __construct(
        ConfigProviderPool $configProviderPool
    ) {
        $this->configProviderPool = $configProviderPool;
    }

    /**
     * @param CheckoutCompositeConfigProvider $subject
     * @param array $config
     * @return array
     */
    public function afterGetConfig(CheckoutCompositeConfigProvider $subject, array $config): array
    {
        foreach ($this->configProviderPool->getConfigProviders() as $configProvider) {
            $config = array_merge_recursive($config, $configProvider->getConfig());
        }

        return $config;
    }
}
