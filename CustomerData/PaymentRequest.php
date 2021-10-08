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
     * @param GooglePayConfigProvider $googlePayConfigProvider
     * @param ApplePayConfigProvider $applePayConfigProvider
     */
    public function __construct(
        PaymentConfig $paymentConfig,
        GenericConfigProvider $genericConfigProvider,
        Logger $logger,
        Config $config,
        ResolverInterface $localeResolver,
        GooglePayConfigProvider $googlePayConfigProvider,
        ApplePayConfigProvider $applePayConfigProvider
    ) {
        $this->paymentConfig = $paymentConfig;
        $this->genericConfigProvider = $genericConfigProvider;
        $this->logger = $logger;
        $this->config = $config;
        $this->localeResolver = $localeResolver;
        $this->googlePayConfigProvider = $googlePayConfigProvider;
        $this->applePayConfigProvider = $applePayConfigProvider;
    }

    /**
     * @return array|false[]
     */
    public function getSectionData(): array
    {
        try {
            $storeId = $this->paymentConfig->getStoreIdFromQuote();
            $result = [
                "enabled" => false,
                "environment" => $this->config->isLiveMode($storeId) ? 'live' : 'test',
                "locale" => $this->localeResolver->getLocale(),
                "cartItems" => $this->paymentConfig->getQuoteItems(),
                "additionalTotalItems" => $this->paymentConfig->getAdditionalTotalItems(),
                "cartTotal" => $this->paymentConfig->getQuoteTotal(),
                "currency" => $this->paymentConfig->getCurrency(),
                "quoteId" => $this->paymentConfig->getQuoteId(),
                'applePayButton' => [
                    'isActive' => $this->applePayConfigProvider->isApplePayActive($storeId),
                    'applePayButtonId' => ApplePayConfigProvider::APPLE_PAY_BUTTON_ID,
                    'getMerchantSessionUrl' => $this->applePayConfigProvider->getApplePayMerchantSessionUrl($storeId)
                ],
                'googlePayButton' => [
                    'isActive' => $this->googlePayConfigProvider->isApplePayActive($storeId),
                    'googlePayButtonId' => GooglePayConfigProvider::GOOGLE_PAY_BUTTON_ID,
                ]
            ];

            if ($cardsConfig = $this->paymentConfig->getCardsConfig()) {
                $result = array_merge(
                    $result,
                    [
                        "enabled" => true,
                        "cardComponentContainerId" => self::CREDIT_CARD_COMPONENT_CONTAINER_ID,
                        "cardsConfig" => $cardsConfig,
                        'apiToken' => $this->genericConfigProvider->getApiToken($storeId)
                    ]
                );
            }
        } catch (Exception $exception) {
            $this->logger->logPaymentRequestGetCustomerDataException($exception);
            $result = $result ?? ["enabled" => false];
        }

        return $result;
    }
}
