<?php

declare(strict_types=1);

namespace MultiSafepay\ConnectFrontend\ViewModel;

use Magento\Checkout\Model\Session;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\UrlInterface;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Quote\Api\Data\CartInterface;
use Magento\Quote\Api\Data\CartItemInterface;
use MultiSafepay\ConnectAdminhtml\Model\Config\Source\CardPaymentTypes;
use MultiSafepay\ConnectCore\Model\Ui\ConfigProviderPool;
use MultiSafepay\ConnectCore\Model\Ui\Gateway\AmexConfigProvider;
use MultiSafepay\ConnectCore\Model\Ui\Gateway\CreditCardConfigProvider;
use MultiSafepay\ConnectCore\Model\Ui\Gateway\MaestroConfigProvider;
use MultiSafepay\ConnectCore\Model\Ui\Gateway\MastercardConfigProvider;
use MultiSafepay\ConnectCore\Model\Ui\Gateway\VisaConfigProvider;

class PaymentConfig implements ArgumentInterface
{
    private const CREDIT_CARD_PAYMENT_METHODS = [
        AmexConfigProvider::CODE,
        MaestroConfigProvider::CODE,
        MastercardConfigProvider::CODE,
        VisaConfigProvider::CODE,
        CreditCardConfigProvider::CODE,
    ];

    private const DEFAULT_CARD_TYPES = ['credit', 'debit'];
    private const CREDITCARD_GATEWAY_CODE = 'CREDITCARD';

    /**
     * @var CartInterface|null
     */
    private $quote = null;

    /**
     * @var Session
     */
    protected $session;

    /**
     * @var UrlInterface
     */
    protected $url;

    /**
     * @var ConfigProviderPool
     */
    protected $configProviderPool;

    /**
     * PaymentConfig constructor.
     *
     * @param Session $session
     * @param UrlInterface $url
     * @param ConfigProviderPool $configProviderPool
     */
    public function __construct(
        Session $session,
        UrlInterface $url,
        ConfigProviderPool $configProviderPool
    ) {
        $this->session = $session;
        $this->url = $url;
        $this->configProviderPool = $configProviderPool;
    }

    /**
     * @return array
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    public function getCardsConfig(): array
    {
        $result = [];

        foreach (self::CREDIT_CARD_PAYMENT_METHODS as $methodCode) {
            if (!($configProvider = $this->configProviderPool->getConfigProviderByCode($methodCode))) {
                continue;
            }

            $additionalDataConfig = $configProvider->getConfig();
            $paymentConfig = $configProvider->getPaymentConfig(
                (int)$this->getQuote()->getStoreId()
            );

            if ($paymentConfig && $this->isCreditCardComponentAvailable($paymentConfig)) {
                $result[$methodCode] = [
                    "types" => self::DEFAULT_CARD_TYPES,
                    "flags" => $this->getCardFlagByMethodCode($methodCode),
                    "paymentMethod" => $methodCode,
                    "gatewayCode" => self::CREDITCARD_GATEWAY_CODE,
                    "paymentType" => $paymentConfig['payment_type'],
                    "additionalInfo" => $additionalDataConfig && isset($additionalDataConfig['payment'][$methodCode])
                        ? $additionalDataConfig['payment'][$methodCode] : [],
                ];
            }
        }

        return $result;
    }

    /**
     * @param array $paymentConfig
     * @return bool
     */
    private function isCreditCardComponentAvailable(array $paymentConfig): bool
    {
        return isset($paymentConfig['payment_type'], $paymentConfig['active'])
               && $paymentConfig['payment_type'] === CardPaymentTypes::CREDIT_CARD_COMPONENT_PAYMENT_TYPE
               && (bool)$paymentConfig['active'];
    }

    /**
     * @param string $methodCode
     * @return array|string[]
     */
    private function getCardFlagByMethodCode(string $methodCode): array
    {
        if ($methodCode === CreditCardConfigProvider::CODE) {
            return ['amex', 'visa', 'maestro', 'mastercard'];
        }

        if ($methodCode === MaestroConfigProvider::CODE) {
            return ['visa', 'maestro', 'mastercard'];
        }

        return [str_replace('multisafepay_', '', $methodCode)];
    }

    /**
     * @param CartItemInterface $item
     * @return string
     */
    protected function generateProductLabel(CartItemInterface $item): string
    {
        $quantity = $item->getQty();
        $result = $item->getName() . " (SKU: " . $item->getSku() . ")";

        return $quantity > 0
            ? $result . "; Qty: " . (is_int($quantity) ? (int)$quantity
                : number_format((float)$quantity, 2, '.', ''))
            : $result;
    }

    /**
     * @return array
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    public function getQuoteItems(): array
    {
        $quote = $this->getQuote();
        $products = [];

        foreach ($quote->getAllVisibleItems() as $item) {
            $products[$item->getSku()] = [
                "label" => $this->generateProductLabel($item),
                "price" => (float)$item->getPrice() * (float)$item->getQty(),
            ];
        }

        return $products;
    }

    /**
     * @return CartInterface
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    private function getQuote(): CartInterface
    {
        if (!$this->quote) {
            $this->quote = $this->session->getQuote();
        }

        return $this->quote;
    }

    /**
     * @return int
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    public function getQuoteId(): int
    {
        return (int)$this->getQuote()->getId();
    }

    /**
     * @return float
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    public function getQuoteTotal(): float
    {
        return (float)$this->getQuote()->getGrandTotal();
    }

    /**
     * @return int
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    public function getStoreIdFromQuote(): int
    {
        return (int)$this->getQuote()->getStoreId();
    }

    /**
     * @return string
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    public function getCurrency(): string
    {
        $currency = $this->getQuote()->getCurrency();

        return (string)($currency ? $currency->getQuoteCurrencyCode() : '');
    }

    /**
     * @return array
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    public function getAdditionalTotalItems(): array
    {
        $result = [];
        $quote = $this->getQuote();
        $shippingAddress = $quote->getShippingAddress();
        $taxAmount = $shippingAddress->getTaxAmount();

        if ($shippingAddress->getShippingMethod()) {
            $result[] = [
                "label" => __("Shipping Method: (%1)", $shippingAddress->getShippingDescription())->render(),
                "amount" => $shippingAddress->getShippingInclTax(),
            ];
        }

        if ((float)$taxAmount) {
            $result[] = [
                "label" => "Tax:",
                "amount" => $taxAmount,
            ];
        }

        if ($coupon = (string)$quote->getCouponCode()) {
            $result[] = [
                "label" => __("Discount (%1)", $coupon)->render(),
                "amount" => $shippingAddress->getDiscountAmount(),
            ];
        }

        return $result;
    }
}
