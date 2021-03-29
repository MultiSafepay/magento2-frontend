<?php

declare(strict_types=1);

namespace MultiSafepay\ConnectFrontend\CustomerData;

use MultiSafepay\ConnectFrontend\ViewModel\PaymentConfig;
use Magento\Customer\CustomerData\SectionSourceInterface;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;

class PaymentRequest implements SectionSourceInterface
{
    /**
     * @var PaymentConfig
     */
    protected $paymentConfig;

    /**
     * PaymentRequest constructor.
     * @param PaymentConfig $paymentConfig
     */
    public function __construct(
        PaymentConfig $paymentConfig
    ) {
        $this->paymentConfig = $paymentConfig;
    }

    /**
     * @return array
     */
    public function getSectionData()
    {
        $data = [
            "enabled" => true
        ];

        return $data;
    }
}
