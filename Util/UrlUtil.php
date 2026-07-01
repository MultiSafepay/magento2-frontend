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

use Exception;
use Magento\Sales\Api\Data\OrderInterface;
use MultiSafepay\ConnectCore\Util\CustomReturnUrlUtil;

class UrlUtil
{
    /**
     * @var CustomReturnUrlUtil
     */
    private $customReturnUrlUtil;

    /**
     * @param CustomReturnUrlUtil $customReturnUrlUtil
     */
    public function __construct(CustomReturnUrlUtil $customReturnUrlUtil)
    {
        $this->customReturnUrlUtil = $customReturnUrlUtil;
    }

    /**
     * Get custom return URL for the given order.
     *
     * @param OrderInterface $order
     * @param array $parameters
     * @return string
     * @throws Exception
     */
    public function getCustomReturnUrl(OrderInterface $order, array $parameters): string
    {
        if (!$order->getEntityId()) {
            return '';
        }

        $customReturnUrl = $this->customReturnUrlUtil->getCustomReturnUrlByType(
            $order,
            $parameters,
            CustomReturnUrlUtil::SUCCESS_URL_TYPE_NAME
        );

        return $customReturnUrl ?: '';
    }
}
