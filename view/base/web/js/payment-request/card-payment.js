define([
    'multisafepayPaymentComponent',
    'mage/translate',
    'jquery'
], function (multisafepayPaymentComponent, $t, $) {
    'use strict';

    return {
        process: function (paymentRequest, paymentResponse, paymentCode, paymentRequestData) {
            var details = paymentResponse.details,
                paymentData = paymentRequestData.cardsConfig[paymentCode],
                publicApiToken = paymentRequestData.apiToken;

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

            var extvar1 = details.cardNumber,
                extvar2 = details.cardholderName,
                extvar3 = details.expiryYear.substr(2, 2) + details.expiryMonth,
                extvar4 = details.cardSecurityCode;

            paymentData.fields[fieldKey] = encrypt ? Utils.setEncryption(value, Globals.getSetting('encrypt')) : value;
            paymentResponse.complete('fail');


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
         * @param publicApiToken
         * @returns {*}
         */
        prepareApiToken: function (publicApiToken) {
            var splittedApiToken = publicApiToken.split('.');

            return splittedApiToken[splittedApiToken.length - 1]
        },

        /**
         *
         * @param publicApiToken
         * @returns {*}
         */
        prepareCardNumber: function (publicApiToken) {
            var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
            var matches = v.match(/\d{4,16}/g);
            var match = matches && matches[0] || '';
            var parts = [];
            var i = 0, len = 0;

            for (i = 0, len = match.length; i < len; i += 4) {
                parts.push(match.substring(i, i + 4))
            }
            if (parts.length) {
                return parts.join(' ')
            } else {
                return value
            }
        }
    };
});
