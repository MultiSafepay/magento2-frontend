/*!
 * multisafepay-connect-components v1.0.0
 * (c) 2021  MultiSafepay
 * Released under the MIT License.
 * https://www.multisafepay.com
 *
 */
/******/ (function(modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/ 	var installedModules = {};
    /******/
    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {
        /******/
        /******/ 		// Check if module is in cache
        /******/ 		if(installedModules[moduleId]) {
            /******/ 			return installedModules[moduleId].exports;
            /******/ 		}
        /******/ 		// Create a new module (and put it into the cache)
        /******/ 		var module = installedModules[moduleId] = {
            /******/ 			i: moduleId,
            /******/ 			l: false,
            /******/ 			exports: {}
            /******/ 		};
        /******/
        /******/ 		// Execute the module function
        /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ 		// Flag the module as loaded
        /******/ 		module.l = true;
        /******/
        /******/ 		// Return the exports of the module
        /******/ 		return module.exports;
        /******/ 	}
    /******/
    /******/
    /******/ 	// expose the modules object (__webpack_modules__)
    /******/ 	__webpack_require__.m = modules;
    /******/
    /******/ 	// expose the module cache
    /******/ 	__webpack_require__.c = installedModules;
    /******/
    /******/ 	// define getter function for harmony exports
    /******/ 	__webpack_require__.d = function(exports, name, getter) {
        /******/ 		if(!__webpack_require__.o(exports, name)) {
            /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
            /******/ 		}
        /******/ 	};
    /******/
    /******/ 	// define __esModule on exports
    /******/ 	__webpack_require__.r = function(exports) {
        /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
            /******/ 		}
        /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
        /******/ 	};
    /******/
    /******/ 	// create a fake namespace object
    /******/ 	// mode & 1: value is a module id, require it
    /******/ 	// mode & 2: merge all properties of value into the ns
    /******/ 	// mode & 4: return value when already ns object
    /******/ 	// mode & 8|1: behave like require
    /******/ 	__webpack_require__.t = function(value, mode) {
        /******/ 		if(mode & 1) value = __webpack_require__(value);
        /******/ 		if(mode & 8) return value;
        /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
        /******/ 		var ns = Object.create(null);
        /******/ 		__webpack_require__.r(ns);
        /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
        /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
        /******/ 		return ns;
        /******/ 	};
    /******/
    /******/ 	// getDefaultExport function for compatibility with non-harmony modules
    /******/ 	__webpack_require__.n = function(module) {
        /******/ 		var getter = module && module.__esModule ?
            /******/ 			function getDefault() { return module['default']; } :
            /******/ 			function getModuleExports() { return module; };
        /******/ 		__webpack_require__.d(getter, 'a', getter);
        /******/ 		return getter;
        /******/ 	};
    /******/
    /******/ 	// Object.prototype.hasOwnProperty.call
    /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
    /******/
    /******/ 	// __webpack_public_path__
    /******/ 	__webpack_require__.p = "";
    /******/
    /******/
    /******/ 	// Load entry module and return exports
    /******/ 	return __webpack_require__(__webpack_require__.s = "./src/bootstrap.tsx");
    /******/ })
    /************************************************************************/
    /******/ ({

        /***/ "./node_modules/credit-card-type/index.js":
        /*!************************************************!*\
  !*** ./node_modules/credit-card-type/index.js ***!
  \************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            var types = __webpack_require__(/*! ./lib/card-types */ "./node_modules/credit-card-type/lib/card-types.js");
            var clone = __webpack_require__(/*! ./lib/clone */ "./node_modules/credit-card-type/lib/clone.js");
            var findBestMatch = __webpack_require__(/*! ./lib/find-best-match */ "./node_modules/credit-card-type/lib/find-best-match.js");
            var isValidInputType = __webpack_require__(/*! ./lib/is-valid-input-type */ "./node_modules/credit-card-type/lib/is-valid-input-type.js");
            var addMatchingCardsToResults = __webpack_require__(/*! ./lib/add-matching-cards-to-results */ "./node_modules/credit-card-type/lib/add-matching-cards-to-results.js");

            var testOrder;
            var customCards = {};

            var cardNames = {
                VISA: 'visa',
                MASTERCARD: 'mastercard',
                AMERICAN_EXPRESS: 'american-express',
                DINERS_CLUB: 'diners-club',
                DISCOVER: 'discover',
                JCB: 'jcb',
                UNIONPAY: 'unionpay',
                MAESTRO: 'maestro',
                ELO: 'elo',
                MIR: 'mir',
                HIPER: 'hiper',
                HIPERCARD: 'hipercard'
            };

            var ORIGINAL_TEST_ORDER = [
                cardNames.VISA,
                cardNames.MASTERCARD,
                cardNames.AMERICAN_EXPRESS,
                cardNames.DINERS_CLUB,
                cardNames.DISCOVER,
                cardNames.JCB,
                cardNames.UNIONPAY,
                cardNames.MAESTRO,
                cardNames.ELO,
                cardNames.MIR,
                cardNames.HIPER,
                cardNames.HIPERCARD
            ];

            testOrder = clone(ORIGINAL_TEST_ORDER);

            function findType(type) {
                return customCards[type] || types[type];
            }

            function getAllCardTypes() {
                return testOrder.map(function (type) {
                    return clone(findType(type));
                });
            }

            function getCardPosition(name, ignoreErrorForNotExisting) {
                var position = testOrder.indexOf(name);

                if (!ignoreErrorForNotExisting && position === -1) {
                    throw new Error('"' + name + '" is not a supported card type.');
                }

                return position;
            }

            function creditCardType(cardNumber) {
                var bestMatch;
                var results = [];

                if (!isValidInputType(cardNumber)) {
                    return [];
                }

                if (cardNumber.length === 0) {
                    return getAllCardTypes(testOrder);
                }

                testOrder.forEach(function (type) {
                    var cardConfiguration = findType(type);

                    addMatchingCardsToResults(cardNumber, cardConfiguration, results);
                });

                bestMatch = findBestMatch(results);

                if (bestMatch) {
                    return [bestMatch];
                }

                return results;
            }

            creditCardType.getTypeInfo = function (type) {
                return clone(findType(type));
            };

            creditCardType.removeCard = function (name) {
                var position = getCardPosition(name);

                testOrder.splice(position, 1);
            };

            creditCardType.addCard = function (config) {
                var existingCardPosition = getCardPosition(config.type, true);

                customCards[config.type] = config;

                if (existingCardPosition === -1) {
                    testOrder.push(config.type);
                }
            };

            creditCardType.updateCard = function (cardType, updates) {
                var clonedCard;
                var originalObject = customCards[cardType] || types[cardType];

                if (!originalObject) {
                    throw new Error('"' + cardType + '" is not a recognized type. Use `addCard` instead.');
                }

                if (updates.type && originalObject.type !== updates.type) {
                    throw new Error('Cannot overwrite type parameter.');
                }

                clonedCard = clone(originalObject, true);

                Object.keys(clonedCard).forEach(function (key) {
                    if (updates[key]) {
                        clonedCard[key] = updates[key];
                    }
                });

                customCards[clonedCard.type] = clonedCard;
            };

            creditCardType.changeOrder = function (name, position) {
                var currentPosition = getCardPosition(name);

                testOrder.splice(currentPosition, 1);
                testOrder.splice(position, 0, name);
            };

            creditCardType.resetModifications = function () {
                testOrder = clone(ORIGINAL_TEST_ORDER);
                customCards = {};
            };

            creditCardType.types = cardNames;

            module.exports = creditCardType;


            /***/ }),

        /***/ "./node_modules/credit-card-type/lib/add-matching-cards-to-results.js":
        /*!****************************************************************************!*\
  !*** ./node_modules/credit-card-type/lib/add-matching-cards-to-results.js ***!
  \****************************************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            var clone = __webpack_require__(/*! ./clone */ "./node_modules/credit-card-type/lib/clone.js");
            var matches = __webpack_require__(/*! ./matches */ "./node_modules/credit-card-type/lib/matches.js");

            function addMatchingCardsToResults(cardNumber, cardConfiguration, results) {
                var i, pattern, patternLength, clonedCardConfiguration;

                for (i = 0; i < cardConfiguration.patterns.length; i++) {
                    pattern = cardConfiguration.patterns[i];

                    if (!matches(cardNumber, pattern)) {
                        continue;
                    }

                    clonedCardConfiguration = clone(cardConfiguration);

                    if (Array.isArray(pattern)) {
                        patternLength = String(pattern[0]).length;
                    } else {
                        patternLength = String(pattern).length;
                    }

                    if (cardNumber.length >= patternLength) {
                        clonedCardConfiguration.matchStrength = patternLength;
                    }

                    results.push(clonedCardConfiguration);
                    break;
                }
            }

            module.exports = addMatchingCardsToResults;


            /***/ }),

        /***/ "./node_modules/credit-card-type/lib/card-types.js":
        /*!*********************************************************!*\
  !*** ./node_modules/credit-card-type/lib/card-types.js ***!
  \*********************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            var cardTypes = {
                visa: {
                    niceType: 'Visa',
                    type: 'visa',
                    patterns: [
                        4
                    ],
                    gaps: [4, 8, 12],
                    lengths: [16, 18, 19],
                    code: {
                        name: 'CVV',
                        size: 3
                    }
                },
                mastercard: {
                    niceType: 'Mastercard',
                    type: 'mastercard',
                    patterns: [
                        [51, 55],
                        [2221, 2229],
                        [223, 229],
                        [23, 26],
                        [270, 271],
                        2720
                    ],
                    gaps: [4, 8, 12],
                    lengths: [16],
                    code: {
                        name: 'CVC',
                        size: 3
                    }
                },
                'american-express': {
                    niceType: 'American Express',
                    type: 'american-express',
                    patterns: [
                        34,
                        37
                    ],
                    gaps: [4, 10],
                    lengths: [15],
                    code: {
                        name: 'CID',
                        size: 4
                    }
                },
                'diners-club': {
                    niceType: 'Diners Club',
                    type: 'diners-club',
                    patterns: [
                        [300, 305],
                        36,
                        38,
                        39
                    ],
                    gaps: [4, 10],
                    lengths: [14, 16, 19],
                    code: {
                        name: 'CVV',
                        size: 3
                    }
                },
                discover: {
                    niceType: 'Discover',
                    type: 'discover',
                    patterns: [
                        6011,
                        [644, 649],
                        65
                    ],
                    gaps: [4, 8, 12],
                    lengths: [16, 19],
                    code: {
                        name: 'CID',
                        size: 3
                    }
                },
                jcb: {
                    niceType: 'JCB',
                    type: 'jcb',
                    patterns: [
                        2131,
                        1800,
                        [3528, 3589]
                    ],
                    gaps: [4, 8, 12],
                    lengths: [16, 17, 18, 19],
                    code: {
                        name: 'CVV',
                        size: 3
                    }
                },
                unionpay: {
                    niceType: 'UnionPay',
                    type: 'unionpay',
                    patterns: [
                        620,
                        [624, 626],
                        [62100, 62182],
                        [62184, 62187],
                        [62185, 62197],
                        [62200, 62205],
                        [622010, 622999],
                        622018,
                        [622019, 622999],
                        [62207, 62209],
                        [622126, 622925],
                        [623, 626],
                        6270,
                        6272,
                        6276,
                        [627700, 627779],
                        [627781, 627799],
                        [6282, 6289],
                        6291,
                        6292,
                        810,
                        [8110, 8131],
                        [8132, 8151],
                        [8152, 8163],
                        [8164, 8171]
                    ],
                    gaps: [4, 8, 12],
                    lengths: [14, 15, 16, 17, 18, 19],
                    code: {
                        name: 'CVN',
                        size: 3
                    }
                },
                maestro: {
                    niceType: 'Maestro',
                    type: 'maestro',
                    patterns: [
                        493698,
                        [500000, 506698],
                        [506779, 508999],
                        [56, 59],
                        63,
                        67,
                        6
                    ],
                    gaps: [4, 8, 12],
                    lengths: [12, 13, 14, 15, 16, 17, 18, 19],
                    code: {
                        name: 'CVC',
                        size: 3
                    }
                },
                elo: {
                    niceType: 'Elo',
                    type: 'elo',
                    patterns: [
                        401178,
                        401179,
                        438935,
                        457631,
                        457632,
                        431274,
                        451416,
                        457393,
                        504175,
                        [506699, 506778],
                        [509000, 509999],
                        627780,
                        636297,
                        636368,
                        [650031, 650033],
                        [650035, 650051],
                        [650405, 650439],
                        [650485, 650538],
                        [650541, 650598],
                        [650700, 650718],
                        [650720, 650727],
                        [650901, 650978],
                        [651652, 651679],
                        [655000, 655019],
                        [655021, 655058]
                    ],
                    gaps: [4, 8, 12],
                    lengths: [16],
                    code: {
                        name: 'CVE',
                        size: 3
                    }
                },
                mir: {
                    niceType: 'Mir',
                    type: 'mir',
                    patterns: [
                        [2200, 2204]
                    ],
                    gaps: [4, 8, 12],
                    lengths: [16, 17, 18, 19],
                    code: {
                        name: 'CVP2',
                        size: 3
                    }
                },
                hiper: {
                    niceType: 'Hiper',
                    type: 'hiper',
                    patterns: [
                        637095,
                        637568,
                        637599,
                        637609,
                        637612
                    ],
                    gaps: [4, 8, 12],
                    lengths: [16],
                    code: {
                        name: 'CVC',
                        size: 3
                    }
                },
                hipercard: {
                    niceType: 'Hipercard',
                    type: 'hipercard',
                    patterns: [
                        606282
                    ],
                    gaps: [4, 8, 12],
                    lengths: [16],
                    code: {
                        name: 'CVC',
                        size: 3
                    }
                }
            };

            module.exports = cardTypes;


            /***/ }),

        /***/ "./node_modules/credit-card-type/lib/clone.js":
        /*!****************************************************!*\
  !*** ./node_modules/credit-card-type/lib/clone.js ***!
  \****************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            function clone(originalObject) {
                var dupe;

                if (!originalObject) { return null; }

                dupe = JSON.parse(JSON.stringify(originalObject));

                return dupe;
            }

            module.exports = clone;


            /***/ }),

        /***/ "./node_modules/credit-card-type/lib/find-best-match.js":
        /*!**************************************************************!*\
  !*** ./node_modules/credit-card-type/lib/find-best-match.js ***!
  \**************************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            function hasEnoughResultsToDetermineBestMatch(results) {
                var numberOfResultsWithMaxStrengthProperty = results.filter(function (result) {
                    return result.matchStrength;
                }).length;

                // if all possible results have a maxStrength property
                // that means the card number is sufficiently long
                // enough to determine conclusively what the type is
                return numberOfResultsWithMaxStrengthProperty > 0 &&
                    numberOfResultsWithMaxStrengthProperty === results.length;
            }

            function findBestMatch(results) {
                if (!hasEnoughResultsToDetermineBestMatch(results)) {
                    return;
                }

                return results.reduce(function (bestMatch, result) { // eslint-disable-line consistent-return
                    if (!bestMatch) {
                        return result;
                    }

                    // if the current best match pattern is less specific
                    // than this result, set the result as the new best match
                    if (bestMatch.matchStrength < result.matchStrength) {
                        return result;
                    }

                    return bestMatch;
                });
            }

            module.exports = findBestMatch;


            /***/ }),

        /***/ "./node_modules/credit-card-type/lib/is-valid-input-type.js":
        /*!******************************************************************!*\
  !*** ./node_modules/credit-card-type/lib/is-valid-input-type.js ***!
  \******************************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            function isValidInputType(cardNumber) {
                return typeof cardNumber === 'string' || cardNumber instanceof String;
            }

            module.exports = isValidInputType;


            /***/ }),

        /***/ "./node_modules/credit-card-type/lib/matches.js":
        /*!******************************************************!*\
  !*** ./node_modules/credit-card-type/lib/matches.js ***!
  \******************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


// Adapted from https://github.com/polvo-labs/card-type/blob/aaab11f80fa1939bccc8f24905a06ae3cd864356/src/cardType.js#L37-L42
            function matchesRange(cardNumber, min, max) {
                var maxLengthToCheck = String(min).length;
                var substr = cardNumber.substr(0, maxLengthToCheck);
                var integerRepresentationOfCardNumber = parseInt(substr, 10);

                min = parseInt(String(min).substr(0, substr.length), 10);
                max = parseInt(String(max).substr(0, substr.length), 10);

                return integerRepresentationOfCardNumber >= min && integerRepresentationOfCardNumber <= max;
            }

            function matchesPattern(cardNumber, pattern) {
                pattern = String(pattern);

                return pattern.substring(0, cardNumber.length) === cardNumber.substring(0, pattern.length);
            }

            function matches(cardNumber, pattern) {
                if (Array.isArray(pattern)) {
                    return matchesRange(cardNumber, pattern[0], pattern[1]);
                }

                return matchesPattern(cardNumber, pattern);
            }

            module.exports = matches;


            /***/ }),

        /***/ "./node_modules/dlv/dist/dlv.umd.js":
        /*!******************************************!*\
  !*** ./node_modules/dlv/dist/dlv.umd.js ***!
  \******************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            !function(t,n){ true?module.exports=function(t,n,e,i,o){for(n=n.split?n.split("."):n,i=0;i<n.length;i++)t=t?t[n[i]]:o;return t===o?e:t}:undefined}(this);
//# sourceMappingURL=dlv.umd.js.map


            /***/ }),

        /***/ "./node_modules/events/events.js":
        /*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



            var R = typeof Reflect === 'object' ? Reflect : null
            var ReflectApply = R && typeof R.apply === 'function'
                ? R.apply
                : function ReflectApply(target, receiver, args) {
                    return Function.prototype.apply.call(target, receiver, args);
                }

            var ReflectOwnKeys
            if (R && typeof R.ownKeys === 'function') {
                ReflectOwnKeys = R.ownKeys
            } else if (Object.getOwnPropertySymbols) {
                ReflectOwnKeys = function ReflectOwnKeys(target) {
                    return Object.getOwnPropertyNames(target)
                        .concat(Object.getOwnPropertySymbols(target));
                };
            } else {
                ReflectOwnKeys = function ReflectOwnKeys(target) {
                    return Object.getOwnPropertyNames(target);
                };
            }

            function ProcessEmitWarning(warning) {
                if (console && console.warn) console.warn(warning);
            }

            var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
                return value !== value;
            }

            function EventEmitter() {
                EventEmitter.init.call(this);
            }
            module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
            EventEmitter.EventEmitter = EventEmitter;

            EventEmitter.prototype._events = undefined;
            EventEmitter.prototype._eventsCount = 0;
            EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
            var defaultMaxListeners = 10;

            function checkListener(listener) {
                if (typeof listener !== 'function') {
                    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
                }
            }

            Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
                enumerable: true,
                get: function() {
                    return defaultMaxListeners;
                },
                set: function(arg) {
                    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
                        throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
                    }
                    defaultMaxListeners = arg;
                }
            });

            EventEmitter.init = function() {

                if (this._events === undefined ||
                    this._events === Object.getPrototypeOf(this)._events) {
                    this._events = Object.create(null);
                    this._eventsCount = 0;
                }

                this._maxListeners = this._maxListeners || undefined;
            };

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
            EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
                if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
                    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
                }
                this._maxListeners = n;
                return this;
            };

            function _getMaxListeners(that) {
                if (that._maxListeners === undefined)
                    return EventEmitter.defaultMaxListeners;
                return that._maxListeners;
            }

            EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
                return _getMaxListeners(this);
            };

            EventEmitter.prototype.emit = function emit(type) {
                var args = [];
                for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
                var doError = (type === 'error');

                var events = this._events;
                if (events !== undefined)
                    doError = (doError && events.error === undefined);
                else if (!doError)
                    return false;

                // If there is no 'error' event listener then throw.
                if (doError) {
                    var er;
                    if (args.length > 0)
                        er = args[0];
                    if (er instanceof Error) {
                        // Note: The comments on the `throw` lines are intentional, they show
                        // up in Node's output if this results in an unhandled exception.
                        throw er; // Unhandled 'error' event
                    }
                    // At least give some kind of context to the user
                    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
                    err.context = er;
                    throw err; // Unhandled 'error' event
                }

                var handler = events[type];

                if (handler === undefined)
                    return false;

                if (typeof handler === 'function') {
                    ReflectApply(handler, this, args);
                } else {
                    var len = handler.length;
                    var listeners = arrayClone(handler, len);
                    for (var i = 0; i < len; ++i)
                        ReflectApply(listeners[i], this, args);
                }

                return true;
            };

            function _addListener(target, type, listener, prepend) {
                var m;
                var events;
                var existing;

                checkListener(listener);

                events = target._events;
                if (events === undefined) {
                    events = target._events = Object.create(null);
                    target._eventsCount = 0;
                } else {
                    // To avoid recursion in the case that type === "newListener"! Before
                    // adding it to the listeners, first emit "newListener".
                    if (events.newListener !== undefined) {
                        target.emit('newListener', type,
                            listener.listener ? listener.listener : listener);

                        // Re-assign `events` because a newListener handler could have caused the
                        // this._events to be assigned to a new object
                        events = target._events;
                    }
                    existing = events[type];
                }

                if (existing === undefined) {
                    // Optimize the case of one listener. Don't need the extra array object.
                    existing = events[type] = listener;
                    ++target._eventsCount;
                } else {
                    if (typeof existing === 'function') {
                        // Adding the second element, need to change to array.
                        existing = events[type] =
                            prepend ? [listener, existing] : [existing, listener];
                        // If we've already got an array, just append.
                    } else if (prepend) {
                        existing.unshift(listener);
                    } else {
                        existing.push(listener);
                    }

                    // Check for listener leak
                    m = _getMaxListeners(target);
                    if (m > 0 && existing.length > m && !existing.warned) {
                        existing.warned = true;
                        // No error code for this since it is a Warning
                        // eslint-disable-next-line no-restricted-syntax
                        var w = new Error('Possible EventEmitter memory leak detected. ' +
                            existing.length + ' ' + String(type) + ' listeners ' +
                            'added. Use emitter.setMaxListeners() to ' +
                            'increase limit');
                        w.name = 'MaxListenersExceededWarning';
                        w.emitter = target;
                        w.type = type;
                        w.count = existing.length;
                        ProcessEmitWarning(w);
                    }
                }

                return target;
            }

            EventEmitter.prototype.addListener = function addListener(type, listener) {
                return _addListener(this, type, listener, false);
            };

            EventEmitter.prototype.on = EventEmitter.prototype.addListener;

            EventEmitter.prototype.prependListener =
                function prependListener(type, listener) {
                    return _addListener(this, type, listener, true);
                };

            function onceWrapper() {
                if (!this.fired) {
                    this.target.removeListener(this.type, this.wrapFn);
                    this.fired = true;
                    if (arguments.length === 0)
                        return this.listener.call(this.target);
                    return this.listener.apply(this.target, arguments);
                }
            }

            function _onceWrap(target, type, listener) {
                var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
                var wrapped = onceWrapper.bind(state);
                wrapped.listener = listener;
                state.wrapFn = wrapped;
                return wrapped;
            }

            EventEmitter.prototype.once = function once(type, listener) {
                checkListener(listener);
                this.on(type, _onceWrap(this, type, listener));
                return this;
            };

            EventEmitter.prototype.prependOnceListener =
                function prependOnceListener(type, listener) {
                    checkListener(listener);
                    this.prependListener(type, _onceWrap(this, type, listener));
                    return this;
                };

// Emits a 'removeListener' event if and only if the listener was removed.
            EventEmitter.prototype.removeListener =
                function removeListener(type, listener) {
                    var list, events, position, i, originalListener;

                    checkListener(listener);

                    events = this._events;
                    if (events === undefined)
                        return this;

                    list = events[type];
                    if (list === undefined)
                        return this;

                    if (list === listener || list.listener === listener) {
                        if (--this._eventsCount === 0)
                            this._events = Object.create(null);
                        else {
                            delete events[type];
                            if (events.removeListener)
                                this.emit('removeListener', type, list.listener || listener);
                        }
                    } else if (typeof list !== 'function') {
                        position = -1;

                        for (i = list.length - 1; i >= 0; i--) {
                            if (list[i] === listener || list[i].listener === listener) {
                                originalListener = list[i].listener;
                                position = i;
                                break;
                            }
                        }

                        if (position < 0)
                            return this;

                        if (position === 0)
                            list.shift();
                        else {
                            spliceOne(list, position);
                        }

                        if (list.length === 1)
                            events[type] = list[0];

                        if (events.removeListener !== undefined)
                            this.emit('removeListener', type, originalListener || listener);
                    }

                    return this;
                };

            EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

            EventEmitter.prototype.removeAllListeners =
                function removeAllListeners(type) {
                    var listeners, events, i;

                    events = this._events;
                    if (events === undefined)
                        return this;

                    // not listening for removeListener, no need to emit
                    if (events.removeListener === undefined) {
                        if (arguments.length === 0) {
                            this._events = Object.create(null);
                            this._eventsCount = 0;
                        } else if (events[type] !== undefined) {
                            if (--this._eventsCount === 0)
                                this._events = Object.create(null);
                            else
                                delete events[type];
                        }
                        return this;
                    }

                    // emit removeListener for all listeners on all events
                    if (arguments.length === 0) {
                        var keys = Object.keys(events);
                        var key;
                        for (i = 0; i < keys.length; ++i) {
                            key = keys[i];
                            if (key === 'removeListener') continue;
                            this.removeAllListeners(key);
                        }
                        this.removeAllListeners('removeListener');
                        this._events = Object.create(null);
                        this._eventsCount = 0;
                        return this;
                    }

                    listeners = events[type];

                    if (typeof listeners === 'function') {
                        this.removeListener(type, listeners);
                    } else if (listeners !== undefined) {
                        // LIFO order
                        for (i = listeners.length - 1; i >= 0; i--) {
                            this.removeListener(type, listeners[i]);
                        }
                    }

                    return this;
                };

            function _listeners(target, type, unwrap) {
                var events = target._events;

                if (events === undefined)
                    return [];

                var evlistener = events[type];
                if (evlistener === undefined)
                    return [];

                if (typeof evlistener === 'function')
                    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

                return unwrap ?
                    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
            }

            EventEmitter.prototype.listeners = function listeners(type) {
                return _listeners(this, type, true);
            };

            EventEmitter.prototype.rawListeners = function rawListeners(type) {
                return _listeners(this, type, false);
            };

            EventEmitter.listenerCount = function(emitter, type) {
                if (typeof emitter.listenerCount === 'function') {
                    return emitter.listenerCount(type);
                } else {
                    return listenerCount.call(emitter, type);
                }
            };

            EventEmitter.prototype.listenerCount = listenerCount;
            function listenerCount(type) {
                var events = this._events;

                if (events !== undefined) {
                    var evlistener = events[type];

                    if (typeof evlistener === 'function') {
                        return 1;
                    } else if (evlistener !== undefined) {
                        return evlistener.length;
                    }
                }

                return 0;
            }

            EventEmitter.prototype.eventNames = function eventNames() {
                return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
            };

            function arrayClone(arr, n) {
                var copy = new Array(n);
                for (var i = 0; i < n; ++i)
                    copy[i] = arr[i];
                return copy;
            }

            function spliceOne(list, index) {
                for (; index + 1 < list.length; index++)
                    list[index] = list[index + 1];
                list.pop();
            }

            function unwrapListeners(arr) {
                var ret = new Array(arr.length);
                for (var i = 0; i < ret.length; ++i) {
                    ret[i] = arr[i].listener || arr[i];
                }
                return ret;
            }


            /***/ }),

        /***/ "./node_modules/preact-i18n/dist/preact-i18n.esm.js":
        /*!**********************************************************!*\
  !*** ./node_modules/preact-i18n/dist/preact-i18n.esm.js ***!
  \**********************************************************/
        /*! exports provided: default, IntlProvider, Localizer, MarkupText, Text, intl, withText */
        /***/ (function(module, __webpack_exports__, __webpack_require__) {

            "use strict";
            __webpack_require__.r(__webpack_exports__);
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IntlProvider", function() { return IntlProvider; });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Localizer", function() { return Localizer; });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MarkupText", function() { return MarkupText; });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Text", function() { return Text; });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "intl", function() { return intl; });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withText", function() { return withText; });
            /* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
            /* harmony import */ var dlv__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dlv */ "./node_modules/dlv/dist/dlv.umd.js");
            /* harmony import */ var dlv__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(dlv__WEBPACK_IMPORTED_MODULE_1__);



            /** Check if an object is not null or undefined
             *	@private
             */
            function defined(obj) {
                return obj!==null && obj!==undefined;
            }


            /** A simpler Object.assign
             *  @private
             */
            function assign(obj, props) {
                for (var i in props) {
                    obj[i] = props[i];
                }
                return obj;
            }


            /** Recursively copy keys from `source` to `target`, skipping truthy values already in `target`.
             *	@private
             */
            function deepAssign(target, source) {
                var out = assign({}, target);
                for (var i in source) {
                    if (source.hasOwnProperty(i)) {
                        if (target[i] && source[i] && typeof target[i]==='object' && typeof source[i]==='object') {
                            out[i] = deepAssign(target[i], source[i]);
                        }
                        else {
                            out[i] = target[i] || source[i];
                        }
                    }
                }
                return out;
            }

            /** select('foo,bar') creates a mapping: `{ foo, bar }`
             *	@private
             */
            function select(properties) {
                properties = properties || {};
                if (typeof properties==='string') {
                    properties = properties.split(',');
                }
                if ('join' in properties) {
                    var selected = {};
                    for (var i=0; i<properties.length; i++) {
                        var val = properties[i].trim();
                        if (val) { selected[val.split('.').pop()] = val; }
                    }
                    return selected;
                }
                return properties;
            }

            var URL_FLAG = /[?&#]intl=show/;


            /** `<IntlProvider>` is a nestable internationalization definition provider.
             *	It exposes an Intl scope & definition into the tree,
             *	making them available to descendant components.
             *
             *	> **Note:** When nested, gives precedence to keys higher up the tree!
             *	> This means lower-level components can set their defaults by wrapping themselves
             *	> in an `<IntlProvider>`, but still remain localizable by their parent components.
             *
             *	@name IntlProvider
             *	@param props
             *	@param {String} [props.scope]			Nest `definition` under a root key, and set the active scope for the tree (essentially prefixing all `<Text />` keys).
             *	@param {Boolean} [props.mark=false]		If `true`, all `<Text>` elements will be shown with a red/green background indicating whether they have valid Intl keys.
             *	@param {Object} [props.definition={}]	Merge the given definition into the current intl definition, giving the *current* definition precedence (i.e., only adding keys, acting as defaults)
             *
             *	@example
             *	// generally imported from a JSON file:
             *	let definition = {
             *		foo: 'Le Feux'
             *	};
             *
             *	<IntlProvider scope="weather" definition={definition}>
             *		<Text key="foo">The Foo</Text>
             *	</IntlProvider>
             *
             *	// This will render the text:
             *	"Le Feux"
             */
            var IntlProvider = /*@__PURE__*/(function (Component) {
                function IntlProvider () {
                    Component.apply(this, arguments);
                }

                if ( Component ) IntlProvider.__proto__ = Component;
                IntlProvider.prototype = Object.create( Component && Component.prototype );
                IntlProvider.prototype.constructor = IntlProvider;

                IntlProvider.prototype.getChildContext = function getChildContext () {
                    var ref = this.props;
                    var scope = ref.scope;
                    var definition = ref.definition;
                    var mark = ref.mark;
                    var intl = assign({}, this.context.intl || {});

                    // set active scope for the tree if given
                    if (scope) { intl.scope = scope; }

                    // merge definition into current with lower precedence
                    if (definition) {
                        intl.dictionary = deepAssign(intl.dictionary || {}, definition);
                    }

                    if (mark || (typeof location!=='undefined' && String(location).match(URL_FLAG))) {
                        intl.mark = true;
                    }

                    return { intl: intl };
                };

                IntlProvider.prototype.render = function render (ref) {
                    var children = ref.children;

                    return children;
                };

                return IntlProvider;
            }(preact__WEBPACK_IMPORTED_MODULE_0__["Component"]));

            /**
             * Higher-order function that creates an `<IntlProvider />` wrapper component for the given component.  It
             * takes two forms depending on how many arguments it's given:
             * It can take a functional form like:
             * intl(ComponentToWrap, options)
             *
             * or it can take an annotation form like:
             * @intl(options)
             * class ComponentToWrap extends Component {}
             *
             *	@param {Component or Object} args[0] If there are two arguments, the first argument is the Component to wrap in `<IntlProvider/>`. If there is just one argument, this is the options object to pass as `props` to `<IntlProvider/>`. See the definition of the options param below for details.
             *	@param {Object} options If there are two arguments, the second argument is Passed as `props` to `<IntlProvider />`
             *	@param [options.scope]			Nest `definition` under a root key, and set the active scope for the tree (essentially prefixing all `<Text />` keys).
             *	@param [options.definition={}]	Merge the given definition into the current intl definition, giving the *current* definition precedence (i.e., only adding keys, acting as defaults)
             */
            function intl(Child, options) {
                if (arguments.length<2) {
                    options = Child;
                    return function (Child) { return intl(Child, options); };
                }
                function IntlProviderWrapper(props) {
                    return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(
                        IntlProvider,
                        options || {},
                        Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(Child, props)
                    );
                }

                IntlProviderWrapper.getWrappedComponent = Child && Child.getWrappedComponent || (function () { return Child; });
                return IntlProviderWrapper;
            }

            var EMPTY = {};

            var currentFields;

            /** Populate {{template.fields}} within a given string.
             *
             *	@private
             *	@param {String} template	The string containing fields to be resolved
             *	@param {Object} [fields={}]	Optionally nested object of fields, referencable from `template`.
             *	@example
             *		template('foo{{bar}}', { bar:'baz' }) === 'foobaz'
             */
            function template(template, fields) {
                currentFields = fields || EMPTY;
                return template && template.replace(/\{\{([\w.-]+)\}\}/g, replacer);
            }

            /** Replacement callback for injecting fields into a String
             *	@private
             */
            function replacer(s, field) {
                var parts = field.split('.'),
                    v = currentFields;
                for (var i=0; i<parts.length; i++) {
                    v = v[parts[i]];
                    if (v == null) { return ''; } // eslint-disable-line eqeqeq
                }
                // allow for recursive {{config.xx}} references:
                if (typeof v==='string' && v.match(/\{\{/)) {
                    v = template(v, currentFields);
                }
                return v;
            }

            /** Attempts to look up a translated value from a given dictionary.
             *  Also supports json templating using the format: {{variable}}
             *	Falls back to default text.
             *
             *	@private
             *	@param {String} id				Intl field name/id (subject to scope)
             *	@param {String} [scope='']		Scope, which prefixes `id` with `${scope}.`
             *	@param {Object} dictionary		A nested object containing translations
             *	@param {Object} [fields={}]		Template fields for use by translated strings
             *	@param {Number} [plural]		Indicates a quantity, used to trigger pluralization
             *	@param {String|Array} [fallback]	Text to return if no translation is found
             *	@returns {String} translated
             */
            function translate(id, scope, dictionary, fields, plural, fallback) {
                if (scope) { id = scope + '.' + id; }

                var value = dictionary && dlv__WEBPACK_IMPORTED_MODULE_1___default()(dictionary, id);

                // plural forms:
                // key: ['plural', 'singular']
                // key: { none, one, many }
                // key: { singular, plural }
                if ((plural || plural===0) && value && typeof value==='object') {
                    if (value.splice) {
                        value = value[plural] || value[0];
                    }
                    else if (plural===0 && defined(value.none)) {
                        value = value.none;
                    }
                    else if (plural===1 && defined(value.one || value.singular)) {
                        value = value.one || value.singular;
                    }
                    else {
                        value = value.some || value.many || value.plural || value.other || value;
                    }
                }

                return value && template(value, fields) || fallback || null;
            }

            /** Highlight/colorize the i18n'd node if `mark` is set on `intl` in context.  If not, just returns `value`
             *
             *	@private
             *	@param {String|VNode} value	The l10n'd text/vnode to highlight or pass through
             *	@param {string} id	The key used to lookup the value in the intl dictionary
             */
            function HighlightI18N(ref, ref$1) {
                var value = ref.value;
                var id = ref.id;
                var intl = ref$1.intl;


                if (intl && intl.mark) {
                    var dictionaryKey = "dictionary" + (intl && intl.scope ? ("." + (intl.scope)) : '') + "." + id;
                    return (
                        Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])( 'mark', {
                                style: {
                                    background: value
                                        ? dlv__WEBPACK_IMPORTED_MODULE_1___default()(intl, dictionaryKey)
                                            ? 'rgba(119,231,117,.5)'
                                            : 'rgba(229,226,41,.5)'
                                        : 'rgba(228,147,51,.5)'
                                }, title: id },
                            value
                        )
                    );
                }

                return value;
            }

            /** `<Text>` renders internationalized text.
             *	It attempts to look up translated values from a dictionary in context.
             *
             *	Template strings can contain `{{field}}` placeholders,
             *	which injects values from the `fields` prop.
             *
             *	When string lookup fails, renders its children as fallback text.
             *
             *	@param {Object} props				props
             *	@param {String} props.id			Key to look up in intl dictionary, within any parent scopes (`$scope1.$scope2.$id`)
             *	@param {Object} [props.fields={}]	Values to inject into template `{{fields}}`
             *	@param {Number} [props.plural]		Integer "count", used to select plural forms
             *	@param {Object} context
             *	@param {Object} context.intl		[internal] dictionary and scope info
             *
             *	@example
             *	// If there is no dictionary in context..
             *	<Text id="foo">The Foo</Text>
             *	// ..produces the text:
             *	"The Foo"
             *
             *	@example
             *	// Given a dictionary and some fields..
             *	<IntlProvider definition={{ foo:'Le Feux {{bar}}' }}>
             *		<Text id="foo" fields={{ bar: 'BEAR' }}>The Foo</Text>
             *	</IntlProvider>
             *	// ..produces the text:
             *	"Le Feux BEAR"
             *
             *	@example
             *	// Within a scope, both `id` and the definition are namespaced..
             *	<IntlProvider scope="weather" definition={{ foo:'Le Feux' }}>
             *		<Text id="foo">The Foo</Text>
             *	</IntlProvider>
             *	// ..produces the text:
             *	"Le Feux"
             */
            function Text(ref, ref$1) {
                var id = ref.id;
                var fallback = ref.children;
                var plural = ref.plural;
                var fields = ref.fields;
                var intl = ref$1.intl;


                var value = translate(
                    id,
                    intl && intl.scope,
                    intl && intl.dictionary,
                    fields,
                    plural,
                    fallback
                );

                return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])( HighlightI18N, { id: id, value: value });
            }

            /** Translates the property values in an Object, returning a copy.
             *	**Note:** By default, `String` keys will be treated as Intl ID's.
             *	Pass `true` to return an Object containing *only* translated
             *	values where the prop is a <Text /> node.
             *
             *	@private
             *	@param {Object} props	An object with values to translate
             *	@param {Object} intl	An intl context object (eg: `context.intl`)
             *	@param {Boolean} [onlyTextNodes=false]	Only process `<Text />` values
             *	@returns {Object} translatedProps
             */
            function translateMapping(props, intl, onlyTextNodes) {
                var out = {};
                intl = intl || {};
                props = select(props);
                for (var name in props) {
                    if (props.hasOwnProperty(name) && props[name]) {
                        var def = props[name];

                        // if onlyTextNodes=true, skip any props that aren't <Text /> vnodes
                        if (!onlyTextNodes && typeof def==='string') {
                            out[name] = translate(def, intl.scope, intl.dictionary);
                        }
                        else if (def.type===Text) {
                            // it's a <Text />, just grab its props:
                            def = assign({
                                // use children as fallback content
                                fallback: def.props.children
                            }, def.props);
                            out[name] = translate(def.id, intl.scope, intl.dictionary, def.fields, def.plural, def.fallback);
                        }
                    }
                }
                return out;
            }

            /** `<Localizer />` is a Compositional Component.
             *	It "renders" out any `<Text />` values in its child's props.
             *
             *	@name Localizer
             *	@param {Object} props
             *	@param {Object} props.children	Child components with props to localize.
             *	@param {Object} context
             *	@param {Object} context.intl		[internal] dictionary and scope info
             *	@example
             *	<Localizer>
             *		<input placeholder={<Text id="username.placeholder" />} />
             *	</Localizer>
             *	// produces:
             *	<input placeholder="foo" />
             *
             *	@example
             *	<Localizer>
             *		<abbr title={<Text id="oss-title">Open Source Software</Text>}>
             *			<Text id="oss">OSS</Text>
             *		</abbr>
             *	</Localizer>
             *	// produces:
             *	<abbr title="Open Source Software">OSS</abbr>
             */
            function Localizer(ref, ref$1) {
                var children = ref.children;
                var intl = ref$1.intl;

                return children && children.length
                    ? children.map(function (child) { return Object(preact__WEBPACK_IMPORTED_MODULE_0__["cloneElement"])(child, translateMapping(child.props, intl, true)); })
                    : children && Object(preact__WEBPACK_IMPORTED_MODULE_0__["cloneElement"])(children, translateMapping(children.props, intl, true));
            }

            /* eslint-disable react/no-danger */

            /** `<MarkupText>` is just like {@link Text} but it can also contain html markup in rendered strings.  It wraps its contents in a `<span>` tag.
             *
             *	@param {Object} props				props
             *	@param {String} props.id			Key to look up in intl dictionary, within any parent scopes (`$scope1.$scope2.$id`)
             *	@param {Object} [props.fields={}]	Values to inject into template `{{fields}}`
             *	@param {Number} [props.plural]		Integer "count", used to select plural forms
             *	@param {Object} context
             *	@param {Object} context.intl		[internal] dictionary and scope info
             *
             *	@example
             *	// If there is no dictionary in context..
             *	<MarkupText id="foo"><b>The Foo</b></MarkupText>
             *	// ..produces the vnode:
             *	<span><b>The Foo</b></span>
             *
             *	@example
             *	// Given a dictionary and some fields..
             *	<IntlProvider definition={{ foo:'Le Feux <b>{{bar}}</b>' }}>
             *		<MarkupText id="foo" fields={{ bar: 'BEAR' }}>The Foo</MarkupText>
             *	</IntlProvider>
             *	// ..produces the vnode:
             *	<span>Le Feux <b>BEAR</b></span>
             *
             *	@example
             *	// Within a scope, both `id` and the definition are namespaced..
             *	<IntlProvider scope="weather" definition={{ foo:'Le <a href="http://foo.com">Feux</a>' }}>
             *		<MarkupText id="foo">The Foo</MarkupText>
             *	</IntlProvider>
             *	// ..produces the vnode:
             *	<span>Le <a href="http://foo.com">Feux</a></span>
             *
             *	@example
             *	// renders nothing if there is no key match and no fallback
             *	<div><MarkupText /></div>
             *	// ..produces the vnode:
             *	<div/>
             */
            function MarkupText(props) {
                return (
                    Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])( Localizer, null,
                        Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])( Html, { html: Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])( Text, props), id: props.id })
                    )
                );
            }

            function Html(ref) {
                var html = ref.html;
                var id = ref.id;

                var value = !html ? html : typeof html === 'string' ? Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])( 'span', { dangerouslySetInnerHTML: { __html: html } }) : Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])( 'span', null, html ) ;
                return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])( HighlightI18N, { id: id, value: value });
            }

            /** `@withText()` is a Higher Order Component, often used as a decorator.
             *
             *	It wraps a child component and passes it translations
             *	based on a mapping to the dictionary & scope in context.
             *
             *	@param {Object|Function|String} mapping		Maps prop names to intl keys (or `<Text>` nodes).
             *
             *	@example @withText({
             *		placeholder: 'user.placeholder'
             *	})
             *	class Foo {
             *		// now the `placeholder` prop is our localized String:
             *		render({ placeholder }) {
             *			return <input placeholder={placeholder} />
             *		}
             *	}
             *
             *	@example @withText({
             *		placeholder: <Text id="user.placeholder">fallback text</Text>
             *	})
             *	class Foo {
             *		render({ placeholder }) {
             *			return <input placeholder={placeholder} />
             *		}
             *	}
             *
             *	@example @withText('user.placeholder')
             *	class Foo {
             *		// for Strings/Arrays, the last path segment becomes the prop name:
             *		render({ placeholder }) {
             *			return <input placeholder={placeholder} />
             *		}
             *	}
             *
             *	@example <caption>Works with functional components, too</caption>
             *	const Foo = withText('user.placeholder')( props =>
             *		<input placeholder={props.placeholder} />
             *	)
             *
             * 	@example <caption>getWrappedComponent() returns wrapped child Component</caption>
             *	const Foo = () => <div/>;
             *	const WrappedFoo = withText('user.placeholer')(Foo);
             *	WrappedFoo.getWrappedComponent() === Foo; // true
             */
            function withText(mapping) {
                return function withTextWrapper(Child) {
                    function WithTextWrapper(props, context) {
                        var map = typeof mapping==='function' ? mapping(props, context) : mapping;
                        var translations = translateMapping(map, context.intl);
                        return Object(preact__WEBPACK_IMPORTED_MODULE_0__["h"])(Child, assign(assign({}, props), translations));
                    }

                    WithTextWrapper.getWrappedComponent = Child && Child.getWrappedComponent || (function () { return Child; });
                    return WithTextWrapper;
                };
            }

            intl.intl = intl;
            intl.IntlProvider = IntlProvider;
            intl.Text = Text;
            intl.MarkupText = MarkupText;
            intl.Localizer = Localizer;
            intl.withText = withText;

            /* harmony default export */ __webpack_exports__["default"] = (intl);

