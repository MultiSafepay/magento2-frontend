<?php

declare(strict_types=1);

namespace MultiSafepay\ConnectFrontend\CustomerData;

use Exception;
use Magento\Customer\CustomerData\SectionSourceInterface;
use MultiSafepay\ConnectCore\Logger\Logger;
use MultiSafepay\ConnectCore\Model\Ui\GenericConfigProvider;
use MultiSafepay\ConnectFrontend\ViewModel\PaymentConfig;

class PaymentRequest implements SectionSourceInterface
{
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
     * PaymentRequest constructor.
     *
     * @param PaymentConfig $paymentConfig
     * @param GenericConfigProvider $genericConfigProvider
     * @param Logger $logger
     */
    public function __construct(
        PaymentConfig $paymentConfig,
        GenericConfigProvider $genericConfigProvider,
        Logger $logger
    ) {
        $this->paymentConfig = $paymentConfig;
        $this->genericConfigProvider = $genericConfigProvider;
        $this->logger = $logger;
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
