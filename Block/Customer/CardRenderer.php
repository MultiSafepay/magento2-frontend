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

namespace MultiSafepay\ConnectFrontend\Block\Customer;

use Magento\Framework\View\Element\Template;
use Magento\Payment\Model\CcConfigProvider;
use Magento\Vault\Api\Data\PaymentTokenInterface;
use Magento\Vault\Block\AbstractCardRenderer;
use MultiSafepay\ConnectCore\Model\Vault;
use MultiSafepay\ConnectCore\Util\VaultUtil;
use \MultiSafepay\ConnectCore\Api\PaymentTokenInterface as MultiSafepayPaymentTokenInterface;

class CardRenderer extends AbstractCardRenderer
{
    /**
     * @var VaultUtil
     */
    private $vaultUtil;

    /**
     * CardRenderer constructor.
     *
     * @param Template\Context $context
     * @param CcConfigProvider $iconsProvider
     * @param VaultUtil $vaultUtil
     * @param array $data
     */
    public function __construct(
        Template\Context $context,
        CcConfigProvider $iconsProvider,
        VaultUtil $vaultUtil,
        array $data = []
    ) {
        $this->vaultUtil = $vaultUtil;
        parent::__construct($context, $iconsProvider, $data);
    }

    /**
     * Can render specified token
     *
     * @param PaymentTokenInterface $token
     * @return boolean
     */
    public function canRender(PaymentTokenInterface $token): bool
    {
        return in_array($token->getPaymentMethodCode(), Vault::VAULT_GATEWAYS, true);
    }

    /**
     * @return string
     */
    public function getNumberLast4Digits(): string
    {
        return (string)!empty($this->getTokenDetails()[MultiSafepayPaymentTokenInterface::MASKED_CC]) ?
            $this->getTokenDetails()[MultiSafepayPaymentTokenInterface::MASKED_CC] : '';
    }

    /**
     * @return string
     */
    public function getExpDate(): string
    {
        return (string)($this->getTokenDetails()[MultiSafepayPaymentTokenInterface::EXPIRATION_DATE] ?? '');
    }

    /**
     * @return string
     */
    public function getIconUrl(): string
    {
        return (string)($this->getIcon()[MultiSafepayPaymentTokenInterface::ICON_URL] ?? '');
    }

    /**
     * @return int
     */
    public function getIconHeight(): int
    {
        return (int)($this->getIcon()[MultiSafepayPaymentTokenInterface::ICON_HEIGHT] ?? 0);
    }

    /**
     * @return int
     */
    public function getIconWidth(): int
    {
        return (int)($this->getIcon()[MultiSafepayPaymentTokenInterface::ICON_WIDTH] ?? 0);
    }

    /**
     * @return array
     */
    public function getIcon(): array
    {
        return $this->vaultUtil->getIcon($this->getTokenDetails()[MultiSafepayPaymentTokenInterface::TYPE]) ?? [];
    }
}
