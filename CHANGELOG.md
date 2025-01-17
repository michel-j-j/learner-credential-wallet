# learner-credential-wallet Changelog
## 2.1.2 - build 82

### Fixed
- Fix signature verification (`@sphereon/isomorphic-webcrypto` was failing upstream in `jsonld-signatures`),
  and has been replaced with `expo-crypto` usage. Also fixes StatusList `Buffer` error.

## 2.1.1 - build 81

### Changed
- Update to latest library versions, add support for VC DM 2.0.

## 2.1.0 - build 80
- First official release to app stores post RN Upgrade and conversion to Expo. Releases are now back on `main` branch.

### Added
- Add support for the OBv3 name property (derived from `identifierHash` when `identifierType == 'name'`).

## 2.0.24 - build 79 (Pre-RN Upgrade `demo` branch)
### Changed
- Fix 'Register Wallet' button on Android.

## 2.0.23 - build 78 (Pre-RN Upgrade `demo` branch)
### Changed
- Update sample VC templates from dev menu.
- Fix PDF generation Share call.

## 2.0.21 - build 76
### Changed
- Update to latest Bitstring Status List dependency.

## 2.0.8 - build 63
### Changed
- Fix 'Android add button not clickable' issue #449
- Remove Custom Setup Option PR #452
- Update SplashScreen image PR #453
- Update warning text on wallet setup, include 6 char minimum, issue #392
- Fix CI build error (`@nuintun/qrcode` patch), issue #451
- Fix Issue Date and Expiration Date, issue #365
- Fix Cancel button styling during LI share, issue #461

## 1.17.3 - build 52 - 2022-12-08
### Changed
- (Fix) Roll back PR #293 (which broke Send Credential button).

## 1.17.2 - build 51 - 2022-12-07
### Changed
- Fix config implementation, verifier-plus integration

For previous history, see Git commits.
