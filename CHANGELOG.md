# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.8.0] - 2021-06-03
### Fixed
- Fixed a bug where the checkout would restore the first quote, when trying to create a second order in the same session.

### Added
- Added translations to checkout fields. (Thanks to @Davie82) 

## [1.7.1] - 2021-05-19
### Fixed
- Fixed a bug in payment validation transaction type constant scope, changed it from private to public.

### Changed
- Changed composer dependencies to fix  bug related payment validation transaction type constant scope.

## [1.7.0] - 2021-05-12

### Added
- Added the possibility to change direct gateways to redirect
- Added separate phone number field for Afterpay & in3, which will already be filled in if the phone number is present in the billing address

## [1.6.2] - 2021-04-19
### Fixed
- Fixed an issue related to 400 bad request errors with empty fields in the payment additional data.

### Changed
- (dev) Orders are now being retrieved with OrderRepositoryInterface instead of OrderInterfaceFactory

## [1.6.1] - 2021-04-09
### Removed
- Removed order status check and reopening a cancelled order process from the Success controller, since it is already being done by the Notification controller instead.

## [1.6.0] - 2021-03-26
### Removed
- Removed obsolete emandate field from Direct Debit checkout

### Fixed
- Fixed a bug where the wrong processing status was set for the notifications

### Changed
- Refactored notification controller and improved logging

## [1.5.0] - 2021-03-11
### Added
- Added generic gateways and generic giftcards to the checkout dynamically.
- Added the possibility to modify the "Success page" and cancel payment return URLs for PWA storefronts.
- Added support for a customizable pending_payment status when redirecting to the payment page.
- Changed composer dependencies to support Magento 2.2.

### Fixed
- Checkout error when creditcard is preselected

### Changed
- Refactored the payment components by decreasing the amount of javascript files

## [1.4.0] - 2021-02-22
### Added
- Added generic gateway feature for the possibility to add a gateway, which you can customize yourself.
  For more information, please see our [Magento 2 plugin docs](https://docs.multisafepay.com/integrations/plugins/magento2/).
- Added Magento 2 Vault support for credit card payment methods. For more information about the Magento 2 Vault feature, please see [Magento DevDocs](https://devdocs.magento.com/guides/v2.4/payments-integrations/vault/vault-intro.html)
- Added support for Magento 2 Instant Purchases (Works only for Vault supported payment methods). Please see the guide how to use and configure Magento 2 Instant purchase feature in [Magento DevDocs](https://docs.magento.com/user-guide/sales/checkout-instant-purchase.html)
### Changed
- Code refactoring in big parts of the plugin for code improvement, readability and better performance

## [1.3.1] - 2021-02-16
### Fixed
- Fixed wrong api key being used for MultiSafepay requests with a multi store setup
- Fixed order status sometimes not going to processing after it has been invoiced

## [1.3.0] - 2021-01-26
### Added
- Added function to restore quote when using back button on the MultiSafepay payment page
- Added icons for Winkel Cheque, Wellness gift card and Givacard

### Fixed
- Fixed bug "Uncaught TypeError: Cannot read property 'observe' of undefined"
- Fixed duplicate id's for birthday checkout field for in3 and Afterpay

### Changed
- Changed the way checkout fields are observed and default method is selected.
- Updated Trustly logo to new branding standards

### Removed
- Removed duplicate check for sending invoice e-mail

## [1.2.0] - 2020-12-10
### Changed
- Added new iDEAL icon
- Added in3 to checkout
- Added support for preselected default payment method in the checkout

## [1.1.0] - 2020-11-11
### Added
- Added Good4Fun gift card to the checkout
- Added missing gift card logos

### Fixed
- Fixed notification url leading to ReflectionException on some server configurations
- Fixed error message when SecureToken parameters are missing
- Added support for Magento terms and services checkbox agreement
- Added dependencies in module.xml and composer.json
- Removed setup_version from module
- For some billing suite methods, an automatic invoice will not be sent anymore

### Changed
- Rebrand Klarna to the latest standards

## [1.0.0] - 2020-09-02
### Added
- First public release
