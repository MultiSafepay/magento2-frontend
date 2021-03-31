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
                'apiToken' => 'pub.v2.912d5fd24fdd85d6f204b20969ae84751a79c669e3474cfd09d3c9cc0a6548b6dc8e6867489a1c2efd57adcd6936d50dbb7f37a30d8bfc417f927f68cbccbbaca6e83efd8487a31d97c6c18c74e80b3c1d27a0b0ef63f18088de1484f4002d271b66acc97bedd637cf879302d73da92fe76e555ec736f95f0013705ca1c35343.30820122300d06092a864886f70d01010105000382010f003082010a0282010100d4b37f6e6168220149b6121ec8b307a9f4ee6d87597aa8245773d3b9bf630e241a786a11a0bbe84add89af917c0584d283dafb39d00475646f4bc26dfb59c32fce7dc9f2860c1107a813226e070a032230cd870fe854d02ca6af2d85951439c7c4b019795399d824e7fed80a284c4381c4a7a74e5359e6032cdbaffa8356c0b04ddfaf4a67758aff9add4f976ce5d33d31ed22893bdd18813716d8c961c4530771553f76a85ea13a3e4af7ec4d4a44c0e2abb5758786d7772c02386d1ddb9c5538031e4d1c3f80e9fc600ad715ad50c058ca459683e38da171ce49975fd20fb1f397756d61397551aaa0d1815b01173bff1c3c0009de95da51b8d08028eb67cd0203010001',
            ];
        }

        return [
            "enabled" => false,
        ];
    }
}
