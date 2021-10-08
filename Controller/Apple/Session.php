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

namespace MultiSafepay\ConnectFrontend\Controller\Apple;

use Exception;
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\App\CsrfAwareActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\Request\InvalidRequestException;
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Model\Ui\Gateway\ApplePayConfigProvider;
use MultiSafepay\ConnectCore\Util\JsonHandler;
use MultiSafepay\Exception\ApiException;
use MultiSafepay\Exception\InvalidApiKeyException;
use Psr\Http\Client\ClientExceptionInterface;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class Session extends Action implements CsrfAwareActionInterface
{
    /**
     * @var JsonHandler
     */
    private $jsonHandler;

    /**
     * @var JsonFactory
     */
    private $resultJsonFactory;

    /**
     * @var ApplePayConfigProvider
     */
    private $applePayConfigProvider;

    /**
     * @var Logger
     */
    private $logger;

    /**
     * Session constructor.
     *
     * @param Context $context
     * @param JsonHandler $jsonHandler
     * @param JsonFactory $resultJsonFactory
     * @param ApplePayConfigProvider $applePayConfigProvider
     * @param Logger $logger
     */
    public function __construct(
        Context $context,
        JsonHandler $jsonHandler,
        JsonFactory $resultJsonFactory,
        ApplePayConfigProvider $applePayConfigProvider,
        Logger $logger
    ) {
        $this->jsonHandler = $jsonHandler;
        $this->resultJsonFactory = $resultJsonFactory;
        $this->applePayConfigProvider = $applePayConfigProvider;
        $this->logger = $logger;
        parent::__construct($context);
    }

    /**
     * @param RequestInterface $request
     * @return InvalidRequestException|null
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function createCsrfValidationException(RequestInterface $request): ?InvalidRequestException
    {
        return null;
    }

    /**
     * @param RequestInterface $request
     * @return bool|null
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function validateForCsrf(RequestInterface $request): ?bool
    {
        return true;
    }

    /**
     * @return Json
     */
    public function execute(): Json
    {
        $resultJson = $this->resultJsonFactory->create();
        $response = [
            'status' => 'error',
            'message' => '',
        ];

        try {
            if ($requestContent = $this->getRequest()->getContent()) {
                $requestData = $this->jsonHandler->readJSON($requestContent);

                if (!isset($requestData['originDomain'], $requestData['validationUrl'])) {
                    $response = [
                        'status' => 'error',
                        'message' => __('Please check POST params.'),
                    ];

                    return $resultJson->setData($response);
                }

                $response = [
                    'status' => 'success',
                    'session' => $this->applePayConfigProvider->createApplePayMerchantSession(
                        [
                            'origin_domain' => $requestData['originDomain'],
                            'validation_url' => $requestData['validationUrl'],
                        ]
                    ),
                ];
            }
        } catch (InvalidApiKeyException $invalidApiKeyException) {
            $this->logger->logApplePayGetMerchantSessionException($invalidApiKeyException);

            $response = [
                'status' => 'error',
                'message' => $invalidApiKeyException->getMessage(),
            ];
        } catch (ApiException $apiException) {
            $this->logger->logApplePayGetMerchantSessionException($apiException);

            $response = [
                'status' => 'error',
                'message' => $apiException->getMessage(),
            ];
        } catch (ClientExceptionInterface $clientException) {
            $this->logger->logApplePayGetMerchantSessionException($clientException);

            $response = [
                'status' => 'error',
                'message' => $clientException->getMessage(),
            ];
        } catch (Exception $exception) {
            $this->logger->logApplePayGetMerchantSessionException($exception);

            $response = [
                'status' => 'error',
                'message' => $exception->getMessage(),
            ];
        }

        return $resultJson->setData($response);
    }
}
