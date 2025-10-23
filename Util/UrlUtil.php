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
use Magento\Checkout\Model\Session;
use MultiSafepay\ConnectCore\Util\CustomReturnUrlUtil;

class UrlUtil
{
    /**
     * @var CustomReturnUrlUtil
     */
    private $customReturnUrlUtil;

    /**
     * @var Session
     */
    private $session;

    /**
     * @param CustomReturnUrlUtil $customReturnUrlUtil
     * @param Session $session
     */
    public function __construct(
        CustomReturnUrlUtil $customReturnUrlUtil,
        Session $session
    ) {
        $this->customReturnUrlUtil = $customReturnUrlUtil;
        $this->session = $session;
    }

    /**
     * Get custom return URL for the last real order in the checkout session
     *
     * @param array $parameters
     * @return string
     * @throws Exception
     */
    public function getCustomReturnUrl(array $parameters): string
    {
        $customReturnUrl = $this->customReturnUrlUtil->getCustomReturnUrlByType(
            $this->session->getLastRealOrder(),
            $parameters,
            CustomReturnUrlUtil::SUCCESS_URL_TYPE_NAME
        );

        if ($customReturnUrl) {
            return $customReturnUrl;
        }

        return '';
    }
}
