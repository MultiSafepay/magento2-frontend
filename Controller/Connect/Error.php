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

namespace MultiSafepay\ConnectFrontend\Controller\Connect;

use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\Data\Form\FormKey\Validator as FormKeyValidator;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\HTTP\PhpEnvironment\Response;
use MultiSafepay\ConnectCore\Logger\Logger;

class Error extends Action implements HttpPostActionInterface
{
    private const PAYMENT_METHOD_KEY = 'payment_method';
    private const GATEWAY_CODE_KEY = 'gateway_code';
    private const ERROR_KEY = 'error';
    private const PAYMENT_COMPONENT_DATA_KEY = 'payment_component_data';

    private const REQUIRED_PARAMETERS = [
        self::PAYMENT_METHOD_KEY,
        self::GATEWAY_CODE_KEY,
        self::ERROR_KEY,
        self::PAYMENT_COMPONENT_DATA_KEY
    ];

    /**
     * @var Logger
     */
    private $logger;

    /**
     * @var FormKeyValidator
     */
    private $formKeyValidator;

    /**
     * @param Context $context
     * @param Logger $logger
     * @param FormKeyValidator $formKeyValidator
     */
    public function __construct(
        Context $context,
        Logger $logger,
        FormKeyValidator $formKeyValidator
    ) {
        parent::__construct($context);
        $this->logger = $logger;
        $this->formKeyValidator = $formKeyValidator;
    }

    /**
     * Check the parameters from the request and log the error with corresponding details.
     *
     * @inheritDoc
     * @throws LocalizedException
     */
    public function execute()
    {
        /** @var Response $response */
        $response = $this->getResponse();

        if (!$this->formKeyValidator->validate($this->getRequest())) {
            $response->setHttpResponseCode(403);
            $response->setContent('Error: Invalid form key');

            return $response;
        }

        if ($this->isValid($this->getRequest()->getParams())) {
            $response->setHttpResponseCode(422);
            $response->setContent('Error: Missing required parameters.');

            return $response;
        }

        $this->logger->logPaymentComponentError(
            $this->getRequest()->getParam(self::PAYMENT_METHOD_KEY) ?? 'unknown',
            $this->getRequest()->getParam(self::GATEWAY_CODE_KEY) ?? 'unknown',
            $this->getRequest()->getParam(self::ERROR_KEY) ?? 'unknown',
            $this->getRequest()->getParam(self::PAYMENT_COMPONENT_DATA_KEY) ?? 'unknown'
        );

        $response->setContent('Error has been logged in the MultiSafepay debug log.');

        return $response;
    }

    /**
     * To validate the request to check if is valid or not.
     *
     * @param array $parameters
     * @return bool
     */
    private function isValid(array $parameters): bool
    {
        // Check if all the required parameters are present
        if (empty(array_diff(self::REQUIRED_PARAMETERS, $parameters))) {
            return true;
        }

        return false;
    }
}