//# sourceMappingURL=preact-i18n.esm.js.map


            /***/ }),

        /***/ "./node_modules/preact/dist/preact.module.js":
        /*!***************************************************!*\
  !*** ./node_modules/preact/dist/preact.module.js ***!
  \***************************************************/
        /*! exports provided: render, hydrate, createElement, h, Fragment, createRef, isValidElement, Component, cloneElement, createContext, toChildArray, _unmount, options */
        /***/ (function(module, __webpack_exports__, __webpack_require__) {

            "use strict";
            __webpack_require__.r(__webpack_exports__);
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return I; });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hydrate", function() { return L; });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createElement", function() { return h; });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return h; });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Fragment", function() { return d; });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRef", function() { return p; });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isValidElement", function() { return l; });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Component", function() { return m; });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cloneElement", function() { return M; });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createContext", function() { return O; });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toChildArray", function() { return x; });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_unmount", function() { return D; });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "options", function() { return n; });
            var n,l,u,t,i,r,o,f={},e=[],c=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;function s(n,l){for(var u in l)n[u]=l[u];return n}function a(n){var l=n.parentNode;l&&l.removeChild(n)}function h(n,l,u){var t,i,r,o,f=arguments;if(l=s({},l),arguments.length>3)for(u=[u],t=3;t<arguments.length;t++)u.push(f[t]);if(null!=u&&(l.children=u),null!=n&&null!=n.defaultProps)for(i in n.defaultProps)void 0===l[i]&&(l[i]=n.defaultProps[i]);return o=l.key,null!=(r=l.ref)&&delete l.ref,null!=o&&delete l.key,v(n,l,o,r)}function v(l,u,t,i){var r={type:l,props:u,key:t,ref:i,__k:null,__p:null,__b:0,__e:null,l:null,__c:null,constructor:void 0};return n.vnode&&n.vnode(r),r}function p(){return{}}function d(n){return n.children}function y(n){if(null==n||"boolean"==typeof n)return null;if("string"==typeof n||"number"==typeof n)return v(null,n,null,null);if(null!=n.__e||null!=n.__c){var l=v(n.type,n.props,n.key,null);return l.__e=n.__e,l}return n}function m(n,l){this.props=n,this.context=l}function w(n,l){if(null==l)return n.__p?w(n.__p,n.__p.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?w(n):null}function g(n){var l,u;if(null!=(n=n.__p)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return g(n)}}function k(l){(!l.__d&&(l.__d=!0)&&1===u.push(l)||i!==n.debounceRendering)&&(i=n.debounceRendering,(n.debounceRendering||t)(_))}function _(){var n,l,t,i,r,o,f,e;for(u.sort(function(n,l){return l.__v.__b-n.__v.__b});n=u.pop();)n.__d&&(t=void 0,i=void 0,o=(r=(l=n).__v).__e,f=l.__P,e=l.u,l.u=!1,f&&(t=[],i=$(f,r,s({},r),l.__n,void 0!==f.ownerSVGElement,null,t,e,null==o?w(r):o),j(t,r),i!=o&&g(r)))}function b(n,l,u,t,i,r,o,c,s){var h,v,p,d,y,m,g,k=u&&u.__k||e,_=k.length;if(c==f&&(c=null!=r?r[0]:_?w(u,0):null),h=0,l.__k=x(l.__k,function(u){if(null!=u){if(u.__p=l,u.__b=l.__b+1,null===(p=k[h])||p&&u.key==p.key&&u.type===p.type)k[h]=void 0;else for(v=0;v<_;v++){if((p=k[v])&&u.key==p.key&&u.type===p.type){k[v]=void 0;break}p=null}if(d=$(n,u,p=p||f,t,i,r,o,null,c,s),(v=u.ref)&&p.ref!=v&&(g||(g=[])).push(v,u.__c||d,u),null!=d){if(null==m&&(m=d),null!=u.l)d=u.l,u.l=null;else if(r==p||d!=c||null==d.parentNode){n:if(null==c||c.parentNode!==n)n.appendChild(d);else{for(y=c,v=0;(y=y.nextSibling)&&v<_;v+=2)if(y==d)break n;n.insertBefore(d,c)}"option"==l.type&&(n.value="")}c=d.nextSibling,"function"==typeof l.type&&(l.l=d)}}return h++,u}),l.__e=m,null!=r&&"function"!=typeof l.type)for(h=r.length;h--;)null!=r[h]&&a(r[h]);for(h=_;h--;)null!=k[h]&&D(k[h],k[h]);if(g)for(h=0;h<g.length;h++)A(g[h],g[++h],g[++h])}function x(n,l,u){if(null==u&&(u=[]),null==n||"boolean"==typeof n)l&&u.push(l(null));else if(Array.isArray(n))for(var t=0;t<n.length;t++)x(n[t],l,u);else u.push(l?l(y(n)):n);return u}function C(n,l,u,t,i){var r;for(r in u)r in l||N(n,r,null,u[r],t);for(r in l)i&&"function"!=typeof l[r]||"value"===r||"checked"===r||u[r]===l[r]||N(n,r,l[r],u[r],t)}function P(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]="number"==typeof u&&!1===c.test(l)?u+"px":null==u?"":u}function N(n,l,u,t,i){var r,o,f,e,c;if("key"===(l=i?"className"===l?"class":l:"class"===l?"className":l)||"children"===l);else if("style"===l)if(r=n.style,"string"==typeof u)r.cssText=u;else{if("string"==typeof t&&(r.cssText="",t=null),t)for(o in t)u&&o in u||P(r,o,"");if(u)for(f in u)t&&u[f]===t[f]||P(r,f,u[f])}else"o"===l[0]&&"n"===l[1]?(e=l!==(l=l.replace(/Capture$/,"")),c=l.toLowerCase(),l=(c in n?c:l).slice(2),u?(t||n.addEventListener(l,T,e),(n.t||(n.t={}))[l]=u):n.removeEventListener(l,T,e)):"list"!==l&&"tagName"!==l&&"form"!==l&&!i&&l in n?n[l]=null==u?"":u:"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/^xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u?n.removeAttribute(l):n.setAttribute(l,u))}function T(l){return this.t[l.type](n.event?n.event(l):l)}function $(l,u,t,i,r,o,f,e,c,a){var h,v,p,y,w,g,k,_,C,P,N=u.type;if(void 0!==u.constructor)return null;(h=n.__b)&&h(u);try{n:if("function"==typeof N){if(_=u.props,C=(h=N.contextType)&&i[h.__c],P=h?C?C.props.value:h.__p:i,t.__c?k=(v=u.__c=t.__c).__p=v.__E:("prototype"in N&&N.prototype.render?u.__c=v=new N(_,P):(u.__c=v=new m(_,P),v.constructor=N,v.render=H),C&&C.sub(v),v.props=_,v.state||(v.state={}),v.context=P,v.__n=i,p=v.__d=!0,v.__h=[]),null==v.__s&&(v.__s=v.state),null!=N.getDerivedStateFromProps&&s(v.__s==v.state?v.__s=s({},v.__s):v.__s,N.getDerivedStateFromProps(_,v.__s)),p)null==N.getDerivedStateFromProps&&null!=v.componentWillMount&&v.componentWillMount(),null!=v.componentDidMount&&f.push(v);else{if(null==N.getDerivedStateFromProps&&null==e&&null!=v.componentWillReceiveProps&&v.componentWillReceiveProps(_,P),!e&&null!=v.shouldComponentUpdate&&!1===v.shouldComponentUpdate(_,v.__s,P)){for(v.props=_,v.state=v.__s,v.__d=!1,v.__v=u,u.__e=null!=c?c!==t.__e?c:t.__e:null,u.__k=t.__k,h=0;h<u.__k.length;h++)u.__k[h]&&(u.__k[h].__p=u);break n}null!=v.componentWillUpdate&&v.componentWillUpdate(_,v.__s,P)}for(y=v.props,w=v.state,v.context=P,v.props=_,v.state=v.__s,(h=n.__r)&&h(u),v.__d=!1,v.__v=u,v.__P=l,h=v.render(v.props,v.state,v.context),u.__k=x(null!=h&&h.type==d&&null==h.key?h.props.children:h),null!=v.getChildContext&&(i=s(s({},i),v.getChildContext())),p||null==v.getSnapshotBeforeUpdate||(g=v.getSnapshotBeforeUpdate(y,w)),b(l,u,t,i,r,o,f,c,a),v.base=u.__e;h=v.__h.pop();)v.__s&&(v.state=v.__s),h.call(v);p||null==y||null==v.componentDidUpdate||v.componentDidUpdate(y,w,g),k&&(v.__E=v.__p=null)}else u.__e=z(t.__e,u,t,i,r,o,f,a);(h=n.diffed)&&h(u)}catch(l){n.__e(l,u,t)}return u.__e}function j(l,u){for(var t;t=l.pop();)try{t.componentDidMount()}catch(l){n.__e(l,t.__v)}n.__c&&n.__c(u)}function z(n,l,u,t,i,r,o,c){var s,a,h,v,p=u.props,d=l.props;if(i="svg"===l.type||i,null==n&&null!=r)for(s=0;s<r.length;s++)if(null!=(a=r[s])&&(null===l.type?3===a.nodeType:a.localName===l.type)){n=a,r[s]=null;break}if(null==n){if(null===l.type)return document.createTextNode(d);n=i?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type),r=null}return null===l.type?p!==d&&(null!=r&&(r[r.indexOf(n)]=null),n.data=d):l!==u&&(null!=r&&(r=e.slice.call(n.childNodes)),h=(p=u.props||f).dangerouslySetInnerHTML,v=d.dangerouslySetInnerHTML,c||(v||h)&&(v&&h&&v.__html==h.__html||(n.innerHTML=v&&v.__html||"")),C(n,d,p,i,c),l.__k=l.props.children,v||b(n,l,u,t,"foreignObject"!==l.type&&i,r,o,f,c),c||("value"in d&&void 0!==d.value&&d.value!==n.value&&(n.value=null==d.value?"":d.value),"checked"in d&&void 0!==d.checked&&d.checked!==n.checked&&(n.checked=d.checked))),n}function A(l,u,t){try{"function"==typeof l?l(u):l.current=u}catch(l){n.__e(l,t)}}function D(l,u,t){var i,r,o;if(n.unmount&&n.unmount(l),(i=l.ref)&&A(i,null,u),t||"function"==typeof l.type||(t=null!=(r=l.__e)),l.__e=l.l=null,null!=(i=l.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(l){n.__e(l,u)}i.base=i.__P=null}if(i=l.__k)for(o=0;o<i.length;o++)i[o]&&D(i[o],u,t);null!=r&&a(r)}function H(n,l,u){return this.constructor(n,u)}function I(l,u,t){var i,o,c;n.__p&&n.__p(l,u),o=(i=t===r)?null:t&&t.__k||u.__k,l=h(d,null,[l]),c=[],$(u,i?u.__k=l:(t||u).__k=l,o||f,f,void 0!==u.ownerSVGElement,t&&!i?[t]:o?null:e.slice.call(u.childNodes),c,!1,t||f,i),j(c,l)}function L(n,l){I(n,l,r)}function M(n,l){return l=s(s({},n.props),l),arguments.length>2&&(l.children=e.slice.call(arguments,2)),v(n.type,l,l.key||n.key,l.ref||n.ref)}function O(n){var l={},u={__c:"__cC"+o++,__p:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var t,i=this;return this.getChildContext||(t=[],this.getChildContext=function(){return l[u.__c]=i,l},this.shouldComponentUpdate=function(i){n.value!==i.value&&(l[u.__c].props.value=i.value,t.some(function(n){n.__P&&(n.context=i.value,k(n))}))},this.sub=function(n){t.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){t.splice(t.indexOf(n),1),l&&l.call(n)}}),n.children}};return u.Consumer.contextType=u,u}n={},l=function(n){return null!=n&&void 0===n.constructor},m.prototype.setState=function(n,l){var u=this.__s!==this.state&&this.__s||(this.__s=s({},this.state));("function"!=typeof n||(n=n(u,this.props)))&&s(u,n),null!=n&&this.__v&&(this.u=!1,l&&this.__h.push(l),k(this))},m.prototype.forceUpdate=function(n){this.__v&&(n&&this.__h.push(n),this.u=!0,k(this))},m.prototype.render=d,u=[],t="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,i=n.debounceRendering,n.__e=function(n,l,u){for(var t;l=l.__p;)if((t=l.__c)&&!t.__p)try{if(t.constructor&&null!=t.constructor.getDerivedStateFromError)t.setState(t.constructor.getDerivedStateFromError(n));else{if(null==t.componentDidCatch)continue;t.componentDidCatch(n)}return k(t.__E=t)}catch(l){n=l}throw n},r=f,o=0;
//# sourceMappingURL=preact.module.js.map


            /***/ }),

        /***/ "./node_modules/text-mask/lib/index.js":
        /*!*********************************************!*\
  !*** ./node_modules/text-mask/lib/index.js ***!
  \*********************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            Object.defineProperty(exports, '__esModule', {
                value: true
            });

            function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

            var _textMask = __webpack_require__(/*! ./textMask */ "./node_modules/text-mask/lib/textMask.js");

            var _textMask2 = _interopRequireDefault(_textMask);

            exports['default'] = _textMask2['default'];
            module.exports = exports['default'];

            /***/ }),

        /***/ "./node_modules/text-mask/lib/textMask.js":
        /*!************************************************!*\
  !*** ./node_modules/text-mask/lib/textMask.js ***!
  \************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            Object.defineProperty(exports, '__esModule', {
                value: true
            });
            exports['default'] = mask;

            function mask() {
                var options = arguments.length <= 0 || arguments[0] === undefined ? { pattern: '', placeholder: '', patternChar: '_' } : arguments[0];
                var pattern = options.pattern;
                var placeholder = options.placeholder;
                var patternChar = options.patternChar;

                // using 9 for number
                var NUMERIC_REGEX = /^\d$/;
                // using a for alphabet
                var ALPHA_REGEX = /^[a-zA-Z]$/;
                // using * for alphabet
                var ALPHANNUMERIC_REGEX = /^[a-zA-Z\d]$/;

                var patternSelected = pattern;

                var patternCharSelected = patternChar;

                // pattern and placeholder should have the same length
                var placeholderSelected = generatePlaceholderText(placeholder, patternSelected, patternCharSelected);

                var text = '';
                var inputText = '';

                // pending a full check for pattern vs placeholder
                function generatePlaceholderText(_placeholder, _pattern) {
                    if (_placeholder === undefined) _placeholder = '';

                    var _patternChar = arguments.length <= 2 || arguments[2] === undefined ? '_' : arguments[2];

                    var newPlaceholder = _placeholder;

                    if (_pattern.length !== _placeholder.length) {
                        newPlaceholder = String(_pattern).replace(/[9|a|\*]/g, _patternChar);
                    }
                    return newPlaceholder;
                }

                function put(_x3) {
                    var _this = this;

                    var _again = true;

                    _function: while (_again) {
                        var inputChar = _x3;
                        _again = false;

                        if (text.length === patternSelected.length) return false;

                        // check for pattern character
                        var curPatternChar = patternSelected[text.length];
                        var curPaceholderChar = placeholderSelected[text.length];

                        // need a better check here
                        if (curPatternChar === curPaceholderChar) {
                            text = text + curPatternChar;
                            _x3 = inputChar;
                            _again = true;
                            curPatternChar = curPaceholderChar = undefined;
                            continue _function;
                        } else {
                            switch (curPatternChar) {
                                case '9':
                                    if (!inputChar.match(NUMERIC_REGEX)) return false;
                                    break;
                                case 'a':
                                    if (!inputChar.match(ALPHA_REGEX)) return false;
                                    break;
                                case '*':
                                    if (!inputChar.match(ALPHANNUMERIC_REGEX)) return false;
                                    break;
                                default:
                                    return false;
                            }

                            text = text + inputChar;
                            inputText = inputText + inputChar;

                            return _this;
                        }
                    }
                }

                function back() {

                    if (text.length === 0) return false;

                    text = text.substring(0, text.length - 1);
                    inputText = inputText.substring(0, inputText.length - 1);

                    if (text.length > 0) {
                        var curPatternChar = patternSelected[text.length - 1];
                        var curPaceholderChar = placeholderSelected[text.length - 1];

                        if (curPatternChar === curPaceholderChar) {
                            text = text.substring(0, text.length - 1);
                        }
                    }

                    return this;
                }

                function getInputText() {

                    return inputText;
                }

                function getText() {

                    return text;
                }

                function getDisplayText() {

                    return text + placeholderSelected.substring(text.length);
                }

                function getSelection() {
                    var start = text.length ? text.length - 1 : 0;
                    var end = text.length;

                    return { start: start, end: end };
                }

                return {
                    placeholder: placeholderSelected,
                    pattern: patternSelected,
                    put: put,
                    getText: getText,
                    getInputText: getInputText,
                    getDisplayText: getDisplayText,
                    getSelection: getSelection,
                    back: back
                };
            }

            module.exports = exports['default'];

            /***/ }),

        /***/ "./src/app/MultiSafepay.tsx":
        /*!**********************************!*\
  !*** ./src/app/MultiSafepay.tsx ***!
  \**********************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var preact_1 = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
            var Globals_1 = __webpack_require__(/*! ./lib/Globals */ "./src/app/lib/Globals.tsx");
            var Utils_1 = __webpack_require__(/*! ./lib/utils/Utils */ "./src/app/lib/utils/Utils.tsx");
            var App_1 = __webpack_require__(/*! ./components/payment/App */ "./src/app/components/payment/App.tsx");
            var App_2 = __webpack_require__(/*! ./components/dropin/App */ "./src/app/components/dropin/App.tsx");
            var App_3 = __webpack_require__(/*! ./components/redirection/App */ "./src/app/components/redirection/App.tsx");
            var events_1 = __webpack_require__(/*! events */ "./node_modules/events/events.js");
            var Locale_1 = __webpack_require__(/*! ./lib/utils/Locale */ "./src/app/lib/utils/Locale.tsx");
            if (window['MSPCurrentScript']) {
                throw 'MultiSafepay loadaed multiple times';
            }
            window['MSPCurrentScript'] = document.currentScript || (function () {
                var scripts = document.getElementsByTagName("script");
                return scripts[scripts.length - 1];
            })();
            var __ParseErrors = function (error) {
                if (error === void 0) { error = null; }
                var data = Globals_1.Globals.getSetting('paymentData');
                var result = {
                    count: 0,
                    errors: []
                };
                var err;
                if (error && error.error_code) {
                    err = {
                        id: null,
                        type: 'api',
                        mesage: error.error_info ? error.error_info : '',
                        code: error.error_code || 1000
                    };
                    result.errors.push(err);
                    result.count++;
                }
                if (error && error.message) {
                    err = {
                        id: null,
                        type: 'error',
                        mesage: error.message ? error.message : '',
                        code: error.error_code || 1000
                    };
                    result.errors.push(err);
                    result.count++;
                }
                if (data.validation && data.validation.items) {
                    for (var i in data.validation.items) {
                        if (data.validation.items[i]['errors']) {
                            err = {
                                id: i,
                                code: 1000,
                                type: 'validation',
                                mesage: data.validation.items[i]['message']
                            };
                            result.errors.push(err);
                            result.count++;
                        }
                    }
                }
                return result;
            };
            var MultiSafepay = (function () {
                function MultiSafepay(args) {
                    var _this = this;
                    if (args === void 0) { args = {}; }
                    this.appConfig = {
                        component: {}
                    };
                    this.appEvents = null;
                    this.redirectConfig = {};
                    this.errorHandler = {};
                    this.ref = null;
                    this.onError = function (error) {
                        if (error === void 0) { error = null; }
                        _this.errorHandler = __ParseErrors(error);
                        if (_this.errorHandler['count'] && Utils_1.Utils.isFunction(_this.appConfig['onError'])) {
                            _this.appConfig['onError'](_this.errorHandler);
                        }
                    };
                    this.onLoad = function () {
                        if (Utils_1.Utils.isFunction(_this.appConfig['onLoad'])) {
                            _this.appConfig['onLoad']({
                                success: true
                            });
                        }
                    };
                    this.onSubmit = function (data) {
                        if (data === void 0) { data = {}; }
                        _this.appEvents.emit('msp:checkErrors', {});
                        _this.errorHandler = __ParseErrors();
                        if (Utils_1.Utils.isFunction(_this.appConfig['onSubmit'])) {
                            _this.appConfig['onSubmit'](data);
                        }
                    };
                    this.onSelect = function (data) {
                        if (data === void 0) { data = {}; }
                        if (Utils_1.Utils.isFunction(_this.appConfig['onSelect'])) {
                            _this.appConfig['onSelect']({
                                id: data.id,
                                label: data.label,
                            });
                        }
                    };
                    this.hasErrors = function () {
                        _this.appEvents.emit('msp:checkErrors', {});
                        _this.errorHandler = __ParseErrors();
                        return _this.errorHandler['count'] > 0;
                    };
                    this.getErrors = function () {
                        _this.appEvents.emit('msp:checkErrors', {});
                        _this.errorHandler = __ParseErrors();
                        return _this.errorHandler;
                    };
                    this.getPaymentData = function () {
                        return Globals_1.Globals.getPaymentData(_this.appConfig['gateway']);
                    };
                    this.init = function (val, config) {
                        if (config === void 0) { config = {}; }
                        Locale_1.Locale.init(Globals_1.Globals.getSetting('locale'));
                        if (val == 'redirection') {
                            if (!config['order'] || !config['order']['order_id']) {
                                throw Locale_1.Locale.__('order_required_redirect');
                            }
                            _this.redirectConfig = config;
                        }
                        else {
                            if (!_this.appConfig['component']['type']) {
                                _this.appConfig = config;
                            }
                            else {
                                throw Locale_1.Locale.__('payment_instance_exists') + ': ' + _this.appConfig['component']['type'];
                            }
                        }
                        var container = null;
                        if (config['container']) {
                            container = document.querySelector(config['container']);
                        }
                        if (val != 'redirection') {
                            if (!container) {
                                throw Locale_1.Locale.__('container_not_found') + ': ' + config['container'];
                            }
                            _this.appConfig['component'] = {
                                type: val,
                                container: config['container'],
                                containerRef: container,
                            };
                        }
                        _this.onLoad = _this.onLoad.bind(_this);
                        _this.onSubmit = _this.onSubmit.bind(_this);
                        _this.onSelect = _this.onSelect.bind(_this);
                        _this.hasErrors = _this.hasErrors.bind(_this);
                        _this.getErrors = _this.getErrors.bind(_this);
                        _this.getPaymentData = _this.getPaymentData.bind(_this);
                        var setRef = function (dom) {
                            _this.ref = dom;
                        };
                        switch (val) {
                            case 'dropin':
                                if (!_this.appConfig['gateways']['methods']) {
                                    _this.onError({
                                        message: Locale_1.Locale.__('no_gateways_found'),
                                        code: 1000
                                    });
                                }
                                preact_1.render(preact_1.h(App_2.DropinApp, { appEvents: _this.appEvents, appConfig: _this.appConfig, onLoad: _this.onLoad, onSubmit: _this.onSubmit, onSelect: _this.onSelect, onError: _this.onError, hasErrors: _this.hasErrors, ref: setRef }), container);
                                break;
                            case 'payment':
                                preact_1.render(preact_1.h(App_1.PaymentApp, { appEvents: _this.appEvents, appConfig: _this.appConfig, onLoad: _this.onLoad, onSubmit: _this.onSubmit, onSelect: _this.onSelect, onError: _this.onError, hasErrors: _this.hasErrors, ref: setRef }), container);
                                break;
                            case 'redirection':
                                _this.redirectConfig['container'] = (container ? container : _this.appConfig['component']['container']);
                                if (!container) {
                                    container = document.querySelector(_this.appConfig['component']['container']);
                                }
                                if (!container) {
                                    throw 'Container ' + _this.redirectConfig['container'] + ' not found';
                                }
                                preact_1.render(preact_1.h(App_3.RedirectionApp, { appEvents: _this.appEvents, redirectConfig: _this.redirectConfig, onLoad: _this.onLoad, onSubmit: _this.onSubmit, onError: _this.onError, onSelect: _this.onSelect, hasErrors: _this.hasErrors, ref: setRef }), container);
                                break;
                            default:
                                throw Locale_1.Locale.__('wrong_init_type') + ': ' + val;
                        }
                    };
                    if (!args['apiToken']) {
                        throw 'Api Token is required';
                    }
                    this.appEvents = new events_1.EventEmitter();
                    Globals_1.Globals.setSettings(args);
                }
                return MultiSafepay;
            }());
            exports.MultiSafepay = MultiSafepay;


            /***/ }),

        /***/ "./src/app/components/common/PaymentMethodForm.tsx":
        /*!*********************************************************!*\
  !*** ./src/app/components/common/PaymentMethodForm.tsx ***!
  \*********************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            var __extends = (this && this.__extends) || (function () {
                var extendStatics = function (d, b) {
                    extendStatics = Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
                    return extendStatics(d, b);
                };
                return function (d, b) {
                    extendStatics(d, b);
                    function __() { this.constructor = d; }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
            })();
            Object.defineProperty(exports, "__esModule", { value: true });
            var preact_1 = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
            var Api_1 = __webpack_require__(/*! ../../lib/Api */ "./src/app/lib/Api.ts");
            var Utils_1 = __webpack_require__(/*! ../../lib/utils/Utils */ "./src/app/lib/utils/Utils.tsx");
            var Globals_1 = __webpack_require__(/*! ../../lib/Globals */ "./src/app/lib/Globals.tsx");
            var PaymentMethodImage_1 = __webpack_require__(/*! ./PaymentMethodImage */ "./src/app/components/common/PaymentMethodImage.tsx");
            var UiLoading_1 = __webpack_require__(/*! ./UiLoading */ "./src/app/components/common/UiLoading.tsx");
            var textMask = __webpack_require__(/*! text-mask */ "./node_modules/text-mask/lib/index.js");
            var Locale_1 = __webpack_require__(/*! ../../lib/utils/Locale */ "./src/app/lib/utils/Locale.tsx");
            var CreditCardInputs_1 = __webpack_require__(/*! ./forms/CreditCardInputs */ "./src/app/components/common/forms/CreditCardInputs.tsx");
            var SelectInput_1 = __webpack_require__(/*! ./forms/inputs/SelectInput */ "./src/app/components/common/forms/inputs/SelectInput.tsx");
            var TextInput_1 = __webpack_require__(/*! ./forms/inputs/TextInput */ "./src/app/components/common/forms/inputs/TextInput.tsx");
            var HiddenInput_1 = __webpack_require__(/*! ./forms/inputs/HiddenInput */ "./src/app/components/common/forms/inputs/HiddenInput.tsx");
            var InputLabel_1 = __webpack_require__(/*! ./forms/inputs/InputLabel */ "./src/app/components/common/forms/inputs/InputLabel.tsx");
            var ErrorMessage_1 = __webpack_require__(/*! ./forms/inputs/ErrorMessage */ "./src/app/components/common/forms/inputs/ErrorMessage.tsx");
            var PaymentMethodForm = (function (_super) {
                __extends(PaymentMethodForm, _super);
                function PaymentMethodForm(props) {
                    var _this = _super.call(this, props) || this;
                    _this.setFocus = null;
                    _this.state = {
                        loading: false,
                        defaultCardSettings: {},
                        gatewayFields: {},
                        gatewayItemSelected: {},
                        gatewayBrand: {},
                        globalSettings: {},
                        validation: {
                            showErrors: false,
                            items: {}
                        },
                        inputFieldItems: {
                            id: null,
                            items: []
                        },
                        hideCVV: false,
                        disableConfirm: false
                    };
                    _this.componentDidUpdate = function () {
                        if (_this.setFocus) {
                            var input = document.querySelector(".msp-ui-payment-form #" + _this.setFocus);
                            if (input) {
                                input.focus();
                            }
                            _this.setFocus = null;
                        }
                    };
                    _this.fillDefaultCardSettings = function (item) {
                        if (Object.keys(_this.state.defaultCardSettings).length == 0) {
                            try {
                                _this.state.defaultCardSettings = {
                                    format: item.format,
                                    maxlength: item.maxlength
                                };
                            }
                            catch (e) {
                            }
                        }
                    };
                    _this.validateField = function (field) {
                        var valid = false;
                        if (field.value && field.required) {
                            if (field.regex) {
                                var regexp = new RegExp(field.regex);
                                valid = regexp.test(field.value);
                            }
                            else {
                                valid = true;
                            }
                        }
                        return valid;
                    };
                    _this.displayErrors = function (errorFields) {
                        var gatewayData = _this.props.gatewayData;
                        var state = _this.state;
                        gatewayData.fields.items.map(function (field) {
                            if (errorFields.indexOf(field.id) > -1) {
                                state.validation.items[field.id] = {};
                                state.validation.items[field.id].errors = true;
                                state.validation.items[field.id].message = field.error
                                    ? field.error
                                    : Locale_1.Locale.__("required");
                                state.validation.showErrors = true;
                            }
                        });
                        _this.setState(state);
                    };
                    _this.checkConfirmButtonStatus = function () {
                        var disabled = false;
                        try {
                            var selectButtons = _this.props.gatewayData.fields.items.filter(function (elem) { return elem.type == "select-button"; });
                            if (selectButtons.length > 0) {
                                selectButtons.map(function (elem) {
                                    if (elem.required && !elem.value) {
                                        disabled = true;
                                    }
                                });
                            }
                        }
                        catch (e) {
                            disabled = false;
                        }
                        return disabled;
                    };
                    _this.inputOnInput = function (e, item) {
                        var _a = _this.props, gatewayData = _a.gatewayData, onError = _a.onError;
                        var state = _this.state;
                        var paymentData = Globals_1.Globals.getSetting('paymentData');
                        if (!paymentData.fields) {
                            paymentData.fields = {};
                        }
                        state.gatewayFields[item.id]['value'] = e.target.value;
                        state.validation.items[item.id] = {};
                        var maskFormat = {};
                        var value = state.gatewayFields[item.id]['value'];
                        var valueLen = value.length;
                        var encrypt = false;
                        var creditCardType = null;
                        switch (item.type) {
                            case 'typing-selector':
                                if (item.callback && e.target.value.length > 1) {
                                    var url = Globals_1.Globals.API_ENDPOINTS.CONNECT + '/' +
                                        item.callback.replace('{' + item.id + '}', e.target.value);
                                    Api_1.Api.httpRequest(url).then(function (response) {
                                        if (response.error_code) {
                                            onError(response);
                                        }
                                        _this.setState({
                                            inputFieldItems: {
                                                id: item.id,
                                                items: response && response['items'] || [],
                                            }
                                        });
                                    });
                                }
                                break;
                            default:
                        }
                        switch (gatewayData.fields.template) {
                            case Globals_1.Globals.FORM_TEMPLATES.CREDITCARD:
                                if (!creditCardType) {
                                    creditCardType = __webpack_require__(/*! credit-card-type */ "./node_modules/credit-card-type/index.js");
                                }
                                switch (gatewayData.gateway) {
                                    case Globals_1.Globals.FORM_TEMPLATES.CREDITCARD:
                                        if (item.id == 'extvar1') {
                                            _this.fillDefaultCardSettings(item);
                                            var matched = false;
                                            var ccType = [];
                                            if (valueLen >= 1 && creditCardType) {
                                                ccType = creditCardType(value);
                                                ccType = Utils_1.Utils.checkCardFormats(ccType, value);
                                                if (ccType[0] && gatewayData.brands.length) {
                                                    for (var key in gatewayData.brands) {
                                                        var v = gatewayData.brands[key];
                                                        if (Utils_1.Utils.cardMapGateway(ccType[0].type) == v['id']) {
                                                            if (Globals_1.Globals.CARD_FORMAT_OBJECT[v.id] && Globals_1.Globals.CARD_FORMAT_OBJECT[v.id]["format"]) {
                                                                state.gatewayFields[item.id]["format"] = Globals_1.Globals.CARD_FORMAT_OBJECT[v.id]["format"];
                                                                state.gatewayFields[item.id]["maxlength"] = Globals_1.Globals.CARD_FORMAT_OBJECT[v.id]["maxlength"];
                                                            }
                                                            else {
                                                                state.gatewayFields[item.id]["format"] = state.defaultCardSettings["format"];
                                                                state.gatewayFields[item.id]["maxlength"] = state.defaultCardSettings["maxlength"];
                                                            }
                                                            state.hideCVV = Globals_1.Globals.CARD_FORMAT_OBJECT[v.id]["hideCVV"] || false;
                                                            state.gatewayBrand = gatewayData.brands[key];
                                                            state.gatewayBrand['label'] = ccType[0].niceType;
                                                            matched = true;
                                                        }
                                                    }
                                                }
                                            }
                                            if (!matched) {
                                                state.hideCVV = false;
                                                state.validation.items[item.id].errors = true;
                                                if (ccType[0]) {
                                                    state.validation.items[item.id].message = 'card_not_allowed';
                                                    state.validation.items[item.id].suffix = ': ' + ccType[0].niceType;
                                                }
                                                else {
                                                    state.validation.items[item.id].message = 'card_not_valid';
                                                }
                                                state.gatewayBrand = {};
                                            }
                                            try {
                                                state.gatewayFields['extvar4']['required'] = !state.hideCVV;
                                            }
                                            catch (e) {
                                            }
                                        }
                                        break;
                                    default:
                                }
                                if (item.id == 'extvar3') {
                                    value = value.split('/').reverse().join('');
                                }
                                encrypt = true;
                                break;
                            default:
                        }
                        if (item.format) {
                            maskFormat['pattern'] = Utils_1.Utils.handleFormatPatterns(item.format);
                        }
                        if (maskFormat['pattern'] && state.gatewayFields[item.id]['value']) {
                            maskFormat['patternChar'] = '\u2000';
                            var maskedText_1 = textMask(maskFormat);
                            state.gatewayFields[item.id]['value'].split('').forEach(function (i) {
                                maskedText_1.put(i);
                            });
                            var masked = maskedText_1.getText();
                            if (encrypt && item.id == 'extvar3' && e.inputType == "insertText") {
                                if (masked.length == 2 && ['/'].indexOf(masked) == -1) {
                                    masked = masked + '/';
                                }
                                else if (masked.length == item.maxlength) {
                                    _this.setFocus = "extvar4";
                                }
                            }
                            state.gatewayFields[item.id]['value'] = masked;
                        }
                        state.gatewayFields[item.id].isDirty = state.gatewayFields[item.id]['defaultValue'] !== state.gatewayFields[item.id]['value'];
                        if (!state.validation.items[item.id].errors && !state.validation.items[item.id].success) {
                            if (item.required && !valueLen) {
                                state.validation.items[item.id].errors = true;
                                state.validation.items[item.id].message = (item.error ? item.error : Locale_1.Locale.__('required'));
                                state.validation.showErrors = true;
                            }
                        }
                        if (!state.validation.items[item.id].errors && valueLen) {
                            state.validation.items[item.id].success = true;
                            state.validation.items[item.id].message = '';
                            state.validation.showErrors = false;
                        }
                        var fieldKey = item.id;
                        var group = null;
                        if (state.gatewayFields[fieldKey] && state.gatewayFields[fieldKey]['input_group']) {
                            group = state.gatewayFields[fieldKey]['input_group'];
                        }
                        if (group) {
                            var values = [];
                            fieldKey = group['id'];
                            for (var i = 0; i < 10; i++) {
                                var gId = group['id'] + '__' + i;
                                if (state.gatewayFields[gId]) {
                                    values.push(state.gatewayFields[gId]['value']);
                                }
                            }
                            if (encrypt && fieldKey == 'extvar3') {
                                value = values.reverse().join(group['separator']);
                            }
                            else {
                                value = values.join(group['separator']);
                            }
                        }
                        paymentData.fields[fieldKey] = encrypt ? Utils_1.Utils.setEncryption(value, Globals_1.Globals.getSetting('encrypt')) : value;
                        _this.setState(state);
                        Globals_1.Globals.setSetting('paymentData', {
                            gateway: gatewayData['gateway'],
                            fields: paymentData.fields,
                            validation: state.validation,
                            encrypted: encrypt
                        });
                        setTimeout(function () {
                            _this.setOnInputError();
                        }, 300);
                    };
                    _this.state.disableConfirm = _this.checkConfirmButtonStatus();
                    _this.state.globalSettings = Globals_1.Globals.getSettings();
                    _this.setInputClass = _this.setInputClass.bind(_this);
                    _this.setInputStyle = _this.setInputStyle.bind(_this);
                    _this.inputOnInput = _this.inputOnInput.bind(_this);
                    _this.checkCardNumber = _this.checkCardNumber.bind(_this);
                    return _this;
                }
                PaymentMethodForm.prototype.componentDidMount = function () {
                    var _this = this;
                    var _a = this.props, onLoad = _a.onLoad, gatewayData = _a.gatewayData;
                    Globals_1.Globals.setSetting('paymentData', {});
                    if (!Utils_1.Utils.isFunction(this.props.appEvents._events['msp:checkErrors'])) {
                        this.props.appEvents.on('msp:checkErrors', function () {
                            _this.state.validation.showErrors = true;
                            _this.validateInputFields();
                        });
                    }
                    if (Object.keys(gatewayData).length > 0) {
                        onLoad();
                    }
                };
                PaymentMethodForm.prototype.onGatewayConfirm = function (validate) {
                    var _this = this;
                    if (validate === void 0) { validate = false; }
                    var _a = this.props, onSubmit = _a.onSubmit, gatewayData = _a.gatewayData;
                    var errorFields = [];
                    var paymentData = Globals_1.Globals.getPaymentData(gatewayData['gateway']);
                    if (!validate) {
                        paymentData['validation'] = {};
                    }
                    else {
                        var valid_1;
                        gatewayData.fields.items.map(function (field) {
                            valid_1 = _this.validateField(field);
                            if (!valid_1) {
                                errorFields.push(field.id);
                            }
                        });
                    }
                    if (errorFields.length == 0) {
                        Globals_1.Globals.setSetting('paymentData', paymentData);
                        onSubmit({
                            paymentData: paymentData
                        });
                    }
                    else {
                        this.displayErrors(errorFields);
                    }
                };
                PaymentMethodForm.prototype.gatewayItemSelect = function (input, item) {
                    var _a = this.props, onSelect = _a.onSelect, gatewayData = _a.gatewayData;
                    var gatewayFields = this.state.gatewayFields;
                    var paymentData = Globals_1.Globals.getSetting('paymentData');
                    if (!paymentData.fields) {
                        paymentData.fields = {};
                    }
                    gatewayFields[input.id]['value'] = item.id;
                    var paymentDataVal = gatewayFields[input.id]['value'];
                    var encrypt = false;
                    var disabledButton = this.checkConfirmButtonStatus();
                    paymentData.fields[input.id] = (encrypt ?
                        Utils_1.Utils.setEncryption(paymentDataVal, Globals_1.Globals.getSetting('encrypt')) :
                        paymentDataVal);
                    this.setState({
                        validation: {
                            showErrors: false,
                            items: {}
                        },
                        gatewayFields: gatewayFields,
                        gatewayItemSelected: item,
                        disableConfirm: disabledButton
                    });
                    Globals_1.Globals.setSetting('paymentData', {
                        gateway: gatewayData['gateway'],
                        fields: paymentData.fields,
                        validation: {
                            showErrors: false,
                            items: {}
                        },
                        encrypted: encrypt
                    });
                    onSelect(item);
                };
                PaymentMethodForm.prototype.setOnInputError = function () {
                    var onError = this.props.onError;
                    onError({});
                };
                PaymentMethodForm.prototype.gatewaySelect = function (item) {
                    if (item === void 0) { item = null; }
                    this.setState({
                        gatewayItemSelected: {},
                        inputFieldItems: {
                            id: null,
                            items: [],
                        }
                    });
                    var onGatewaySelect = this.props.onGatewaySelect;
                    onGatewaySelect(item);
                };
                PaymentMethodForm.prototype.setGatewayFieldValue = function (id, item) {
                    var gatewayData = this.props.gatewayData;
                    var gatewayFields = this.state.gatewayFields;
                    gatewayFields[id].value = item.id;
                    var paymentData = Globals_1.Globals.getSetting('paymentData');
                    if (!paymentData.fields) {
                        paymentData.fields = {};
                    }
                    paymentData.fields[id] = item.id;
                    this.setState({
                        gatewayFields: gatewayFields,
                        inputFieldItems: {
                            id: null,
                            items: [],
                        }
                    });
                    Globals_1.Globals.setSetting('paymentData', {
                        gateway: gatewayData['gateway'],
                        fields: paymentData.fields,
                        validation: {
                            showErrors: false,
                            items: {}
                        },
                        encrypted: false
                    });
                };
                PaymentMethodForm.prototype.validateInputFields = function (selectedItem) {
                    if (selectedItem === void 0) { selectedItem = null; }
                    var paymentData = Globals_1.Globals.getSetting('paymentData');
                    if (!paymentData.fields) {
                        paymentData.fields = {};
                    }
                    var state = this.state;
                    var hasErrors = false;
                    for (var i in this.state.gatewayFields) {
                        var item = this.state.gatewayFields[i];
                        var valueLen = ('' + (item.value === null ? '' : item.value)).length;
                        var validate = true;
                        if (selectedItem && selectedItem.id != selectedItem.id) {
                            validate = false;
                        }
                        if (validate) {
                            if (item.required && valueLen < 1) {
                                state.validation.items[item.id] = state.validation.items[item.id] || {};
                                state.validation.items[item.id].errors = true;
                                state.validation.items[item.id].message = (item.error ? item.error : 'Required');
                                state.validation.showErrors = true;
                                hasErrors = true;
                            }
                        }
                    }
                    state.validation.showErrors = hasErrors;
                    this.setState(state);
                    paymentData.validation = state.validation;
                    Globals_1.Globals.setSetting('paymentData', paymentData);
                };
                PaymentMethodForm.prototype.prepareInputFields = function (gatewayData) {
                    try {
                        var count = gatewayData['fields'] && gatewayData['fields'].items ? gatewayData['fields'].items.length : 0;
                        if (count) {
                            for (var i in gatewayData['fields'].items) {
                                var item = gatewayData['fields'].items[i];
                                item.isDirty = false;
                                item.defaultValue = item.value;
                                this.state.gatewayFields[item.id] = item;
                            }
                            return count;
                        }
                    }
                    catch (e) {
                        console.error(e);
                    }
                    return false;
                };
                PaymentMethodForm.prototype.handleNoFieldsMethod = function () {
                    var gatewayData = this.props.gatewayData;
                    Globals_1.Globals.setSetting('paymentData', {
                        gateway: gatewayData['gateway'],
                        fields: [],
                        validation: {},
                        encrypted: false
                    });
                    this.onGatewayConfirm();
                };
                PaymentMethodForm.prototype.setInputClass = function (item) {
                    var gatewayData = this.props.gatewayData;
                    var name = ['msp-ui-form-control'];
                    switch (gatewayData.fields.template) {
                        case Globals_1.Globals.FORM_TEMPLATES.CREDITCARD:
                            switch (gatewayData.gateway) {
                                case 'CREDITCARD':
                                    if (item.id == 'extvar1') {
                                        name.push('msp-ui-credit-card-input');
                                    }
                                    break;
                            }
                            break;
                    }
                    if (this.state.validation.showErrors) {
                        if (this.state.validation.items[item.id] && this.state.validation.items[item.id]['errors']) {
                            name.push('msp-ui-control-error');
                        }
                    }
                    return name.join(' ');
                };
                PaymentMethodForm.prototype.setInputStyle = function (item) {
                    if (item === void 0) { item = {}; }
                    var gatewayData = this.props.gatewayData;
                    var style = [];
                    switch (gatewayData.fields.template) {
                        case Globals_1.Globals.FORM_TEMPLATES.CREDITCARD:
                            switch (gatewayData.gateway) {
                                case 'CREDITCARD':
                                    if (item.id == 'extvar1') {
                                        var image = this.state.gatewayBrand['id'] ?
                                            this.state.gatewayBrand['image'] :
                                            gatewayData['image'];
                                        style.push('background-image: url(' + Utils_1.Utils.resolveImagePath(image, 'icons') + ');');
                                    }
                                    break;
                            }
                            break;
                    }
                    return style.join(' ');
                };
                PaymentMethodForm.prototype.checkCardNumber = function (field) {
                    if (field.value) {
                        var valid = Utils_1.Utils.validateCardNumber(field.value);
                        var state = this.state;
                        if (!valid) {
                            state.validation.items[field.id].errors = true;
                            state.validation.items[field.id].message = field.value.length <= 15 ? Locale_1.Locale.__('incomplete_card') : Locale_1.Locale.__('card_number_not_valid');
                            state.validation.showErrors = true;
                        }
                        else if (state.validation.items[field.id].message == 'incomplete_card' || state.validation.items[field.id].message == 'card_number_not_valid') {
                            state.validation.items[field.id].errors = false;
                            state.validation.items[field.id].message = '';
                        }
                        this.setState(state);
                    }
                };
                PaymentMethodForm.prototype.render = function (_a) {
                    var _this = this;
                    var gatewayData = _a.gatewayData;
                    var hasInputFields = this.prepareInputFields(gatewayData);
                    if (gatewayData.fields && gatewayData.fields.template == Globals_1.Globals.FORM_TEMPLATES.CREDITCARD) {
                        Utils_1.Utils.loadModule('msp-crypt');
                    }
                    if (!hasInputFields) {
                        this.handleNoFieldsMethod();
                    }
                    var DynamicInputs = hasInputFields ? gatewayData['fields'].items.map(function (item, index) {
                        return preact_1.h("div", null,
                            item.label ? (preact_1.h(InputLabel_1.InputLabel, { item: item, parentState: _this.state })) : null,
                            item.type && ['hidden'].indexOf(item.type) != -1 ? (preact_1.h("div", null,
                                preact_1.h(HiddenInput_1.HiddenInput, { item: item, parentState: _this.state, inputOnInput: _this.props.inputOnInput }))) : null,
                            item.type && ['select'].indexOf(item.type) != -1 ? (preact_1.h("div", { class: "msp-ui-form-group" },
                                preact_1.h(SelectInput_1.SelectInput, { gatewayData: gatewayData, parentState: _this.state, parentPops: _this.props, setInputClass: _this.setInputClass, setInputStyle: _this.setInputStyle }),
                                preact_1.h(ErrorMessage_1.ErrorMessage, { item: item, parentState: _this.state }))) : null,
                            item.type && ['select-button'].indexOf(item.type) != -1 ? (preact_1.h("div", null,
                                preact_1.h("div", { class: "msp-ui-form-items-block" }, item['options'].map(function (opt) {
                                    return (preact_1.h("div", { class: "msp-ui-form-item " + (_this.state.gatewayItemSelected['id'] == opt.id ? 'selected' : ''), onClick: function () { return _this.gatewayItemSelect(item, opt); } },
                                        preact_1.h(PaymentMethodImage_1.PaymentMethodImage, { item: opt, cssClass: "msp-ui-method-image-button" })));
                                })))) : null,
                            item.type && ['select', 'hidden', 'select-button'].indexOf(item.type) == -1 ? (preact_1.h("div", { class: "msp-ui-form-group" },
                                preact_1.h(TextInput_1.TextInput, { item: item, parentState: _this.state, setInputClass: _this.setInputClass, setInputStyle: _this.setInputStyle, inputOnInput: _this.inputOnInput }),
                                preact_1.h(ErrorMessage_1.ErrorMessage, { item: item, parentState: _this.state }))) : null);
                    }) : null;
                    var InputFieldBlock = (this.state.inputFieldItems.items) ?
                        this.state.inputFieldItems.items.map(function (item) {
                            return preact_1.h("div", { class: "msp-ui-input-field-float-item", onClick: function () { return _this.setGatewayFieldValue(_this.state.inputFieldItems.id, item); } },
                                preact_1.h("span", null, item.label ? (preact_1.h("span", null, item.label)) : ''));
                        }) : null;
                    return (preact_1.h("div", null, this.state.loading ?
                        (preact_1.h(UiLoading_1.UiLoading, null))
                        :
                        (preact_1.h("div", null, hasInputFields ?
                            (preact_1.h("div", { class: "msp-ui-payment-form" },
                                gatewayData['id'] && (preact_1.h("div", null, !this.state.globalSettings['template']['settings']['embed_mode'] ? (preact_1.h("div", null,
                                preact_1.h("div", { class: "msp-ui-method-header" },
                                    preact_1.h(PaymentMethodImage_1.PaymentMethodImage, { item: this.state.gatewayBrand['id'] ?
                                            this.state.gatewayBrand :
                                            gatewayData, cssClass: "msp-ui-method-image" }),
                                    this.state.gatewayBrand['id'] ? (this.state.gatewayBrand['label'] ?
                                        this.state.gatewayBrand['label'] :
                                        this.state.gatewayBrand['id']) : gatewayData['label']),
                                preact_1.h("div", { class: "msp-ui-separator msp-ui-margin-y-10-px" }))) : null)),
                                gatewayData.fields && gatewayData.fields.template == Globals_1.Globals.FORM_TEMPLATES.CREDITCARD ?
                                    (preact_1.h(CreditCardInputs_1.CreditCardInputs, { gatewayData: gatewayData, parentState: this.state, parentPops: this.props, setInputClass: this.setInputClass, setInputStyle: this.setInputStyle, inputOnInput: this.inputOnInput, checkCardNumber: this.checkCardNumber }))
                                    :
                                    DynamicInputs,
                                this.state.inputFieldItems.items.length ?
                                    preact_1.h("div", { class: "msp-ui-input-field-items-float" }, InputFieldBlock)
                                    :
                                    null,
                                preact_1.h("div", { class: "msp-ui-separator msp-ui-margin-y-10-px" }),
                                this.props.appConfig['component']['type'] == 'dropin' ?
                                    (preact_1.h("span", { class: "" },
                                        preact_1.h("button", { class: "msp-ui-btn msp-ui-btn-link msp-ui-btn-sm msp-ui-view-all-payment-methods", onClick: function () { return _this.gatewaySelect(null); } }, Locale_1.Locale.__('view_all_payment_methods')))) : null,
                                this.props.appConfig['component']['type'] == 'dropin' ?
                                    (preact_1.h("button", { class: "msp-ui-btn msp-ui-btn-success msp-ui-pull-right", disabled: this.state.disableConfirm, onClick: function () { return _this.onGatewayConfirm(true); } }, Locale_1.Locale.__('btn_confirm'))) : null)) : null))));
                };
                return PaymentMethodForm;
            }(preact_1.Component));
            exports.PaymentMethodForm = PaymentMethodForm;


            /***/ }),

        /***/ "./src/app/components/common/PaymentMethodImage.tsx":
        /*!**********************************************************!*\
  !*** ./src/app/components/common/PaymentMethodImage.tsx ***!
  \**********************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            var __extends = (this && this.__extends) || (function () {
                var extendStatics = function (d, b) {
                    extendStatics = Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
                    return extendStatics(d, b);
                };
                return function (d, b) {
                    extendStatics(d, b);
                    function __() { this.constructor = d; }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
            })();
            Object.defineProperty(exports, "__esModule", { value: true });
            var preact_1 = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
            var Utils_1 = __webpack_require__(/*! ../../lib/utils/Utils */ "./src/app/lib/utils/Utils.tsx");
            var PaymentMethodImage = (function (_super) {
                __extends(PaymentMethodImage, _super);
                function PaymentMethodImage() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PaymentMethodImage.prototype.render = function (_a) {
                    var item = _a.item, cssClass = _a.cssClass;
                    return (preact_1.h("span", { class: cssClass, style: { backgroundImage: "url('" + Utils_1.Utils.resolveImagePath(item.image) + "')" } }, "\u00A0"));
                };
                return PaymentMethodImage;
            }(preact_1.Component));
            exports.PaymentMethodImage = PaymentMethodImage;


            /***/ }),

        /***/ "./src/app/components/common/PaymentQr.tsx":
        /*!*************************************************!*\
  !*** ./src/app/components/common/PaymentQr.tsx ***!
  \*************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            var __extends = (this && this.__extends) || (function () {
                var extendStatics = function (d, b) {
                    extendStatics = Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
                    return extendStatics(d, b);
                };
                return function (d, b) {
                    extendStatics(d, b);
                    function __() { this.constructor = d; }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
            })();
            Object.defineProperty(exports, "__esModule", { value: true });
            var preact_1 = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
            var PaymentQr = (function (_super) {
                __extends(PaymentQr, _super);
                function PaymentQr() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PaymentQr.prototype.render = function (_a) {
                    var item = _a.item, cssClass = _a.cssClass;
                    return (preact_1.h("span", { class: cssClass },
                        preact_1.h("img", { src: item.qr_url })));
                };
                return PaymentQr;
            }(preact_1.Component));
            exports.PaymentQr = PaymentQr;


            /***/ }),

        /***/ "./src/app/components/common/UiLoading.tsx":
        /*!*************************************************!*\
  !*** ./src/app/components/common/UiLoading.tsx ***!
  \*************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            var __extends = (this && this.__extends) || (function () {
                var extendStatics = function (d, b) {
                    extendStatics = Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
                    return extendStatics(d, b);
                };
                return function (d, b) {
                    extendStatics(d, b);
                    function __() { this.constructor = d; }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
            })();
            Object.defineProperty(exports, "__esModule", { value: true });
            var preact_1 = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
            var UiLoading = (function (_super) {
                __extends(UiLoading, _super);
                function UiLoading() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                UiLoading.prototype.render = function (_a) {
                    var cssClass = _a.cssClass;
                    return (preact_1.h("div", { class: "" + cssClass },
                        preact_1.h("div", { class: "msp-ui-loading" },
                            preact_1.h("div", { class: "msp-ui-spinner-wrapper" },
                                preact_1.h("span", { class: "msp-ui-spinner" })))));
                };
                return UiLoading;
            }(preact_1.Component));
            exports.UiLoading = UiLoading;


            /***/ }),

        /***/ "./src/app/components/common/forms/CreditCardInputs.tsx":
        /*!**************************************************************!*\
  !*** ./src/app/components/common/forms/CreditCardInputs.tsx ***!
  \**************************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            var __extends = (this && this.__extends) || (function () {
                var extendStatics = function (d, b) {
                    extendStatics = Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
                    return extendStatics(d, b);
                };
                return function (d, b) {
                    extendStatics(d, b);
                    function __() { this.constructor = d; }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
            })();
            Object.defineProperty(exports, "__esModule", { value: true });
            var preact_1 = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
            var ErrorMessage_1 = __webpack_require__(/*! ./inputs/ErrorMessage */ "./src/app/components/common/forms/inputs/ErrorMessage.tsx");
            var TextInput_1 = __webpack_require__(/*! ./inputs/TextInput */ "./src/app/components/common/forms/inputs/TextInput.tsx");
            var SelectInput_1 = __webpack_require__(/*! ./inputs/SelectInput */ "./src/app/components/common/forms/inputs/SelectInput.tsx");
            var InputLabel_1 = __webpack_require__(/*! ./inputs/InputLabel */ "./src/app/components/common/forms/inputs/InputLabel.tsx");
            var Locale_1 = __webpack_require__(/*! ../../../lib/utils/Locale */ "./src/app/lib/utils/Locale.tsx");
            var CreditCardTooltip_1 = __webpack_require__(/*! ./CreditCardTooltip */ "./src/app/components/common/forms/CreditCardTooltip.tsx");
            var CreditCardInputs = (function (_super) {
                __extends(CreditCardInputs, _super);
                function CreditCardInputs(props) {
                    var _this = _super.call(this, props) || this;
                    _this.inputs = {};
                    _this.autocompleteSettings = {
                        extvar1: "cc-number",
                        extvar2: "cc-name",
                        extvar3: "cc-exp",
                        extvar4: "cc-csc"
                    };
                    _this.state = {
                        showTooltip: false,
                        mediaUrl: ''
                    };
                    _this.checkCreditCardNumber = function (field) {
                        var checkCardNumber = _this.props.checkCardNumber;
                        checkCardNumber(field);
                    };
                    _this.onBlur = function (field) {
                        _this.setState({ showTooltip: false });
                    };
                    _this.onFocus = function (field) {
                        _this.setState({ showTooltip: true });
                    };
                    if (_this.props.gatewayData.image) {
                        _this.state.mediaUrl = _this.props.gatewayData.image.split('/img')[0];
                    }
                    _this.onBlur = _this.onBlur.bind(_this);
                    _this.onFocus = _this.onFocus.bind(_this);
                    _this.checkCreditCardNumber = _this.checkCreditCardNumber.bind(_this);
                    return _this;
                }
                CreditCardInputs.prototype.mapItems = function (gatewayData) {
                    if (gatewayData === void 0) { gatewayData = {}; }
                    for (var input in gatewayData['fields']['items']) {
                        var item = gatewayData['fields']['items'][input];
                        this.inputs[item['id']] = item;
                    }
                };
                CreditCardInputs.prototype.render = function (_a) {
                    var _this = this;
                    var gatewayData = _a.gatewayData, parentState = _a.parentState;
                    this.mapItems(gatewayData);
                    var setTemplate = function () {
                        var template = '';
                        try {
                            if (_this.props.parentState.globalSettings['template']['payment_form']['template']['type']) {
                                template = _this.props.parentState.globalSettings['template']['payment_form']['template']['type'];
                            }
                        }
                        catch (e) {
                        }
                        switch (template) {
                            case 'secondary':
                                return templateSecondary;
                            default:
                                return templatePrimary;
                        }
                    };
                    var templateCommon = (preact_1.h("div", null,
                        this.inputs['extvar2'] ?
                            (preact_1.h("div", { class: "msp-ui-form-group" },
                                preact_1.h(InputLabel_1.InputLabel, { item: this.inputs['extvar2'], parentState: parentState }),
                                preact_1.h(TextInput_1.TextInput, { item: this.inputs['extvar2'], parentState: parentState, setInputClass: this.props.setInputClass, setInputStyle: this.props.setInputStyle, inputOnInput: this.props.inputOnInput, autocomplete: this.autocompleteSettings['extvar2'] }),
                                preact_1.h(ErrorMessage_1.ErrorMessage, { item: this.inputs['extvar2'], parentState: parentState }))) : null,
                        this.inputs['extvar1'] ?
                            (preact_1.h("div", { class: "msp-ui-form-group" },
                                preact_1.h(InputLabel_1.InputLabel, { item: this.inputs['extvar1'], parentState: parentState }),
                                preact_1.h(TextInput_1.TextInput, { item: this.inputs['extvar1'], parentState: parentState, setInputClass: this.props.setInputClass, setInputStyle: this.props.setInputStyle, inputOnInput: this.props.inputOnInput, autocomplete: this.autocompleteSettings['extvar1'], onBlur: this.checkCreditCardNumber }),
                                preact_1.h(ErrorMessage_1.ErrorMessage, { item: this.inputs['extvar1'], parentState: parentState }))) : null));
                    var templateSecondary = (preact_1.h("div", null,
                        templateCommon,
                        preact_1.h("div", { class: "msp-ui-row" },
                            this.inputs['extvar3__0'] ?
                                (preact_1.h("div", { class: "msp-ui-col-3" },
                                    preact_1.h("div", { class: "msp-ui-form-group" },
                                        preact_1.h("span", { class: "msp-ui-form-label msp-ui-tooltip-height" }, Locale_1.Locale.__('card_expiry_date')),
                                        preact_1.h(SelectInput_1.SelectInput, { item: this.inputs['extvar3__0'], parentState: parentState, setInputClass: this.props.setInputClass, setInputStyle: this.props.setInputStyle, inputOnInput: this.props.inputOnInput }),
                                        preact_1.h(ErrorMessage_1.ErrorMessage, { item: this.inputs['extvar3__0'], parentState: parentState })))) : null,
                            this.inputs['extvar3__1'] ?
                                (preact_1.h("div", { class: "msp-ui-col-3" },
                                    preact_1.h("div", { class: "msp-ui-form-group" },
                                        preact_1.h("span", { class: "msp-ui-form-label msp-ui-tooltip-height" }, "\u00A0"),
                                        preact_1.h(SelectInput_1.SelectInput, { item: this.inputs['extvar3__1'], parentState: parentState, setInputClass: this.props.setInputClass, setInputStyle: this.props.setInputStyle, inputOnInput: this.props.inputOnInput }),
                                        preact_1.h(ErrorMessage_1.ErrorMessage, { item: this.inputs['extvar3__1'], parentState: parentState })))) : null,
                            this.inputs['extvar4'] && !parentState.hideCVV ?
                                (preact_1.h("div", { class: "msp-ui-col-3" },
                                    preact_1.h("div", { class: "msp-ui-form-group" },
                                        preact_1.h(InputLabel_1.InputLabel, { item: this.inputs['extvar4'], parentState: parentState, customClass: 'msp-ui-inline-block msp-ui-tooltip-height' }),
                                        preact_1.h(CreditCardTooltip_1.CreditCardTooltip, { display: this.state.showTooltip, media: this.state.mediaUrl }),
                                        preact_1.h(TextInput_1.TextInput, { item: this.inputs['extvar4'], parentState: parentState, setInputClass: this.props.setInputClass, setInputStyle: this.props.setInputStyle, inputOnInput: this.props.inputOnInput, autocomplete: this.autocompleteSettings['extvar4'], onBlur: this.onBlur, onFocus: this.onFocus }),
                                        preact_1.h(ErrorMessage_1.ErrorMessage, { item: this.inputs['extvar4'], parentState: parentState })))) : null)));
                    var templatePrimary = (preact_1.h("div", null,
                        templateCommon,
                        preact_1.h("div", { class: "msp-ui-row" },
                            this.inputs['extvar3'] ?
                                (preact_1.h("div", { class: "msp-ui-col-2" },
                                    preact_1.h("div", { class: "msp-ui-form-group" },
                                        preact_1.h(InputLabel_1.InputLabel, { item: this.inputs['extvar3'], parentState: parentState, customClass: 'msp-ui-tooltip-height' }),
                                        preact_1.h(TextInput_1.TextInput, { item: this.inputs['extvar3'], parentState: parentState, setInputClass: this.props.setInputClass, setInputStyle: this.props.setInputStyle, inputOnInput: this.props.inputOnInput, autocomplete: this.autocompleteSettings['extvar3'] }),
                                        preact_1.h(ErrorMessage_1.ErrorMessage, { item: this.inputs['extvar3'], parentState: parentState })))) : null,
                            this.inputs['extvar4'] && !parentState.hideCVV ?
                                (preact_1.h("div", { class: "msp-ui-col-2" },
                                    preact_1.h("div", { class: "msp-ui-form-group" },
                                        preact_1.h(InputLabel_1.InputLabel, { item: this.inputs['extvar4'], parentState: parentState, customClass: 'msp-ui-inline-block msp-ui-tooltip-height' }),
                                        preact_1.h(CreditCardTooltip_1.CreditCardTooltip, { display: this.state.showTooltip, media: this.state.mediaUrl }),
                                        preact_1.h(TextInput_1.TextInput, { item: this.inputs['extvar4'], parentState: parentState, setInputClass: this.props.setInputClass, setInputStyle: this.props.setInputStyle, inputOnInput: this.props.inputOnInput, autocomplete: this.autocompleteSettings['extvar4'], onBlur: this.onBlur, onFocus: this.onFocus }),
                                        preact_1.h(ErrorMessage_1.ErrorMessage, { item: this.inputs['extvar4'], parentState: parentState })))) : null)));
                    return (preact_1.h("div", null, setTemplate()));
                };
                return CreditCardInputs;
            }(preact_1.Component));
            exports.CreditCardInputs = CreditCardInputs;


            /***/ }),

        /***/ "./src/app/components/common/forms/CreditCardTooltip.tsx":
        /*!***************************************************************!*\
  !*** ./src/app/components/common/forms/CreditCardTooltip.tsx ***!
  \***************************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            var __extends = (this && this.__extends) || (function () {
                var extendStatics = function (d, b) {
                    extendStatics = Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
                    return extendStatics(d, b);
                };
                return function (d, b) {
                    extendStatics(d, b);
                    function __() { this.constructor = d; }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
            })();
            Object.defineProperty(exports, "__esModule", { value: true });
            var preact_1 = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
            ;
            var CreditCardTooltip = (function (_super) {
                __extends(CreditCardTooltip, _super);
                function CreditCardTooltip(props) {
                    return _super.call(this, props) || this;
                }
                CreditCardTooltip.prototype.render = function (_a) {
                    var display = _a.display, media = _a.media;
                    return (display ? (preact_1.h("div", { class: "msp-ui-inline-block msp-ui-tooltip-margin" },
                        preact_1.h("span", { class: "msp-ui-inline-block" },
                            preact_1.h("img", { class: "msp-ui-tooltip-image", src: media + '/img/common/svg/icon-cvc.svg' })))) : null);
                };
                return CreditCardTooltip;
            }(preact_1.Component));
            exports.CreditCardTooltip = CreditCardTooltip;


            /***/ }),

        /***/ "./src/app/components/common/forms/inputs/ErrorMessage.tsx":
        /*!*****************************************************************!*\
  !*** ./src/app/components/common/forms/inputs/ErrorMessage.tsx ***!
  \*****************************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            var __extends = (this && this.__extends) || (function () {
                var extendStatics = function (d, b) {
                    extendStatics = Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
                    return extendStatics(d, b);
                };
                return function (d, b) {
                    extendStatics(d, b);
                    function __() { this.constructor = d; }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
            })();
            Object.defineProperty(exports, "__esModule", { value: true });
            var preact_1 = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
            var Locale_1 = __webpack_require__(/*! ../../../../lib/utils/Locale */ "./src/app/lib/utils/Locale.tsx");
            var ErrorMessage = (function (_super) {
                __extends(ErrorMessage, _super);
                function ErrorMessage() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ErrorMessage.prototype.render = function (_a) {
                    var item = _a.item, parentState = _a.parentState;
                    return (preact_1.h("span", null, parentState && parentState.validation.items[item.id] &&
                    parentState.validation.items[item.id]['message'] &&
                    parentState.validation.showErrors ? (preact_1.h("span", { class: "msp-ui-control-error-message", id: "input-error-" + item.id }, Locale_1.Locale.__(parentState.validation.items[item.id]['message']) +
                        (parentState.validation.items[item.id]['suffix'] ? parentState.validation.items[item.id]['suffix'] : ''))) : null));
                };
                return ErrorMessage;
            }(preact_1.Component));
            exports.ErrorMessage = ErrorMessage;


            /***/ }),

        /***/ "./src/app/components/common/forms/inputs/HiddenInput.tsx":
        /*!****************************************************************!*\
  !*** ./src/app/components/common/forms/inputs/HiddenInput.tsx ***!
  \****************************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            var __extends = (this && this.__extends) || (function () {
                var extendStatics = function (d, b) {
                    extendStatics = Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
                    return extendStatics(d, b);
                };
                return function (d, b) {
                    extendStatics(d, b);
                    function __() { this.constructor = d; }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
            })();
            Object.defineProperty(exports, "__esModule", { value: true });
            var preact_1 = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
            var HiddenInput = (function (_super) {
                __extends(HiddenInput, _super);
                function HiddenInput(props) {
                    return _super.call(this, props) || this;
                }
                HiddenInput.prototype.render = function (_a) {
                    var _this = this;
                    var item = _a.item, parentState = _a.parentState;
                    return (item && item['id'] ? (preact_1.h("span", null,
                        preact_1.h("input", { onInput: function (e) { return _this.props.inputOnInput(e, item); }, type: "hidden", value: parentState['gatewayFields'][item['id']] ? parentState['gatewayFields'][item['id']]['value'] : '' }))) : null);
                };
                return HiddenInput;
            }(preact_1.Component));
            exports.HiddenInput = HiddenInput;


            /***/ }),

        /***/ "./src/app/components/common/forms/inputs/InputLabel.tsx":
        /*!***************************************************************!*\
  !*** ./src/app/components/common/forms/inputs/InputLabel.tsx ***!
  \***************************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            var __extends = (this && this.__extends) || (function () {
                var extendStatics = function (d, b) {
                    extendStatics = Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
                    return extendStatics(d, b);
                };
                return function (d, b) {
                    extendStatics(d, b);
                    function __() { this.constructor = d; }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
            })();
            Object.defineProperty(exports, "__esModule", { value: true });
            var preact_1 = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
            var Locale_1 = __webpack_require__(/*! ../../../../lib/utils/Locale */ "./src/app/lib/utils/Locale.tsx");
            var InputLabel = (function (_super) {
                __extends(InputLabel, _super);
                function InputLabel(props) {
                    return _super.call(this, props) || this;
                }
                InputLabel.prototype.render = function (_a) {
                    var item = _a.item, customClass = _a.customClass;
                    return (item && item['label'] ? (preact_1.h("span", { class: "msp-ui-form-label" + (customClass ? ' ' + customClass : '') }, Locale_1.Locale.__(item.label.text))) : null);
                };
                return InputLabel;
            }(preact_1.Component));
            exports.InputLabel = InputLabel;


            /***/ }),

        /***/ "./src/app/components/common/forms/inputs/SelectInput.tsx":
        /*!****************************************************************!*\
  !*** ./src/app/components/common/forms/inputs/SelectInput.tsx ***!
  \****************************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            var __extends = (this && this.__extends) || (function () {
                var extendStatics = function (d, b) {
                    extendStatics = Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
                    return extendStatics(d, b);
                };
                return function (d, b) {
                    extendStatics(d, b);
                    function __() { this.constructor = d; }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
            })();
            Object.defineProperty(exports, "__esModule", { value: true });
            var preact_1 = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
            var SelectInput = (function (_super) {
                __extends(SelectInput, _super);
                function SelectInput(props) {
                    return _super.call(this, props) || this;
                }
                SelectInput.prototype.inputOnInputSelect = function (e, item) {
                    var inputOnInput = this.props.inputOnInput;
                    inputOnInput(e, item);
                };
                SelectInput.prototype.render = function (_a) {
                    var _this = this;
                    var item = _a.item, parentState = _a.parentState, settings = _a.settings;
                    return (item && item['id'] ? (preact_1.h("span", null,
                        preact_1.h("select", { id: "" + item['id'], class: "" + this.props.setInputClass(item), style: "" + this.props.setInputStyle(item), onChange: function (e) { return _this.inputOnInputSelect(e, item); } }, item['options'].map(function (opt) {
                            return (preact_1.h("option", { selected: opt.value && parentState['gatewayFields'][item['id']] && parentState['gatewayFields'][item['id']]['value'] == opt.value, key: opt.value, value: opt.id }, opt.label));
                        })))) : null);
                };
                return SelectInput;
            }(preact_1.Component));
            exports.SelectInput = SelectInput;


            /***/ }),

        /***/ "./src/app/components/common/forms/inputs/TextInput.tsx":
        /*!**************************************************************!*\
  !*** ./src/app/components/common/forms/inputs/TextInput.tsx ***!
  \**************************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            var __extends = (this && this.__extends) || (function () {
                var extendStatics = function (d, b) {
                    extendStatics = Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
                    return extendStatics(d, b);
                };
                return function (d, b) {
                    extendStatics(d, b);
                    function __() { this.constructor = d; }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
            })();
            Object.defineProperty(exports, "__esModule", { value: true });
            var preact_1 = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
            var TextInput = (function (_super) {
                __extends(TextInput, _super);
                function TextInput(props) {
                    var _this = _super.call(this, props) || this;
                    _this.inputOnBlur = function (e, item) {
                        _this.props.onBlur(item, e);
                    };
                    _this.inputOnFocus = function (e, item) {
                        _this.props.onFocus(item, e);
                    };
                    return _this;
                }
                TextInput.prototype.render = function (_a) {
                    var _this = this;
                    var item = _a.item, parentState = _a.parentState, settings = _a.settings;
                    settings = settings || {};
                    return (item && item['id'] ? (preact_1.h("span", null,
                        preact_1.h("input", { class: "" + this.props.setInputClass(item), style: "" + this.props.setInputStyle(item), onInput: function (e) { return _this.props.inputOnInput(e, item); }, type: "text", value: parentState['gatewayFields'][item['id']] ? parentState['gatewayFields'][item['id']]['value'] : '', id: item['id'], maxLength: item['maxlength'] ? item['maxlength'] : 200, placeholder: item['placeholder'], autocomplete: this.props.autocomplete || '', onBlur: this.props.onBlur ? function (e) { return _this.inputOnBlur(e, item); } : null, onFocus: this.props.onFocus ? function (e) { return _this.inputOnFocus(e, item); } : null }))) : null);
                };
                return TextInput;
            }(preact_1.Component));
            exports.TextInput = TextInput;


            /***/ }),

        /***/ "./src/app/components/dropin/App.tsx":
        /*!*******************************************!*\
  !*** ./src/app/components/dropin/App.tsx ***!
  \*******************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            var __extends = (this && this.__extends) || (function () {
                var extendStatics = function (d, b) {
                    extendStatics = Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
                    return extendStatics(d, b);
                };
                return function (d, b) {
                    extendStatics(d, b);
                    function __() { this.constructor = d; }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
            })();
            var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
                function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                return new (P || (P = Promise))(function (resolve, reject) {
                    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                    step((generator = generator.apply(thisArg, _arguments || [])).next());
                });
            };
            var __generator = (this && this.__generator) || function (thisArg, body) {
                var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
                return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
                function verb(n) { return function (v) { return step([n, v]); }; }
                function step(op) {
                    if (f) throw new TypeError("Generator is already executing.");
                    while (_) try {
                        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                        if (y = 0, t) op = [op[0] & 2, t.value];
                        switch (op[0]) {
                            case 0: case 1: t = op; break;
                            case 4: _.label++; return { value: op[1], done: false };
                            case 5: _.label++; y = op[1]; op = [0]; continue;
                            case 7: op = _.ops.pop(); _.trys.pop(); continue;
                            default:
                                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                                if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                                if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                                if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                                if (t[2]) _.ops.pop();
                                _.trys.pop(); continue;
                        }
                        op = body.call(thisArg, _);
                    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
                    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
                }
            };
            Object.defineProperty(exports, "__esModule", { value: true });
            var preact_1 = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
            var preact_i18n_1 = __webpack_require__(/*! preact-i18n */ "./node_modules/preact-i18n/dist/preact-i18n.esm.js");
            var PaymentMethods_1 = __webpack_require__(/*! ./PaymentMethods */ "./src/app/components/dropin/PaymentMethods.tsx");
            var PaymentMethodForm_1 = __webpack_require__(/*! ../common/PaymentMethodForm */ "./src/app/components/common/PaymentMethodForm.tsx");
            var Api_1 = __webpack_require__(/*! ../../lib/Api */ "./src/app/lib/Api.ts");
            var Globals_1 = __webpack_require__(/*! ../../lib/Globals */ "./src/app/lib/Globals.tsx");
            var Utils_1 = __webpack_require__(/*! ../../lib/utils/Utils */ "./src/app/lib/utils/Utils.tsx");
            var UiLoading_1 = __webpack_require__(/*! ../common/UiLoading */ "./src/app/components/common/UiLoading.tsx");
            var Locale_1 = __webpack_require__(/*! ../../lib/utils/Locale */ "./src/app/lib/utils/Locale.tsx");
            var DropinApp = (function (_super) {
                __extends(DropinApp, _super);
                function DropinApp(props) {
                    var _this = _super.call(this, props) || this;
                    _this.state = {
                        appConfig: {},
                        globalSettings: {},
                        gatewayData: {},
                        gateway: {},
                        loading: false,
                        translations: null
                    };
                    _this.globalSettings = {};
                    _this.getMethod = function (data) {
                        if (data === void 0) { data = {}; }
                        return __awaiter(_this, void 0, void 0, function () {
                            var onError, state, order;
                            var _this = this;
                            return __generator(this, function (_a) {
                                onError = this.props.onError;
                                state = this.state;
                                state.loading = true;
                                state.gatewayData = {};
                                this.setState(state);
                                order = this.globalSettings['order'] || {};
                                order['gateway'] = data['gateway'];
                                order['id'] = data['id'];
                                order['browser'] = Utils_1.Utils.getBrowserInfo();
                                Api_1.Api.getMethod(order).then(function (response) {
                                    state.loading = false;
                                    if (response.error_code) {
                                        onError(response);
                                        state.gatewayData = {};
                                    }
                                    else {
                                        state.gatewayData = response;
                                    }
                                    _this.setState(state);
                                    return response;
                                })
                                    .catch(console.error);
                                return [2];
                            });
                        });
                    };
                    var state = _this.state;
                    _this.globalSettings = Globals_1.Globals.getSettings();
                    state.appConfig = props['appConfig'];
                    _this.setState(state);
                    _this.gatewaySelect = _this.gatewaySelect.bind(_this);
                    _this.setLoading = _this.setLoading.bind(_this);
                    _this.setLoading(true);
                    _this.state.translations = Locale_1.Locale.init(_this.globalSettings['locale']);
                    setTimeout(function () {
                        _this.setLoading(false);
                    }, 200);
                    return _this;
                }
                DropinApp.prototype.setLoading = function (set) {
                    if (set === void 0) { set = false; }
                    var state = this.state;
                    state.loading = (set ? true : false);
                    this.setState(state);
                };
                DropinApp.prototype.gatewaySelect = function (method) {
                    if (method === void 0) { method = null; }
                    var state = this.state;
                    if (!method) {
                        state.gateway = {};
                        this.setState(state);
                    }
                    else {
                        state.gateway = method;
                        this.setState(state);
                        this.getMethod(method);
                    }
                };
                DropinApp.prototype.render = function () {
                    return (preact_1.h(preact_i18n_1.IntlProvider, { definition: this.state.translations },
                        preact_1.h("div", { class: "msp-container-ui " + (this.globalSettings['template']['settings'] && this.globalSettings['template']['settings']['embed_mode'] ? 'embed-mode' : '') },
                            preact_1.h("div", null, this.state.loading ?
                                (preact_1.h(UiLoading_1.UiLoading, null))
                                :
                                (preact_1.h("div", null,
                                    !this.state.gateway['id'] &&
                                    this.state.appConfig['gateways']['methods'] &&
                                    this.state.appConfig['gateways']['methods'].length > 0 ?
                                        (preact_1.h("div", null,
                                            preact_1.h(PaymentMethods_1.PaymentMethods, { onLoading: this.setLoading, appEvents: this.props.appEvents, onGatewaySelect: this.gatewaySelect, gateways: this.state.appConfig['gateways'] }))) : null,
                                    this.state.gateway['id'] ? (preact_1.h("div", null,
                                        preact_1.h(PaymentMethodForm_1.PaymentMethodForm, { appEvents: this.props.appEvents, onGatewaySelect: this.gatewaySelect, onLoading: this.setLoading, appConfig: this.props.appConfig, onLoad: this.props.onLoad, onError: this.props.onError, onSubmit: this.props.onSubmit, onSelect: this.props.onSelect, hasErrors: this.props.hasErrors, gatewayData: this.state.gatewayData }))) : null))))));
                };
                return DropinApp;
            }(preact_1.Component));
            exports.DropinApp = DropinApp;


            /***/ }),

        /***/ "./src/app/components/dropin/PaymentMethods.tsx":
        /*!******************************************************!*\
  !*** ./src/app/components/dropin/PaymentMethods.tsx ***!
  \******************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            var __extends = (this && this.__extends) || (function () {
                var extendStatics = function (d, b) {
                    extendStatics = Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
                    return extendStatics(d, b);
                };
                return function (d, b) {
                    extendStatics(d, b);
                    function __() { this.constructor = d; }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
            })();
            Object.defineProperty(exports, "__esModule", { value: true });
            var preact_1 = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
            var PaymentMethodImage_1 = __webpack_require__(/*! ../common/PaymentMethodImage */ "./src/app/components/common/PaymentMethodImage.tsx");
            var PaymentMethods = (function (_super) {
                __extends(PaymentMethods, _super);
                function PaymentMethods(props) {
                    return _super.call(this, props) || this;
                }
                PaymentMethods.prototype.render = function (_a) {
                    var _this = this;
                    var gateways = _a.gateways;
                    var PaymentMethods = gateways['methods'].map(function (item) {
                        return preact_1.h("div", { class: "msp-ui-method-item", onClick: function () { return _this.props.onGatewaySelect(item); }, key: item.id },
                            preact_1.h(PaymentMethodImage_1.PaymentMethodImage, { item: item, cssClass: "msp-ui-method-image" }),
                            preact_1.h("span", null, item.label));
                    });
                    return (preact_1.h("div", { class: "msp-ui-payment-methods" }, PaymentMethods));
                };
                return PaymentMethods;
            }(preact_1.Component));
            exports.PaymentMethods = PaymentMethods;


            /***/ }),

        /***/ "./src/app/components/payment/App.tsx":
        /*!********************************************!*\
  !*** ./src/app/components/payment/App.tsx ***!
  \********************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            var __extends = (this && this.__extends) || (function () {
                var extendStatics = function (d, b) {
                    extendStatics = Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
                    return extendStatics(d, b);
                };
                return function (d, b) {
                    extendStatics(d, b);
                    function __() { this.constructor = d; }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
            })();
            var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
                function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                return new (P || (P = Promise))(function (resolve, reject) {
                    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                    step((generator = generator.apply(thisArg, _arguments || [])).next());
                });
            };
            var __generator = (this && this.__generator) || function (thisArg, body) {
                var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
                return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
                function verb(n) { return function (v) { return step([n, v]); }; }
                function step(op) {
                    if (f) throw new TypeError("Generator is already executing.");
                    while (_) try {
                        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                        if (y = 0, t) op = [op[0] & 2, t.value];
                        switch (op[0]) {
                            case 0: case 1: t = op; break;
                            case 4: _.label++; return { value: op[1], done: false };
                            case 5: _.label++; y = op[1]; op = [0]; continue;
                            case 7: op = _.ops.pop(); _.trys.pop(); continue;
                            default:
                                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                                if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                                if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                                if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                                if (t[2]) _.ops.pop();
                                _.trys.pop(); continue;
                        }
                        op = body.call(thisArg, _);
                    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
                    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
                }
            };
            Object.defineProperty(exports, "__esModule", { value: true });
            var preact_1 = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
            var preact_i18n_1 = __webpack_require__(/*! preact-i18n */ "./node_modules/preact-i18n/dist/preact-i18n.esm.js");
            var Api_1 = __webpack_require__(/*! ../../lib/Api */ "./src/app/lib/Api.ts");
            var PaymentMethodForm_1 = __webpack_require__(/*! ../common/PaymentMethodForm */ "./src/app/components/common/PaymentMethodForm.tsx");
            var Globals_1 = __webpack_require__(/*! ../../lib/Globals */ "./src/app/lib/Globals.tsx");
            var Utils_1 = __webpack_require__(/*! ../../lib/utils/Utils */ "./src/app/lib/utils/Utils.tsx");
            var UiLoading_1 = __webpack_require__(/*! ../common/UiLoading */ "./src/app/components/common/UiLoading.tsx");
            var Locale_1 = __webpack_require__(/*! ../../lib/utils/Locale */ "./src/app/lib/utils/Locale.tsx");
            var PaymentApp = (function (_super) {
                __extends(PaymentApp, _super);
                function PaymentApp(props) {
                    var _this = _super.call(this, props) || this;
                    _this.state = {
                        appConfig: {},
                        gatewayData: {},
                        loading: false,
                        gateway: '',
                        language: {},
                        translations: null
                    };
                    _this.globalSettings = {};
                    _this.getMethod = function () { return __awaiter(_this, void 0, void 0, function () {
                        var onError, state, order;
                        var _this = this;
                        return __generator(this, function (_a) {
                            onError = this.props.onError;
                            state = this.state;
                            state.loading = true;
                            state.gatewayData = {};
                            this.setState(state);
                            order = Globals_1.Globals.getSetting('order');
                            order['gateway'] = state.gateway;
                            order['browser'] = Utils_1.Utils.getBrowserInfo();
                            Api_1.Api.getMethod(order).then(function (response) {
                                state.loading = false;
                                if (response.error_code) {
                                    onError(response);
                                    state.gatewayData = {};
                                }
                                else {
                                    state.gatewayData = response;
                                }
                                _this.setState(state);
                                return response;
                            })
                                .catch(console.error);
                            return [2];
                        });
                    }); };
                    var state = _this.state;
                    state.gateway = props.appConfig['gateway'];
                    state.appConfig = props.appConfig;
                    _this.globalSettings = Globals_1.Globals.getSettings();
                    _this.state.translations = Locale_1.Locale.init(_this.globalSettings['locale']);
                    return _this;
                }
                PaymentApp.prototype.componentDidMount = function () {
                    this.getMethod();
                };
                PaymentApp.prototype.render = function () {
                    return (preact_1.h(preact_i18n_1.IntlProvider, { definition: this.state.translations },
                        preact_1.h("div", { class: "msp-container-ui " + (this.globalSettings['template']['settings'] && this.globalSettings['template']['settings']['embed_mode'] ? 'msp-embed-mode' : '') },
                            preact_1.h("div", null, this.state.loading ?
                                (preact_1.h(UiLoading_1.UiLoading, null))
                                :
                                (preact_1.h(PaymentMethodForm_1.PaymentMethodForm, { appEvents: this.props.appEvents, appConfig: this.props.appConfig, onLoad: this.props.onLoad, onSubmit: this.props.onSubmit, onError: this.props.onError, onSelect: this.props.onSelect, hasErrors: this.props.hasErrors, gatewayData: this.state.gatewayData }))))));
                };
                return PaymentApp;
            }(preact_1.Component));
            exports.PaymentApp = PaymentApp;


            /***/ }),

        /***/ "./src/app/components/redirection/App.tsx":
        /*!************************************************!*\
  !*** ./src/app/components/redirection/App.tsx ***!
  \************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            var __extends = (this && this.__extends) || (function () {
                var extendStatics = function (d, b) {
                    extendStatics = Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
                    return extendStatics(d, b);
                };
                return function (d, b) {
                    extendStatics(d, b);
                    function __() { this.constructor = d; }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
            })();
            Object.defineProperty(exports, "__esModule", { value: true });
            var preact_1 = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
            var preact_i18n_1 = __webpack_require__(/*! preact-i18n */ "./node_modules/preact-i18n/dist/preact-i18n.esm.js");
            var PaymentQr_1 = __webpack_require__(/*! ../common/PaymentQr */ "./src/app/components/common/PaymentQr.tsx");
            var UiLoading_1 = __webpack_require__(/*! ../common/UiLoading */ "./src/app/components/common/UiLoading.tsx");
            var Globals_1 = __webpack_require__(/*! ../../lib/Globals */ "./src/app/lib/Globals.tsx");
            var Locale_1 = __webpack_require__(/*! ../../lib/utils/Locale */ "./src/app/lib/utils/Locale.tsx");
            var RedirectionApp = (function (_super) {
                __extends(RedirectionApp, _super);
                function RedirectionApp(props) {
                    var _this = _super.call(this, props) || this;
                    _this.state = {
                        redirectConfig: null,
                        container: null,
                        loading: false,
                        translations: null
                    };
                    var state = _this.state;
                    state.loading = true;
                    state.redirectConfig = props['redirectConfig'];
                    _this.setState(state);
                    var locale = Globals_1.Globals.getSetting('locale');
                    _this.state.translations = Locale_1.Locale.init(locale);
                    return _this;
                }
                RedirectionApp.prototype.handleRedirect = function () {
                    var container = document.querySelector(this.state.redirectConfig['container']);
                    if (this.state.redirectConfig['order']) {
                        if (this.state.redirectConfig['order']['customer_verification']) {
                            if (this.state.redirectConfig['order']['customer_verification']['type'] == 'form') {
                                var e = document.createElement('div');
                                e.innerHTML = this.state.redirectConfig['order']['customer_verification']['html'];
                                while (e.firstChild) {
                                    container.appendChild(e.firstChild);
                                }
                                var vform = document.querySelector(this.state.redirectConfig['container'] + ' > form');
                                vform['submit']();
                            }
                        }
                        else {
                            if (this.state.redirectConfig['order']['qr_url']) {
                            }
                            else if (this.state.redirectConfig['order']['payment_url']) {
                                window.location.href = this.state.redirectConfig['order']['payment_url'];
                            }
                        }
                    }
                };
                RedirectionApp.prototype.componentDidMount = function () {
                    var _this = this;
                    this.handleRedirect();
                    setTimeout(function () {
                        var state = _this.state;
                        state.loading = false;
                        _this.setState(state);
                    }, 1000);
                };
                RedirectionApp.prototype.render = function () {
                    return (preact_1.h(preact_i18n_1.IntlProvider, { definition: this.state.translations },
                        preact_1.h("div", { class: "msp-container-ui" },
                            preact_1.h("div", null,
                                preact_1.h("div", { class: "msp-redirect-form" }, this.state.loading ?
                                    (preact_1.h(UiLoading_1.UiLoading, null))
                                    :
                                    (preact_1.h("div", null, this.state.redirectConfig['order']['qr_url'] ? (preact_1.h(PaymentQr_1.PaymentQr, { item: this.state.redirectConfig['order'], cssClass: "method-image-qr-code" })) : null)))))));
                };
                return RedirectionApp;
            }(preact_1.Component));
            exports.RedirectionApp = RedirectionApp;


            /***/ }),

        /***/ "./src/app/lib/Api.ts":
        /*!****************************!*\
  !*** ./src/app/lib/Api.ts ***!
  \****************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            var __assign = (this && this.__assign) || function () {
                __assign = Object.assign || function(t) {
                    for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                    }
                    return t;
                };
                return __assign.apply(this, arguments);
            };
            var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
                function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                return new (P || (P = Promise))(function (resolve, reject) {
                    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                    step((generator = generator.apply(thisArg, _arguments || [])).next());
                });
            };
            var __generator = (this && this.__generator) || function (thisArg, body) {
                var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
                return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
                function verb(n) { return function (v) { return step([n, v]); }; }
                function step(op) {
                    if (f) throw new TypeError("Generator is already executing.");
                    while (_) try {
                        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                        if (y = 0, t) op = [op[0] & 2, t.value];
                        switch (op[0]) {
                            case 0: case 1: t = op; break;
                            case 4: _.label++; return { value: op[1], done: false };
                            case 5: _.label++; y = op[1]; op = [0]; continue;
                            case 7: op = _.ops.pop(); _.trys.pop(); continue;
                            default:
                                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                                if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                                if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                                if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                                if (t[2]) _.ops.pop();
                                _.trys.pop(); continue;
                        }
                        op = body.call(thisArg, _);
                    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
                    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
                }
            };
            Object.defineProperty(exports, "__esModule", { value: true });
            var Globals_1 = __webpack_require__(/*! ./Globals */ "./src/app/lib/Globals.tsx");
            var Api = (function () {
                function Api() {
                }
                Api.setPath = function (path, args) {
                    if (args === void 0) { args = null; }
                    var endPoint = Globals_1.Globals.getSetting('API_ENV') + path;
                    return endPoint;
                };
                Api.httpRequest = function (endpoint, method, data) {
                    if (method === void 0) { method = ''; }
                    if (data === void 0) { data = {}; }
                    return __awaiter(void 0, void 0, void 0, function () {
                        var settings, httpConf, apiPath;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    settings = Globals_1.Globals.getSettings();
                                    httpConf = {
                                        headers: {
                                            'Accept': 'application/json, text/plain, */*',
                                            'Content-Type': 'application/json',
                                            'locale': settings['locale'],
                                            'api_token': settings['apiToken']
                                        },
                                        method: (method ? method : 'GET')
                                    };
                                    apiPath = null;
                                    if (httpConf.method == 'GET') {
                                        apiPath = Api.setPath(endpoint, data);
                                    }
                                    else {
                                        httpConf['body'] = JSON.stringify(data);
                                        apiPath = Api.setPath(endpoint);
                                    }
                                    return [4, fetch("" + apiPath, httpConf).then(function (response) { return response.json(); }).catch(function (error) {
                                        return Promise.reject();
                                    })];
                                case 1: return [2, _a.sent()];
                            }
                        });
                    });
                };
                Api.getMethod = function (data) {
                    if (data === void 0) { data = {}; }
                    return __awaiter(void 0, void 0, void 0, function () {
                        var params;
                        return __generator(this, function (_a) {
                            params = __assign({}, data);
                            return [2, Api.httpRequest(Globals_1.Globals.API_ENDPOINTS.CONNECT + '/payments/method', 'POST', params).then(function (response) {
                                return response;
                            })
                                .catch(console.error)];
                        });
                    });
                };
                return Api;
            }());
            exports.Api = Api;


            /***/ }),

        /***/ "./src/app/lib/Globals.tsx":
        /*!*********************************!*\
  !*** ./src/app/lib/Globals.tsx ***!
  \*********************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            var __assign = (this && this.__assign) || function () {
                __assign = Object.assign || function(t) {
                    for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                    }
                    return t;
                };
                return __assign.apply(this, arguments);
            };
            Object.defineProperty(exports, "__esModule", { value: true });
            var Utils_1 = __webpack_require__(/*! ./utils/Utils */ "./src/app/lib/utils/Utils.tsx");
            var Globals = (function () {
                function Globals() {
                }
                Globals.setSettings = function (data) {
                    if (data === void 0) { data = {}; }
                    try {
                        var settings = __assign({}, data);
                        if ('env' in data) {
                            settings['ENV'] = data['env'].toUpperCase();
                        }
                        else {
                            settings['ENV'] = 'LIVE';
                        }
                        settings['appHost'] = Utils_1.Utils.getAppHost();
                        settings['API_ENV'] = this.API_SERVER[settings['ENV']] || this.API_SERVER['LIVE'];
                        settings['template'] = this.setTemplate(settings);
                        if ('envApiEndpoint' in data && settings['envApiEndpoint']) {
                            settings['API_ENV'] = settings['envApiEndpoint'];
                        }
                        settings["API_ENV"] = settings['API_ENV'] || this.API_SERVER["LIVE"];
                        settings['locale'] = settings['order'] &&
                        settings['order']['customer'] &&
                        settings['order']['customer']['locale'] ?
                            settings['order']['customer']['locale'] :
                            Utils_1.Utils.getLocale();
                        settings['keys'] = settings['apiToken'].split('.');
                        settings['encrypt'] = settings['keys'][settings['keys'].length - 1];
                        this.settings = settings;
                    }
                    catch (e) {
                        throw 'Error Setting Configuration';
                    }
                };
                Globals.setTemplate = function (settings) {
                    if (settings === void 0) { settings = {}; }
                    var template = settings['order'] && settings['order']['template'] || {};
                    template['settings'] = template['settings'] || {};
                    return template;
                };
                Globals.getSettings = function () {
                    return this.settings;
                };
                Globals.getSetting = function (setting) {
                    return (setting && this.settings[setting]) ?
                        this.settings[setting] :
                        null;
                };
                Globals.setSetting = function (key, setting) {
                    this.settings[key] = setting;
                };
                Globals.getPaymentData = function (gateway) {
                    if (gateway === void 0) { gateway = null; }
                    var data = Globals.getSetting('paymentData');
                    if (!data) {
                        data = {};
                    }
                    var encrypt = JSON.stringify({
                        gateway: gateway,
                        customer: {
                            browser: Utils_1.Utils.getBrowserInfo()
                        },
                        fields: data['fields'],
                        encrypted: data['encrypted']
                    });
                    encrypt = Utils_1.Utils.base64Encode(encrypt);
                    var res = {
                        gateway: gateway,
                        payment_data: {
                            payload: encrypt,
                        }
                    };
                    return res;
                };
                Globals.settings = {};
                Globals.API_SERVER = {
                    TEST: 'https://testapi.multisafepay.com/v1/',
                    LIVE: 'https://api.multisafepay.com/v1/',
                    LOCAL: 'https://api-10.dev.multisafepay.com/v1/',
                    DEV: 'https://dev.multisafepay.com/v1/'
                };
                Globals.API_ENDPOINTS = {
                    JSON: 'json',
                    CONNECT: 'connect',
                };
                Globals.REDIRECT_MODE = {
                    IFRAME: 'IFRAME',
                    MODAL: 'MODAL',
                    REDIRECT: 'REDIRECT',
                };
                Globals.FORM_TEMPLATES = {
                    CREDITCARD: 'CREDITCARD'
                };
                Globals.CARD_FORMAT_OBJECT = {
                    AMEX: {
                        format: 'NNNN NNNNNN NNNNN',
                        maxlength: 17
                    },
                    VISA: {
                        format: 'NNNN NNNN NNNN NNNN',
                        maxlength: 19
                    },
                    MASTERCARD: {
                        format: 'NNNN NNNN NNNN NNNN',
                        maxlength: 19
                    },
                    JCB: {
                        format: 'NNNN NNNN NNNN NNNN',
                        maxlength: 19
                    },
                    MAESTRO: {
                        hideCVV: true
                    },
                    MISTERCASH: {
                        hideCVV: true
                    }
                };
                return Globals;
            }());
            exports.Globals = Globals;


            /***/ }),

        /***/ "./src/app/lib/utils/Locale.tsx":
        /*!**************************************!*\
  !*** ./src/app/lib/utils/Locale.tsx ***!
  \**************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
                function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                return new (P || (P = Promise))(function (resolve, reject) {
                    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                    step((generator = generator.apply(thisArg, _arguments || [])).next());
                });
            };
            var __generator = (this && this.__generator) || function (thisArg, body) {
                var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
                return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
                function verb(n) { return function (v) { return step([n, v]); }; }
                function step(op) {
                    if (f) throw new TypeError("Generator is already executing.");
                    while (_) try {
                        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                        if (y = 0, t) op = [op[0] & 2, t.value];
                        switch (op[0]) {
                            case 0: case 1: t = op; break;
                            case 4: _.label++; return { value: op[1], done: false };
                            case 5: _.label++; y = op[1]; op = [0]; continue;
                            case 7: op = _.ops.pop(); _.trys.pop(); continue;
                            default:
                                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                                if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                                if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                                if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                                if (t[2]) _.ops.pop();
                                _.trys.pop(); continue;
                        }
                        op = body.call(thisArg, _);
                    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
                    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
                }
            };
            Object.defineProperty(exports, "__esModule", { value: true });
            var Utils_1 = __webpack_require__(/*! ./Utils */ "./src/app/lib/utils/Utils.tsx");
            var Globals_1 = __webpack_require__(/*! ../Globals */ "./src/app/lib/Globals.tsx");
            var Locale = (function () {
                function Locale() {
                }
                Locale.__ = function (key) {
                    if (key === void 0) { key = ''; }
                    var res = key;
                    if (this.LANG_DATA[this.ACTIVE] && this.LANG_DATA[this.ACTIVE][key]) {
                        res = this.LANG_DATA[this.ACTIVE][key];
                    }
                    if (this.LANG_DATA['en'] && this.LANG_DATA['en'][key]) {
                        res = this.LANG_DATA[this.ACTIVE][key];
                    }
                    return res;
                };
                Locale.init = function (lang) {
                    if (lang === void 0) { lang = ''; }
                    if (!lang) {
                        lang = Utils_1.Utils.getLocale();
                    }
                    var locale = '' + lang.replace('-', '_').toLowerCase().split('_')[0];
                    if (this.LANGS.indexOf(locale) == -1) {
                        locale = 'en';
                    }
                    this.LANG_DATA['en'] = __webpack_require__(/*! ../../../assets/i18n/en.json */ "./src/assets/i18n/en.json");
                    if (locale == 'en') {
                        return this.LANG_DATA[locale];
                    }
                    else {
                        return this.loadLanguageDyn(locale);
                    }
                };
                Locale.loadLanguageDyn = function (locale, active) {
                    if (active === void 0) { active = true; }
                    return __awaiter(this, void 0, void 0, function () {
                        var path, filePath;
                        var _this = this;
                        return __generator(this, function (_a) {
                            path = Globals_1.Globals.getSetting('appHost');
                            filePath = path['i18Path'] + '/' + locale + '.json';
                            return [2, fetch(filePath).then(function (response) {
                                if (response) {
                                    return response.json();
                                }
                                else {
                                    return null;
                                }
                            }).then(function (data) {
                                if (data) {
                                    if (active) {
                                        _this.ACTIVE = locale;
                                    }
                                    _this.LANG_DATA[locale] = data;
                                    return _this.LANG_DATA[locale];
                                }
                                else {
                                    return null;
                                }
                            })];
                        });
                    });
                };
                Locale.LANGS = [
                    'en', 'es', 'fr', 'it', 'nl'
                ];
                Locale.ACTIVE = 'en';
                Locale.LANG_DATA = {};
                return Locale;
            }());
            exports.Locale = Locale;


            /***/ }),

        /***/ "./src/app/lib/utils/Utils.tsx":
        /*!*************************************!*\
  !*** ./src/app/lib/utils/Utils.tsx ***!
  \*************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var Globals_1 = __webpack_require__(/*! ../Globals */ "./src/app/lib/Globals.tsx");
            var Utils = (function () {
                function Utils() {
                }
                Utils.loadModule = function (id) {
                    var name = id + '-msp-module';
                    var _script = document.getElementById(name);
                    if (!_script) {
                        var path = Globals_1.Globals.getSetting('appHost');
                        var head = document.getElementsByTagName("head")[0] || document.documentElement;
                        var script = document.createElement("script");
                        script.src = path['assetsPath'] + '/' + id + '.min.js';
                        script.type = "text/javascript";
                        script.async = false;
                        script.id = name;
                        head.insertBefore(script, head.firstChild);
                    }
                };
                Utils.cardMapGateway = function (type) {
                    if (type === void 0) { type = ''; }
                    if (!type) {
                        return type;
                    }
                    var names = {
                        'american-express': 'AMEX'
                    };
                    return (names[type] ? names[type] : type).toUpperCase();
                };
                Utils.browserPlugins = function () {
                    var plugins = {};
                    if (navigator.plugins && navigator.plugins.length) {
                        for (var x = 0; x < navigator.plugins.length; x++) {
                            var plugin_name = navigator.plugins[x].name;
                            if (plugin_name.indexOf('Java(TM)') != -1) {
                                plugins['java'] = true;
                                break;
                            }
                            else if (plugin_name.indexOf('Java ') != -1) {
                                plugins['java'] = true;
                                break;
                            }
                        }
                    }
                    return plugins;
                };
                Utils.getBrowserInfo = function () {
                    var plugins = Utils.browserPlugins();
                    return {
                        java_enabled: (plugins['java'] ? 1 : 0),
                        javascript_enabled: 1,
                        language: navigator.language,
                        screen_color_depth: window.screen.colorDepth,
                        screen_height: window.screen.height,
                        screen_width: window.screen.width,
                        time_zone: (new Date()).getTimezoneOffset(),
                        user_agent: navigator.userAgent,
                        cookies_enabled: (navigator.cookieEnabled ? 1 : 0),
                        platform: navigator.platform,
                    };
                };
                Utils.getAppHost = function () {
                    var target = window['MSPCurrentScript'] || (function () {
                        var _s = document.getElementsByTagName('script');
                        return _s[(_s.length - 1)];
                    })();
                    var parser = document.createElement('a');
                    parser.href = target['src'];
                    var sets = {
                        appHost: parser.origin,
                        basePath: parser.href.substring(0, parser.href.lastIndexOf("/")) + '/',
                    };
                    sets['assetsPath'] = sets.basePath + 'assets';
                    sets['i18Path'] = sets['assetsPath'] + '/i18n';
                    return sets;
                };
                Utils.setEncryption = function (val, keyData) {
                    if (keyData === void 0) { keyData = null; }
                    var lib = 'MSPCrypt';
                    if (!window[lib]) {
                        Utils.loadModule('msp-crypt');
                    }
                    if (!window[lib]) {
                        throw 'Encryption library not loaded';
                    }
                    try {
                        var encrypt = new window[lib]();
                        encrypt.setPublicKey(keyData);
                        var encrypted = encrypt.encrypt(val);
                        return encrypted;
                    }
                    catch (e) {
                    }
                };
                Utils.base64Encode = function (str) {
                    return btoa(unescape(encodeURIComponent(str)));
                };
                Utils.base64Decode = function (str) {
                    return decodeURIComponent(escape(window.atob(str)));
                };
                Utils.isFunction = function (functionToCheck) {
                    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
                };
                Utils.getLocale = function (def) {
                    if (def === void 0) { def = 'en_US'; }
                    return (navigator.languages && navigator.languages.length) ? navigator.languages[0] : (navigator.language || navigator['userLanguage'] || navigator['browserLanguage'] || def);
                };
                Utils.resolveImagePath = function (image, ext) {
                    if (ext === void 0) { ext = '3x'; }
                    return image && image.replace('{scale}', ext).replace('{ext}', 'png');
                };
                Utils.handleFormatPatterns = function (format) {
                    return format.replace(new RegExp('N', 'g'), '9');
                };
                Utils.serializeObj = function (params) {
                    var esc = encodeURIComponent;
                    var query = Object.keys(params)
                        .map(function (k) { return esc(k) + '=' + esc(params[k]); })
                        .join('&');
                    return query;
                };
                Utils.htmlStripTags = function (html) {
                    var tmp = document.createElement("DIV");
                    tmp.innerHTML = html;
                    return tmp.textContent || tmp.innerText || "";
                };
                Utils.checkCardFormats = function (ccType, value) {
                    if (/^(670345|479658)/.test(value.replace(/\s/g, ''))) {
                        var mistercashCardValues = {
                            gaps: [4, 8, 12, 16],
                            lengths: [15, 16, 17, 18, 19],
                            niceType: "Bancontact",
                            patterns: [670345, 479658],
                            type: "mistercash"
                        };
                        ccType.unshift(mistercashCardValues);
                    }
                    return ccType;
                };
                Utils.validateCardNumber = function (ccNumber) {
                    var plainNumber = ccNumber.replace(/\s/g, '');
                    plainNumber = plainNumber.split('').reverse().join('');
                    var size = plainNumber.length;
                    var sum = 0;
                    var digit;
                    for (var i = 0; i < size; i++) {
                        digit = Number(plainNumber[i]);
                        digit = i % 2 != 0 ? digit * 2 : digit;
                        sum += Math.floor(digit / 10);
                        sum += digit % 10;
                    }
                    return (sum % 10 == 0);
                };
                return Utils;
            }());
            exports.Utils = Utils;


            /***/ }),

        /***/ "./src/assets/i18n/en.json":
        /*!*********************************!*\
  !*** ./src/assets/i18n/en.json ***!
  \*********************************/
        /*! exports provided: api_token_required, btn_confirm, Card number, card_expiry_date, card_not_allowed, card_not_valid, card_number_not_valid, container_not_found, Holder, Holder is required, incomplete_card, MM/YY, no_gateways_found, order_required_redirect, payment_instance_exists, required, view_all_payment_methods, wrong_init_type, default */
        /***/ (function(module) {

            module.exports = JSON.parse("{\"api_token_required\":\"ApiToken is required\",\"btn_confirm\":\"Confirm\",\"Card number\":\"Card number\",\"card_expiry_date\":\"Expiry Date\",\"card_not_allowed\":\"Card not allowed\",\"card_not_valid\":\"Invalid card\",\"card_number_not_valid\":\"Card number is not valid\",\"container_not_found\":\"Container not found\",\"Holder\":\"Holder\",\"Holder is required\":\"Holder is required\",\"incomplete_card\":\"Incomplete card number\",\"MM/YY\":\"MM/YY\",\"no_gateways_found\":\"No gateways found\",\"order_required_redirect\":\"Order is required to initialize redirection\",\"payment_instance_exists\":\"Payment instance already exists\",\"required\":\"Required\",\"view_all_payment_methods\":\"View All Payment Methods\",\"wrong_init_type\":\"Wrong init type\"}");

            /***/ }),

        /***/ "./src/bootstrap.tsx":
        /*!***************************!*\
  !*** ./src/bootstrap.tsx ***!
  \***************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            var MultiSafepay_1 = __webpack_require__(/*! ./app/MultiSafepay */ "./src/app/MultiSafepay.tsx");
            __webpack_require__(/*! ./styles/app.less */ "./src/styles/app.less");
            window['MultiSafepay'] = MultiSafepay_1.MultiSafepay;


            /***/ }),

        /***/ "./src/styles/app.less":
        /*!*****************************!*\
  !*** ./src/styles/app.less ***!
  \*****************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            module.exports = __webpack_require__.p + "components.css";

            /***/ })

        /******/ });
