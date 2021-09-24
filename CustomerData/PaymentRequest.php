<?php

declare(strict_types=1);

namespace MultiSafepay\ConnectFrontend\CustomerData;

use Exception;
use Magento\Customer\CustomerData\SectionSourceInterface;
use Magento\Framework\Locale\ResolverInterface;
use MultiSafepay\ConnectCore\Config\Config;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Model\Ui\Gateway\ApplePayConfigProvider;
use MultiSafepay\ConnectCore\Model\Ui\GenericConfigProvider;
use MultiSafepay\ConnectFrontend\ViewModel\PaymentConfig;
use MultiSafepay\ConnectCore\Model\Ui\Gateway\GooglePayConfigProvider;

class PaymentRequest implements SectionSourceInterface
{
    public const CREDIT_CARD_COMPONENT_CONTAINER_ID = 'multisafepay-credit-card-component';

    /**
     * @var PaymentConfig
     */
    private $paymentConfig;

    /**
     * @var GenericConfigProvider
     */
    private $genericConfigProvider;

    /**
     * @var Logger
     */
    private $logger;

    /**
     * @var Config
     */
    private $config;

    /**
     * @var ResolverInterface
     */
    private $localeResolver;

    /**
     * @var GooglePayConfigProvider
     */
    private $googlePayConfigProvider;

    /**
     * @var ApplePayConfigProvider
     */
    private $applePayConfigProvider;

    /**
     * PaymentRequest constructor.
     *
     * @param PaymentConfig $paymentConfig
     * @param GenericConfigProvider $genericConfigProvider
     * @param Logger $logger
     * @param Config $config
     * @param ResolverInterface $localeResolver
     * @param ApplePayConfigProvider $applePayConfigProvider
     */
    public function __construct(
        PaymentConfig $paymentConfig,
        GenericConfigProvider $genericConfigProvider,
        Logger $logger,
        Config $config,
        ResolverInterface $localeResolver,
        ApplePayConfigProvider $applePayConfigProvider,
        GooglePayConfigProvider $googlePayConfigProvider
    ) {
        $this->paymentConfig = $paymentConfig;
        $this->genericConfigProvider = $genericConfigProvider;
        $this->logger = $logger;
        $this->config = $config;
        $this->localeResolver = $localeResolver;
        $this->applePayConfigProvider = $applePayConfigProvider;
        $this->googlePayConfigProvider = $googlePayConfigProvider;
    }

    /**
     * @return array|false[]
     */
    public function getSectionData(): array
    {
        try {
            if ($cardsConfig = $this->paymentConfig->getCardsConfig()) {
                $storeId = $this->paymentConfig->getStoreIdFromQuote();

                return [
                    "enabled" => true,
                    "environment" => $this->config->isLiveMode($storeId) ? 'live' : 'test',
                    "locale" => $this->localeResolver->getLocale(),
                    "cardComponentContainerId" => self::CREDIT_CARD_COMPONENT_CONTAINER_ID,
                    "cardsConfig" => $cardsConfig,
                    "cartItems" => $this->paymentConfig->getQuoteItems(),
                    "additionalTotalItems" => $this->paymentConfig->getAdditionalTotalItems(),
                    "cartTotal" => $this->paymentConfig->getQuoteTotal(),
                    "currency" => $this->paymentConfig->getCurrency(),
                    "quoteId" => $this->paymentConfig->getQuoteId(),
                    'apiToken' => $this->genericConfigProvider->getApiToken($storeId),
                    'applePayButton' => [
                        'isActive' => $this->applePayConfigProvider->isApplePayActive($storeId),
                        'applePayButtonId' => ApplePayConfigProvider::APPLE_PAY_BUTTON_ID
                    ],
                    'googlePayButton' => [
                        'isActive' => $this->googlePayConfigProvider->isApplePayActive($storeId),
                        'applePayButtonId' => GooglePayConfigProvider::GOOGLE_PAY_BUTTON_ID,
                    ],
                ];
            }
        } catch (Exception $exception) {
            $this->logger->logPaymentRequestGetCustomerDataException($exception);
        }

        return ["enabled" => false];
    }
}
