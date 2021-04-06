define([
    'multisafepayUtils',
    'mage/translate',
    'jquery'
], function (multisafepayUtils, $t, $) {
    'use strict';

    return {
        process: function (paymentRequest, paymentResponse, paymentCode, paymentRequestData) {
            let details = paymentResponse.details,
                paymentData = paymentRequestData.cardsConfig[paymentCode],
                publicApiToken = paymentRequestData.apiToken,
                payloadData = false;

            if (!publicApiToken) {
                console.log($t("No public API token was provided."));
                paymentResponse.complete('fail');
            }

            // const MSP = new MultiSafepay({
            //     env : '',
            //     envApiEndpoint : 'https://testapi.multisafepay.com/v1/',
            //     apiToken : publicApiToken,
            //     order : []
            // });

            // MSP.init('payment', {
            //     container: '#MSPPayment',
            //     gateway: 'CREDITCARD',
            //     onLoad: state => {
            //         console.log('onLoad', state);
            //     },
            //     onError: state => {
            //         console.log('onError', state);
            //     }
            // });

            try {
                let encryptedData = this.getEncryptedData(details, publicApiToken);

                if (!encryptedData) {
                    console.log($t("Can\'t get the payment encrypted data."));
                    paymentResponse.complete('fail');
                }

                console.log(encryptedData);
                paymentResponse.complete('fail');
            } catch (e) {
                console.log(e);
                paymentResponse.complete('fail');
            }


            //
            // var customerFullName = details.billingAddress.recipient;
            // var names = customerFullName.split(" ");
            // var finalData = {
            //     number: details.cardNumber,
            //     cardholderName: details.cardholderName,
            //     expirationMonth: details.expiryMonth,
            //     expirationYear: details.expiryYear,
            //     cvv: details.cardSecurityCode,
            //     billingAddress: {
            //         firstName : names[0],
            //         lastName : names.slice(-1)[0],
            //         company : details.billingAddress.organization,
            //         streetAddress : Object.values(details.billingAddress.addressLine).length > 0
            //             ? details.billingAddress.addressLine[0] : '',
            //         extendedAddress : Object.values(details.billingAddress.addressLine).length > 1
            //             ? details.billingAddress.addressLine[1] : '',
            //         locality : details.billingAddress.city,
            //         region : details.billingAddress.region,
            //         postalCode : details.billingAddress.postalCode,
            //         countryCodeAlpha2 : details.billingAddress.country
            //     }
            // };
            // var client = new braintreeClient.api.Client({clientToken: w3cPaymentRequest.cardConfig.additionalInfo.clientToken});
            // client.tokenizeCard(finalData, function (err, nonce) {
            //     if (!err) {
            //         var params = {
            //             paymentMethod: "braintree",
            //             token: nonce,
            //             shippingAddress: JSON.parse(JSON.stringify(paymentResponse.shippingAddress)),
            //             billingAddress: details.billingAddress,
            //             contactInfo: {
            //                 name: paymentResponse.payerName,
            //                 email: paymentResponse.payerEmail,
            //                 phone: paymentResponse.payerPhone
            //             },
            //             shippingMethod: JSON.parse(paymentRequest.shippingOption)
            //         };
            //         $.ajax({
            //             url: w3cPaymentRequest.urls.checkout,
            //             action: 'POST',
            //             cache: false,
            //             data: params,
            //             success: function (response) {
            //                 if (response.result === true) {
            //                     paymentResponse.complete('success').then(() => {
            //                         window.location.href = w3cPaymentRequest.urls.success;
            //                     });
            //                 } else {
            //                     paymentResponse.complete('fail');
            //                 }
            //             }
            //         });
            //     } else {
            //         console.log(err.toString());
            //         console.log(nonce);
            //         paymentResponse.complete('fail');
            //     }
            // });
        },

        /**
         *
         * @param paymentDetails
         * @param publicApiToken
         * @returns {boolean|{payment_data: {payload: *}, gateway: string}}
         */
        getEncryptedData: function (paymentDetails, publicApiToken) {
            var cardNumber = multisafepayUtils.prepareCardNumber(paymentDetails.cardNumber),
                cardholderName = paymentDetails.cardholderName,
                cardDate = paymentDetails.expiryYear.substr(2, 2) + paymentDetails.expiryMonth,
                cardSecurityCode = paymentDetails.cardSecurityCode,
                encrypt = multisafepayUtils.prepareApiToken(publicApiToken),
                gatewayCode = 'CREDITCARD',
                payloadData = false;

            if (!cardNumber || !cardholderName || !cardDate || !cardSecurityCode || !encrypt) {
                return false;
            }

            payloadData = JSON.stringify({
                gateway: gatewayCode,
                customer: {
                    browser: multisafepayUtils.getBrowserInfo()
                },
                fields: {
                    'extvar1': multisafepayUtils.encryptData(cardNumber, encrypt),
                    'extvar2': multisafepayUtils.encryptData(cardholderName, encrypt),
                    'extvar3': multisafepayUtils.encryptData(cardDate, encrypt),
                    'extvar4': multisafepayUtils.encryptData(cardSecurityCode, encrypt)
                },
                encrypted: true
            });

            return  {
                gateway: gatewayCode,
                payment_data: {
                    payload: multisafepayUtils.base64Encode(payloadData)
                }
            }
        },
    };
});
