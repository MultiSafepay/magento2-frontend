<?php

declare(strict_types=1);

namespace MultiSafepay\ConnectFrontend\CustomerData;

use Exception;
use Magento\Customer\CustomerData\SectionSourceInterface;
use Magento\Framework\Locale\ResolverInterface;
use MultiSafepay\ConnectCore\Config\Config;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Model\Ui\GenericConfigProvider;
use MultiSafepay\ConnectFrontend\ViewModel\PaymentConfig;

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
     * PaymentRequest constructor.
     *
     * @param PaymentConfig $paymentConfig
     * @param GenericConfigProvider $genericConfigProvider
     * @param Logger $logger
     * @param Config $config
     * @param ResolverInterface $localeResolver
     */
    public function __construct(
        PaymentConfig $paymentConfig,
        GenericConfigProvider $genericConfigProvider,
        Logger $logger,
        Config $config,
        ResolverInterface $localeResolver
    ) {
        $this->paymentConfig = $paymentConfig;
        $this->genericConfigProvider = $genericConfigProvider;
        $this->logger = $logger;
        $this->config = $config;
        $this->localeResolver = $localeResolver;
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
                    'apiToken' => $this->genericConfigProvider->getApiToken($storeId)
                ];
            }
        } catch (Exception $exception) {
            $this->logger->logPaymentRequestGetCustomerDataException($exception);
        }

        return ["enabled" => false];
    }
}
