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

namespace MultiSafepay\ConnectFrontend\Validator;

use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Model\SecureToken;

class RequestValidator
{
    /**
     * @var Logger
     */
    private $logger;

    /**
     * @var SecureToken
     */
    private $secureToken;

    public function __construct(
        Logger $logger,
        SecureToken $secureToken
    ) {
        $this->logger = $logger;
        $this->secureToken = $secureToken;
    }

    /**
     * @param $parameters
     * @return bool
     */
    public function validate($parameters): bool
    {
        if (!isset($parameters['transactionid'])) {
            return false;
        }

        $orderId = $parameters['transactionid'];

        if (!isset($parameters['secureToken'])) {
            $this->logger->logMissingSecureToken($orderId);
            return false;
        }

        $secureToken = $parameters['secureToken'];

        if (!$this->secureToken->validate($orderId, $secureToken)) {
            $this->logger->logInvalidSecureToken($orderId);
            return false;
        }
        return true;
    }
}
