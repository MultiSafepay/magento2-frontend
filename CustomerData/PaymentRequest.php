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
            $storeId = $this->paymentConfig->getStoreIdFromQuote();

            return [
                "enabled" => true,
                "cardsConfig" => $cardsConfig,
                "cartItems" => $this->paymentConfig->getQuoteItems(),
                "cartTotal" => $this->paymentConfig->getQuoteTotal(),
                "currency" => $this->paymentConfig->getCurrency(),
                "discount" => $this->paymentConfig->getDiscount(),
                "customerId" => $this->paymentConfig->getCustomerId(),
                "quoteId" => $this->paymentConfig->getQuoteId(),
                'apiToken' => 'pub.v2.92d5b0d18aa71d9f7b0e4f92d5dafed7f843d63abc4e4530bcec30bf24631804344e297b09f502b23e85dcabbabffa9cf5d327c47ddf0c032e97a396eb20249be4124cfd5bf837663ae4671367b366dd5525a793902ef4dd0f4eb9dda144265c5a5a4280e7140c5c02cebb1da1ce89f74ade9ba85d2ef10460f196e6a8e2485a.30820122300d06092a864886f70d01010105000382010f003082010a0282010100c029bb960a2300fa5a6731c1ca0e1db6b3c00abb71c600de2cf160accc5513d493d9338b9153e556e90061be98c80710b658cd03a1e73a5dfba9dec8227114c2f007bb8c17b62aef9d4932eb1ebd91303de9f8614ec0f2295713c179f5cc114811a1aa0cdc49596021ad4b88e4003383f8ac0c54d57d7f4c30cde0c5aa9c635d5dfd867a4a5ea989ccb1cbfe8affb3449cd2295a5fa7e09a0b18238b6c74214290878eb8fe8f711d68cf705b03fa06c4ca1242d47289770d3ace2dcc50d9ff22755d8fdce94337c6540109f5dc804d510e4fa0bc71609dea521fc8f11b254ecef96477660b1efdab3f534681def0424be3d05958888e0b174a46957bad87af4b0203010001',

                /**
                 * should be uncommented when pr's related to API Token will be merged
                 */
                //'apiToken' => $this->genericConfigProvider->getApiToken($storeId),
            ];
        }

        return [
            "enabled" => false,
        ];
    }
}
