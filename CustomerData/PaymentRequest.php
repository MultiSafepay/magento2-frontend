<?php

declare(strict_types=1);

namespace MultiSafepay\ConnectFrontend\CustomerData;

use Magento\Customer\CustomerData\SectionSourceInterface;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
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
     * PaymentRequest constructor.
     *
     * @param PaymentConfig $paymentConfig
     * @param GenericConfigProvider $genericConfigProvider
     */
    public function __construct(
        PaymentConfig $paymentConfig,
        GenericConfigProvider $genericConfigProvider
    ) {
        $this->paymentConfig = $paymentConfig;
        $this->genericConfigProvider = $genericConfigProvider;
    }

    /**
     * @return array|false[]
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    public function getSectionData()
    {
        if ($cardsConfig = $this->paymentConfig->getCardsConfig()) {
            return [
                "enabled" => true,
                "cardsConfig" => $cardsConfig,
                "urls" => $this->paymentConfig->getUrls(),
                "cartItems" => $this->paymentConfig->getQuoteItems(),
                "cartTotal" => $this->paymentConfig->getQuoteTotal(),
                "currency" => $this->paymentConfig->getCurrency(),
                "discount" => $this->paymentConfig->getDiscount(),
                "customerId" => $this->paymentConfig->getCustomerId(),
                "quoteId" => $this->paymentConfig->getQuoteId(),
                'apiToken' => '123123123123123123',
            ];
        }

        return [
            "enabled" => false,
        ];
    }
}
