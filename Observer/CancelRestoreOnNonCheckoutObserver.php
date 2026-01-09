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

namespace MultiSafepay\ConnectFrontend\Observer;

use Magento\Framework\App\Area;
use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\App\State;
use Magento\Checkout\Model\Session as CheckoutSession;
use Magento\Framework\Exception\LocalizedException;

class CancelRestoreOnNonCheckoutObserver implements ObserverInterface
{
    /**
     * @var State
     */
    private $appState;

    /**
     * @var CheckoutSession
     */
    private $checkoutSession;

    /**
     * CancelRestoreOnNonCheckoutObserver constructor.
     *
     * @param State $appState
     * @param CheckoutSession $checkoutSession
     */
    public function __construct(
        State $appState,
        CheckoutSession $checkoutSession
    ) {
        $this->checkoutSession = $checkoutSession;
        $this->appState = $appState;
    }

    /**
     * Clears the multisafepay_restore_quote session flag if the current request is not for the cart, standard checkout
     * or FireCheckout page.
     *
     * @param Observer $observer
     * @return void
     */
    public function execute(Observer $observer): void
    {
        try {
            if ($this->appState->getAreaCode() !== Area::AREA_FRONTEND) {
                return;
            }
        } catch (LocalizedException $e) {
            return;
        }

        $pending = (bool)$this->checkoutSession->getData('multisafepay_restore_quote');
        if (!$pending) {
            return;
        }

        $request = $observer->getEvent()->getRequest();
        $fullAction = $request->getFullActionName();
        $pathInfo = $request->getPathInfo();

        $allowedActions = [
            'checkout_index_index',
            'checkout_cart_index'
        ];

        $isAllowedAction = in_array($fullAction, $allowedActions, true);

        // We check path info because full action name might be empty or unreliable at this stage for FireCheckout
        $isFireCheckout = (strpos($pathInfo, '/firecheckout/index/index') === 0);

        if (!$isAllowedAction && !$isFireCheckout) {
            $this->checkoutSession->setData('multisafepay_restore_quote', false);
        }
    }
}
