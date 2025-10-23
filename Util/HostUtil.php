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

namespace MultiSafepay\ConnectFrontend\Util;

use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\UrlInterface;
use Magento\Store\Model\StoreManagerInterface;

class HostUtil
{
    /**
     * @var StoreManagerInterface
     */
    private $storeManager;

    /**
     * @param StoreManagerInterface $storeManager
     */
    public function __construct(
        StoreManagerInterface $storeManager
    ) {
        $this->storeManager = $storeManager;
    }

    /**
     * Get the base host of the store using Zend or Laminas depending on which is available.
     *
     * @return string
     * @throws NoSuchEntityException
     */
    public function getBaseHost(): string
    {
        $baseUrl = $this->storeManager->getStore()->getBaseUrl(UrlInterface::URL_TYPE_WEB);

        if (class_exists(\Laminas\Uri\Http::class)) {
            try {
                return (new \Laminas\Uri\Http($baseUrl))->getHost();
            } catch (\Exception $e) {
                throw new \RuntimeException(
                    sprintf('Failed to parse base URL "%s": %s', $baseUrl, $e->getMessage()),
                    0,
                    $e
                );
            }
        }

        try {
            return (new \Zend\Uri\Http($baseUrl))->getHost();
        } catch (\Exception $e) {
            throw new \RuntimeException(
                sprintf('Failed to parse base URL "%s": %s', $baseUrl, $e->getMessage()),
                0,
                $e
            );
        }
    }
}
