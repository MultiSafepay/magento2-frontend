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
use Magento\Sales\Api\Data\OrderInterface;
use Magento\Sales\Model\Order;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Util\ThirdPartyPluginsUtil;
use MultiSafepay\ConnectCore\Util\OrderUtil as CoreOrderUtil;

class OrderUtil
{
    /**
     * @var ThirdPartyPluginsUtil
     */
    private $thirdPartyPluginsUtil;

    /**
     * @var CoreOrderUtil
     */
    private $coreOrderUtil;

    /**
     * @var Logger
     */
    private $logger;

    /**
     * @param ThirdPartyPluginsUtil $thirdPartyPluginsUtil
     * @param CoreOrderUtil $coreOrderUtil
     * @param Logger $logger
     */
    public function __construct(
        ThirdPartyPluginsUtil $thirdPartyPluginsUtil,
        CoreOrderUtil $coreOrderUtil,
        Logger $logger
    ) {
        $this->thirdPartyPluginsUtil = $thirdPartyPluginsUtil;
        $this->coreOrderUtil = $coreOrderUtil;
        $this->logger = $logger;
    }

    /**
     * Get order by increment ID with retries if Create Account After Placing Order is enabled
     *
     * @param string $orderIncrementId
     * @return OrderInterface
     * @throws NoSuchEntityException
     */
    public function getOrder(string $orderIncrementId): OrderInterface
    {
        if (!$this->thirdPartyPluginsUtil->canCreateAccountAfterPlacingOrder()) {
            return $this->coreOrderUtil->getOrderByIncrementId($orderIncrementId);
        }

        for ($count = 0; $count < 5; $count++) {
            $order = $this->coreOrderUtil->getOrderByIncrementId($orderIncrementId);

            // Check if the order is in processing state
            if ($order->getState() !== Order::STATE_PENDING_PAYMENT) {
                return $order;
            };

            $this->logger->logInfoForOrder(
                $orderIncrementId,
                'Order is still in pending payment state. Trying again in 3 seconds.'
            );

            // Try again in 3 seconds
            //phpcs:ignore
            sleep(3);

            if ($count === 4) {
                $this->logger->logInfoForOrder(
                    $orderIncrementId,
                    'Order remained in pending payment state after 5 attempts.'
                );
            }
        }

        return $this->coreOrderUtil->getOrderByIncrementId($orderIncrementId);
    }
}
