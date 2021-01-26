# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Added icons for Winkel Cheque, Wellness gift card and Givacard

### Fixed
- Fixed bug "Uncaught TypeError: Cannot read property 'observe' of undefined"

### Changed
- Changed the way checkout fields are observed and default method is selected.

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
