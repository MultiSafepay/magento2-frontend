# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.3.0] - 2023-11-30
### Fixed
- PLGMAG2V2-688: Fixed an issue where coupons would not be restored if the payment was canceled/declined

### Added
- DAVAMS-596: Added a setting to choose SVG icons instead PNG
- DAVAMS-531: Added an advanced setting for adding a template ID to be used for payment components

## [2.2.0] - 2023-10-11
### Added
- DAVAMS-661: Added the Zinia payment method

### Changed
- DAVAMS-643: Refactored and improved the processing of payment component recurring tokens

## [2.1.2] - 2023-09-04
### Added
- PLGMAG2V2-681: Added translations for title and placeholder HTML attributes

## [2.1.1] - 2023-07-17
### Fixed
- PLGMAG2V2-682: Fixed an issue where Google Pay and Apple Pay were not redirecting to the payment page

### Removed
- PLGMAG2V2-669: Removed the setup_version from the module.xml

## [2.1.0] - 2023-05-17
### Added
- PLGMAG2V2-661: Add payment component for Pay After Delivery installments
- PLGMAG2V2-667: Add a setting field to exclude utm_nooverride from the redirect_url

### Changed
- PLGMAG2V2-632: Refactor Credit Card Payment Components

### Fixed
- PLGMAG2V2-665: Fixed Riverty and in3 component rendering, failing in some third party checkouts

## [2.0.0] - 2023-04-03
### Removed
- PLGMAG2V2-617: Refactored notification webhook process. Notification webhooks are now processed in the core module and not in the frontend module.

## [1.19.0] - 2023-03-07
### Added
- Added Pay After Delivery installments payment method

### Removed
- Copyright mention has been removed from the files and is only mentioned from now on in the disclaimer. Please read it if you haven't already

## [1.18.2] - 2022-12-07
### Changed
- Improved the POST notification process by validating the request, before retrieving the order
- Improved the error message that is shown to the customer whenever the payment fails.
- Checking for recurring tokens will only occur now when Magento Vault is enabled.

## [1.18.1] - 2022-10-24
### Fixed
- Fixed references related to the E-Invoicing configurable 'account_number' field

## [1.18.0] - 2022-10-04
### Added
- Added Amazon Pay.
- Added an option for E-invoicing to assign collecting flow ids to specific customer groups.
- Added an option for E-invoicing to turn on and off certain checkout fields.

## [1.17.0] - 2022-08-23
### Added
- Added support for keeping the cart alive when using FireCheckout (Thanks to @mlaurense)
- Added the MyBank payment method
- Improved logging for failed POST notifications

### Fixed
- Prevented double execution of order transaction processing when the POST notification fails

## [1.16.1] - 2022-07-11
### Changed
- Added logging for the notification webhook response

## [1.16.0] - 2022-06-29
### Added
- Added Vault for Maestro
- Added Tokenization (embedded) for the following gateways:
  - American Express
  - Credit Card
  - Maestro
  - Mastercard
  - Visa
- Added the Alipay+ payment method

## [1.15.1] - 2022-05-13
### Fixed
- Fixed an issue with the timing of request timeouts for incoming notifications

## [1.15.0] - 2022-04-28
### Fixed
- Fixed the alignment of the CCV field inside the Credit Card Payment Component

### Changed
- Removed checkout references for ING Home'Pay

## [1.14.1] - 2022-02-22
### Fixed
- Fix notification process for sequential offline actions

## [1.14.0] - 2022-01-11
### Added
- Added checker if order is actually processing before returning 'ok' for notification requests
- Added options for selecting separate behaviours of cancelling MutliSafepay order payment link

### Fixed
- Fixed an issue where sometimes no error message shown with declined AfterPay transaction

## [1.13.0] - 2021-11-30
### Fixed
- Fixed an issue where frontend fetches API tokens for CC component, while payment type is configured as redirect (Thanks to @thlassche)

### Changed
- Changed the Google Pay button background to be transparent instead of white.
- Made changes in the way the payment link is retrieved from the order.
- Extended direct ApplePay with requiredBillingContactFields

## [1.12.1] - 2021-11-03
### Fixed
- Fixed an issue with AfterPay Date of Birth date picker field

## [1.12.0] - 2021-10-29
### Added
- Added iDEAL and Direct Debit Vault
- Added Edenred

### Changed
- Changed the Vault 'Save for later use' checkbox to be default unchecked instead of checked for MultiSafepay payment methods
- Changed the module to not only return an 'ng' on notification failure and show more information about why the notification process failed

## [1.11.0] - 2021-10-15
### Added
- Added Apple Pay Direct
- Added Google Pay Direct/Redirect
- Added WeChat Pay Redirect

### Fixed
- Fixed Credit Card Payment Component not showing on IE due to new JS syntax (thanks to @thlassche)
- Fixed the utm_nooverride parameter not being picked up in Google Analytics because of a trailing slash (Thanks to @peterjaap)

### Changed
- Changed the placement of the iDEAL issuers dropdown to be on top of the billing address instead of below it.

## [1.10.2] - 2021-10-07
### Changed
- Updated the MultiSafepay credit card component javascript library from V1 to V2.

## [1.10.1] - 2021-09-07
### Fixed
- Fixed an issue where there were duplicate controllers with the legacy plugin, causing an error on transaction placement.

## [1.10.0] - 2021-08-27
### Changed
- We are now removing sensitive data from the payment after the customer has been redirected.
- Added date picker field for Date of Birth checkout fields to further increase the consistency of input
- Dropped support for Magento 2.2.x versions.

### Fixed
- Fixed a bug where some POST notification can be restricted because of CSRF validation.
- Fixed a bug where retrieving Vault stored cards would cause a type error.
- Fixed PHP Mess detector issues.

## [1.9.2] - 2021-07-30
### Fixed
- Fixed a bug where some header elements were still visible inside the checkout (Thanks to @Davie82)
- Fixed a bug where the MultiSafepay payment component external js file could not be loaded when using Magento javascript minification

## [1.9.1] - 2021-06-25
### Fixed
- Fixed a bug related to GET notifications where orders would stay in pending_payment status
- Removed trailing comma for compatibility with IE11 in frontend plugin. (Thanks to @barryvdh)

## [1.9.0] - 2021-06-17
- Added MultiSafepay Credit Card component support for credit card payment methods.

### Changed
- Moved setting pending_payment status from Redirect controller to Gateway Request Builder
- Changed the notification method from 'GET' to 'POST'
- Improved the logging for the notification actions

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
