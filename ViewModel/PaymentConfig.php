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
    ];

    private const DEFAULT_CARD_TYPES = ['credit', 'debit'];

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
     */
    public function getCardsConfig(): array
    {
        $result = [];

        foreach (self::CREDIT_CARD_PAYMENT_METHODS as $methodCode) {
            $configProvider = $this->configProviderPool->getConfigProviderByCode($methodCode);
            $additionalDataConfig = $configProvider->getConfig();
            $paymentConfig = $configProvider->getPaymentConfig((int)$this->getQuote()->getStoreId());

            if ($paymentConfig
                && isset($paymentConfig['payment_type'])
                && $paymentConfig['active']
                && $paymentConfig['payment_type'] == CardPaymentTypes::PAYMENT_REQUEST_PAYMENT_TYPE
            ) {
                $result[$methodCode] = [
                    "types" => self::DEFAULT_CARD_TYPES,
                    "flags" => $this->getCardFlagByMethodCode($methodCode),
                    "prePaid" => 0,
                    "paymentMethod" => $methodCode,
                    "additionalInfo" => $additionalDataConfig && isset($additionalDataConfig['payment'][$methodCode])
                            ? $additionalDataConfig['payment'][$methodCode] : []
                ];
            }
        }

        return $result;
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

        return [str_replace('multisafepay_', '', $methodCode)];
    }

    /**
     * Generate product label using the sku and quantity
     *
     * @param CartItemInterface $item
     * @return string
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    protected function generateProductLabel(CartItemInterface $item): string
    {
        $quantity = $item->getQty();

        if ($quantity > 0) {
            $currencyCode = $this->getCurrency();
            if (filter_var($quantity, FILTER_VALIDATE_INT) === false) {
                return $item->getName() . " (#" . $item->getSku() . ") (" . $currencyCode .
                       number_format((float)$item->getPrice(), 2, '.', '') .
                       ") x" . (int)$quantity;
            } else {
                return $item->getName() . " (#" . $item->getSku() . ") (" . $currencyCode .
                       number_format((float)$item->getPrice(), 2, '.', '') . ") x" .
                       number_format((float)$quantity, 2, '.', '');
            }
        } else {
            return $item->getName() . " (#" . $item->getSku() . ")";
        }
    }

    /**
     * @return array
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    public function getQuoteItems(): array
    {
        $products = [];

        /**
         * @var CartInterface $quote
         */
        $quote = $this->getQuote();

        foreach ($quote->getAllVisibleItems() as $item) {
            $products[$item->getSku()] = [
                "label" => $this->generateProductLabel($item),
                "price" => (float)$item->getPrice() * (float)$item->getQty(),
            ];
        }

        return $products;
    }

    /**
     * @return CartInterface|null
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    private function getQuote()
    {

        if ($this->quote) {
            return $this->quote;
        }

        if (!($quote = $this->session->getQuote())) {
            throw new LocalizedException(__('Cart ID was\'t found'));
        }

        $this->quote = $quote;

        return $this->quote;
    }

    /**
     * @return array
     */
    public function getUrls(): array
    {
        //$maskedQuoteId = $this->getQuoteIdMask();

        return [
            "checkout" => $this->url->getUrl("multisafepay/checkout/index"),
            "success" => $this->url->getUrl("checkout/onepage/success"),
        ];
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
     * @return string
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    public function getCurrency(): string
    {
        return (string)$this->getQuote()->getCurrency()->getQuoteCurrencyCode();
    }

    /**
     * @return array
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    public function getDiscount(): array
    {
        $coupon = (string)$this->getQuote()->getCouponCode();

        if ($coupon !== "") {
            return [
                "label" => sprintf(__("Discount (%s)"), $coupon),
                "amount" => -(
                    $this->session->getQuote()->getSubtotal() - $this->session->getQuote()->getSubtotalWithDiscount()
                ),
            ];
        }

        return [];
    }

    /**
     * @return int
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    public function getCustomerId(): int
    {
        return (int)($this->getQuote()->getCustomerId() ? : null);
    }
}
