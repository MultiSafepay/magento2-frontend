/*! For license information please see components.js.LICENSE.txt */
!(function (t) {
    var e = {};
    function n(r) {
        if (e[r]) return e[r].exports;
        var i = (e[r] = { i: r, l: !1, exports: {} });
        return t[r].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
    }
    (n.m = t),
        (n.c = e),
        (n.d = function (t, e, r) {
            n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: r });
        }),
        (n.r = function (t) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 });
        }),
        (n.t = function (t, e) {
            if ((1 & e && (t = n(t)), 8 & e)) return t;
            if (4 & e && "object" == typeof t && t && t.__esModule) return t;
            var r = Object.create(null);
            if ((n.r(r), Object.defineProperty(r, "default", { enumerable: !0, value: t }), 2 & e && "string" != typeof t))
                for (var i in t)
                    n.d(
                        r,
                        i,
                        function (e) {
                            return t[e];
                        }.bind(null, i)
                    );
            return r;
        }),
        (n.n = function (t) {
            var e =
                t && t.__esModule
                    ? function () {
                        return t.default;
                    }
                    : function () {
                        return t;
                    };
            return n.d(e, "a", e), e;
        }),
        (n.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e);
        }),
        (n.p = ""),
        n((n.s = 15));
})([
    function (t, e, n) {
        "use strict";
        n.r(e),
            n.d(e, "render", function () {
                return j;
            }),
            n.d(e, "hydrate", function () {
                return k;
            }),
            n.d(e, "createElement", function () {
                return y;
            }),
            n.d(e, "h", function () {
                return y;
            }),
            n.d(e, "Fragment", function () {
                return _;
            }),
            n.d(e, "createRef", function () {
                return v;
            }),
            n.d(e, "isValidElement", function () {
                return i;
            }),
            n.d(e, "Component", function () {
                return m;
            }),
            n.d(e, "cloneElement", function () {
                return R;
            }),
            n.d(e, "createContext", function () {
                return F;
            }),
            n.d(e, "toChildArray", function () {
                return I;
            }),
            n.d(e, "_unmount", function () {
                return N;
            }),
            n.d(e, "options", function () {
                return r;
            });
        var r,
            i,
            o,
            a,
            s,
            u,
            l,
            p = {},
            c = [],
            d = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;
        function f(t, e) {
            for (var n in e) t[n] = e[n];
            return t;
        }
        function h(t) {
            var e = t.parentNode;
            e && e.removeChild(t);
        }
        function y(t, e, n) {
            var r,
                i,
                o,
                a,
                s = arguments;
            if (((e = f({}, e)), arguments.length > 3)) for (n = [n], r = 3; r < arguments.length; r++) n.push(s[r]);
            if ((null != n && (e.children = n), null != t && null != t.defaultProps)) for (i in t.defaultProps) void 0 === e[i] && (e[i] = t.defaultProps[i]);
            return (a = e.key), null != (o = e.ref) && delete e.ref, null != a && delete e.key, g(t, e, a, o);
        }
        function g(t, e, n, i) {
            var o = { type: t, props: e, key: n, ref: i, __k: null, __p: null, __b: 0, __e: null, l: null, __c: null, constructor: void 0 };
            return r.vnode && r.vnode(o), o;
        }
        function v() {
            return {};
        }
        function _(t) {
            return t.children;
        }
        function m(t, e) {
            (this.props = t), (this.context = e);
        }
        function b(t, e) {
            if (null == e) return t.__p ? b(t.__p, t.__p.__k.indexOf(t) + 1) : null;
            for (var n; e < t.__k.length; e++) if (null != (n = t.__k[e]) && null != n.__e) return n.__e;
            return "function" == typeof t.type ? b(t) : null;
        }
        function w(t) {
            var e, n;
            if (null != (t = t.__p) && null != t.__c) {
                for (t.__e = t.__c.base = null, e = 0; e < t.__k.length; e++)
                    if (null != (n = t.__k[e]) && null != n.__e) {
                        t.__e = t.__c.base = n.__e;
                        break;
                    }
                return w(t);
            }
        }
        function S(t) {
            ((!t.__d && (t.__d = !0) && 1 === o.push(t)) || s !== r.debounceRendering) && ((s = r.debounceRendering), (r.debounceRendering || a)(C));
        }
        function C() {
            var t, e, n, r, i, a, s, u;
            for (
                o.sort(function (t, e) {
                    return e.__v.__b - t.__v.__b;
                });
                (t = o.pop());

            )
                t.__d &&
                ((n = void 0),
                    (r = void 0),
                    (a = (i = (e = t).__v).__e),
                    (s = e.__P),
                    (u = e.u),
                    (e.u = !1),
                s && ((n = []), (r = A(s, i, f({}, i), e.__n, void 0 !== s.ownerSVGElement, null, n, u, null == a ? b(i) : a)), T(n, i), r != a && w(i)));
        }
        function E(t, e, n, r, i, o, a, s, u) {
            var l,
                d,
                f,
                y,
                g,
                v,
                _,
                m = (n && n.__k) || c,
                w = m.length;
            if (
                (s == p && (s = null != o ? o[0] : w ? b(n, 0) : null),
                    (l = 0),
                    (e.__k = I(e.__k, function (n) {
                        if (null != n) {
                            if (((n.__p = e), (n.__b = e.__b + 1), null === (f = m[l]) || (f && n.key == f.key && n.type === f.type))) m[l] = void 0;
                            else
                                for (d = 0; d < w; d++) {
                                    if ((f = m[d]) && n.key == f.key && n.type === f.type) {
                                        m[d] = void 0;
                                        break;
                                    }
                                    f = null;
                                }
                            if (((y = A(t, n, (f = f || p), r, i, o, a, null, s, u)), (d = n.ref) && f.ref != d && (_ || (_ = [])).push(d, n.__c || y, n), null != y)) {
                                if ((null == v && (v = y), null != n.l)) (y = n.l), (n.l = null);
                                else if (o == f || y != s || null == y.parentNode) {
                                    t: if (null == s || s.parentNode !== t) t.appendChild(y);
                                    else {
                                        for (g = s, d = 0; (g = g.nextSibling) && d < w; d += 2) if (g == y) break t;
                                        t.insertBefore(y, s);
                                    }
                                    "option" == e.type && (t.value = "");
                                }
                                (s = y.nextSibling), "function" == typeof e.type && (e.l = y);
                            }
                        }
                        return l++, n;
                    })),
                    (e.__e = v),
                null != o && "function" != typeof e.type)
            )
                for (l = o.length; l--; ) null != o[l] && h(o[l]);
            for (l = w; l--; ) null != m[l] && N(m[l], m[l]);
            if (_) for (l = 0; l < _.length; l++) M(_[l], _[++l], _[++l]);
        }
        function I(t, e, n) {
            if ((null == n && (n = []), null == t || "boolean" == typeof t)) e && n.push(e(null));
            else if (Array.isArray(t)) for (var r = 0; r < t.length; r++) I(t[r], e, n);
            else
                n.push(
                    e
                        ? e(
                        (function (t) {
                            if (null == t || "boolean" == typeof t) return null;
                            if ("string" == typeof t || "number" == typeof t) return g(null, t, null, null);
                            if (null != t.__e || null != t.__c) {
                                var e = g(t.type, t.props, t.key, null);
                                return (e.__e = t.__e), e;
                            }
                            return t;
                        })(t)
                        )
                        : t
                );
            return n;
        }
        function O(t, e, n) {
            "-" === e[0] ? t.setProperty(e, n) : (t[e] = "number" == typeof n && !1 === d.test(e) ? n + "px" : null == n ? "" : n);
        }
        function x(t, e, n, r, i) {
            var o, a, s, u, l;
            if ("key" === (e = i ? ("className" === e ? "class" : e) : "class" === e ? "className" : e) || "children" === e);
            else if ("style" === e)
                if (((o = t.style), "string" == typeof n)) o.cssText = n;
                else {
                    if (("string" == typeof r && ((o.cssText = ""), (r = null)), r)) for (a in r) (n && a in n) || O(o, a, "");
                    if (n) for (s in n) (r && n[s] === r[s]) || O(o, s, n[s]);
                }
            else
                "o" === e[0] && "n" === e[1]
                    ? ((u = e !== (e = e.replace(/Capture$/, ""))), (l = e.toLowerCase()), (e = (l in t ? l : e).slice(2)), n ? (r || t.addEventListener(e, P, u), ((t.t || (t.t = {}))[e] = n)) : t.removeEventListener(e, P, u))
                    : "list" !== e && "tagName" !== e && "form" !== e && !i && e in t
                    ? (t[e] = null == n ? "" : n)
                    : "function" != typeof n &&
                    "dangerouslySetInnerHTML" !== e &&
                    (e !== (e = e.replace(/^xlink:?/, ""))
                        ? null == n || !1 === n
                            ? t.removeAttributeNS("http://www.w3.org/1999/xlink", e.toLowerCase())
                            : t.setAttributeNS("http://www.w3.org/1999/xlink", e.toLowerCase(), n)
                        : null == n || !1 === n
                            ? t.removeAttribute(e)
                            : t.setAttribute(e, n));
        }
        function P(t) {
            return this.t[t.type](r.event ? r.event(t) : t);
        }
        function A(t, e, n, i, o, a, s, u, l, p) {
            var c,
                d,
                h,
                y,
                g,
                v,
                b,
                w,
                S,
                C,
                O = e.type;
            if (void 0 !== e.constructor) return null;
            (c = r.__b) && c(e);
            try {
                t: if ("function" == typeof O) {
                    if (
                        ((w = e.props),
                            (S = (c = O.contextType) && i[c.__c]),
                            (C = c ? (S ? S.props.value : c.__p) : i),
                            n.__c
                                ? (b = (d = e.__c = n.__c).__p = d.__E)
                                : ("prototype" in O && O.prototype.render ? (e.__c = d = new O(w, C)) : ((e.__c = d = new m(w, C)), (d.constructor = O), (d.render = D)),
                                S && S.sub(d),
                                    (d.props = w),
                                d.state || (d.state = {}),
                                    (d.context = C),
                                    (d.__n = i),
                                    (h = d.__d = !0),
                                    (d.__h = [])),
                        null == d.__s && (d.__s = d.state),
                        null != O.getDerivedStateFromProps && f(d.__s == d.state ? (d.__s = f({}, d.__s)) : d.__s, O.getDerivedStateFromProps(w, d.__s)),
                            h)
                    )
                        null == O.getDerivedStateFromProps && null != d.componentWillMount && d.componentWillMount(), null != d.componentDidMount && s.push(d);
                    else {
                        if (
                            (null == O.getDerivedStateFromProps && null == u && null != d.componentWillReceiveProps && d.componentWillReceiveProps(w, C), !u && null != d.shouldComponentUpdate && !1 === d.shouldComponentUpdate(w, d.__s, C))
                        ) {
                            for (d.props = w, d.state = d.__s, d.__d = !1, d.__v = e, e.__e = null != l ? (l !== n.__e ? l : n.__e) : null, e.__k = n.__k, c = 0; c < e.__k.length; c++) e.__k[c] && (e.__k[c].__p = e);
                            break t;
                        }
                        null != d.componentWillUpdate && d.componentWillUpdate(w, d.__s, C);
                    }
                    for (
                        y = d.props,
                            g = d.state,
                            d.context = C,
                            d.props = w,
                            d.state = d.__s,
                        (c = r.__r) && c(e),
                            d.__d = !1,
                            d.__v = e,
                            d.__P = t,
                            c = d.render(d.props, d.state, d.context),
                            e.__k = I(null != c && c.type == _ && null == c.key ? c.props.children : c),
                        null != d.getChildContext && (i = f(f({}, i), d.getChildContext())),
                        h || null == d.getSnapshotBeforeUpdate || (v = d.getSnapshotBeforeUpdate(y, g)),
                            E(t, e, n, i, o, a, s, l, p),
                            d.base = e.__e;
                        (c = d.__h.pop());

                    )
                        d.__s && (d.state = d.__s), c.call(d);
                    h || null == y || null == d.componentDidUpdate || d.componentDidUpdate(y, g, v), b && (d.__E = d.__p = null);
                } else e.__e = L(n.__e, e, n, i, o, a, s, p);
                (c = r.diffed) && c(e);
            } catch (t) {
                r.__e(t, e, n);
            }
            return e.__e;
        }
        function T(t, e) {
            for (var n; (n = t.pop()); )
                try {
                    n.componentDidMount();
                } catch (t) {
                    r.__e(t, n.__v);
                }
            r.__c && r.__c(e);
        }
        function L(t, e, n, r, i, o, a, s) {
            var u,
                l,
                d,
                f,
                h = n.props,
                y = e.props;
            if (((i = "svg" === e.type || i), null == t && null != o))
                for (u = 0; u < o.length; u++)
                    if (null != (l = o[u]) && (null === e.type ? 3 === l.nodeType : l.localName === e.type)) {
                        (t = l), (o[u] = null);
                        break;
                    }
            if (null == t) {
                if (null === e.type) return document.createTextNode(y);
                (t = i ? document.createElementNS("http://www.w3.org/2000/svg", e.type) : document.createElement(e.type)), (o = null);
            }
            return (
                null === e.type
                    ? h !== y && (null != o && (o[o.indexOf(t)] = null), (t.data = y))
                    : e !== n &&
                    (null != o && (o = c.slice.call(t.childNodes)),
                        (d = (h = n.props || p).dangerouslySetInnerHTML),
                        (f = y.dangerouslySetInnerHTML),
                    s || ((f || d) && ((f && d && f.__html == d.__html) || (t.innerHTML = (f && f.__html) || ""))),
                        (function (t, e, n, r, i) {
                            var o;
                            for (o in n) o in e || x(t, o, null, n[o], r);
                            for (o in e) (i && "function" != typeof e[o]) || "value" === o || "checked" === o || n[o] === e[o] || x(t, o, e[o], n[o], r);
                        })(t, y, h, i, s),
                        (e.__k = e.props.children),
                    f || E(t, e, n, r, "foreignObject" !== e.type && i, o, a, p, s),
                    s || ("value" in y && void 0 !== y.value && y.value !== t.value && (t.value = null == y.value ? "" : y.value), "checked" in y && void 0 !== y.checked && y.checked !== t.checked && (t.checked = y.checked))),
                    t
            );
        }
        function M(t, e, n) {
            try {
                "function" == typeof t ? t(e) : (t.current = e);
            } catch (t) {
                r.__e(t, n);
            }
        }
        function N(t, e, n) {
            var i, o, a;
            if ((r.unmount && r.unmount(t), (i = t.ref) && M(i, null, e), n || "function" == typeof t.type || (n = null != (o = t.__e)), (t.__e = t.l = null), null != (i = t.__c))) {
                if (i.componentWillUnmount)
                    try {
                        i.componentWillUnmount();
                    } catch (t) {
                        r.__e(t, e);
                    }
                i.base = i.__P = null;
            }
            if ((i = t.__k)) for (a = 0; a < i.length; a++) i[a] && N(i[a], e, n);
            null != o && h(o);
        }
        function D(t, e, n) {
            return this.constructor(t, n);
        }
        function j(t, e, n) {
            var i, o, a;
            r.__p && r.__p(t, e),
                (o = (i = n === u) ? null : (n && n.__k) || e.__k),
                (t = y(_, null, [t])),
                (a = []),
                A(e, i ? (e.__k = t) : ((n || e).__k = t), o || p, p, void 0 !== e.ownerSVGElement, n && !i ? [n] : o ? null : c.slice.call(e.childNodes), a, !1, n || p, i),
                T(a, t);
        }
        function k(t, e) {
            j(t, e, u);
        }
        function R(t, e) {
            return (e = f(f({}, t.props), e)), arguments.length > 2 && (e.children = c.slice.call(arguments, 2)), g(t.type, e, e.key || t.key, e.ref || t.ref);
        }
        function F(t) {
            var e = {},
                n = {
                    __c: "__cC" + l++,
                    __p: t,
                    Consumer: function (t, e) {
                        return t.children(e);
                    },
                    Provider: function (t) {
                        var r,
                            i = this;
                        return (
                            this.getChildContext ||
                            ((r = []),
                                (this.getChildContext = function () {
                                    return (e[n.__c] = i), e;
                                }),
                                (this.shouldComponentUpdate = function (i) {
                                    t.value !== i.value &&
                                    ((e[n.__c].props.value = i.value),
                                        r.some(function (t) {
                                            t.__P && ((t.context = i.value), S(t));
                                        }));
                                }),
                                (this.sub = function (t) {
                                    r.push(t);
                                    var e = t.componentWillUnmount;
                                    t.componentWillUnmount = function () {
                                        r.splice(r.indexOf(t), 1), e && e.call(t);
                                    };
                                })),
                                t.children
                        );
                    },
                };
            return (n.Consumer.contextType = n), n;
        }
        (r = {}),
            (i = function (t) {
                return null != t && void 0 === t.constructor;
            }),
            (m.prototype.setState = function (t, e) {
                var n = (this.__s !== this.state && this.__s) || (this.__s = f({}, this.state));
                ("function" != typeof t || (t = t(n, this.props))) && f(n, t), null != t && this.__v && ((this.u = !1), e && this.__h.push(e), S(this));
            }),
            (m.prototype.forceUpdate = function (t) {
                this.__v && (t && this.__h.push(t), (this.u = !0), S(this));
            }),
            (m.prototype.render = _),
            (o = []),
            (a = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout),
            (s = r.debounceRendering),
            (r.__e = function (t, e, n) {
                for (var r; (e = e.__p); )
                    if ((r = e.__c) && !r.__p)
                        try {
                            if (r.constructor && null != r.constructor.getDerivedStateFromError) r.setState(r.constructor.getDerivedStateFromError(t));
                            else {
                                if (null == r.componentDidCatch) continue;
                                r.componentDidCatch(t);
                            }
                            return S((r.__E = r));
                        } catch (e) {
                            t = e;
                        }
                throw t;
            }),
            (u = p),
            (l = 0);
    },
    function (t, e, n) {
        "use strict";
        var r =
            (this && this.__assign) ||
            function () {
                return (r =
                    Object.assign ||
                    function (t) {
                        for (var e, n = 1, r = arguments.length; n < r; n++) for (var i in (e = arguments[n])) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                        return t;
                    }).apply(this, arguments);
            };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var i = n(3),
            o = (function () {
                function t() {}
                return (
                    (t.setSettings = function (t) {
                        void 0 === t && (t = {});
                        try {
                            var e = r({}, t);
                            (e.ENV = "env" in t ? t.env.toUpperCase() : "LIVE"),
                                (e.appHost = i.Utils.getAppHost()),
                                (e.API_ENV = this.API_SERVER[e.ENV] || this.API_SERVER.LIVE),
                                (e.template = this.setTemplate(e)),
                            "envApiEndpoint" in t && e.envApiEndpoint && (e.API_ENV = e.envApiEndpoint),
                                (e.API_ENV = e.API_ENV || this.API_SERVER.LIVE),
                                (e.locale = e.order && e.order.customer && e.order.customer.locale ? e.order.customer.locale : i.Utils.getLocale()),
                                (e.keys = e.apiToken.split(".")),
                                (e.encrypt = e.keys[e.keys.length - 1]),
                                (this.settings = e);
                        } catch (t) {
                            throw "Error Setting Configuration";
                        }
                    }),
                        (t.setTemplate = function (t) {
                            void 0 === t && (t = {});
                            var e = (t.order && t.order.template) || {};
                            return (e.settings = e.settings || {}), e;
                        }),
                        (t.getSettings = function () {
                            return this.settings;
                        }),
                        (t.getSetting = function (t) {
                            return t && this.settings[t] ? this.settings[t] : null;
                        }),
                        (t.setSetting = function (t, e) {
                            this.settings[t] = e;
                        }),
                        (t.getPaymentData = function (e) {
                            void 0 === e && (e = null);
                            var n = t.getSetting("paymentData");
                            n || (n = {});
                            var r = JSON.stringify({ gateway: e, customer: { browser: i.Utils.getBrowserInfo() }, fields: n.fields, encrypted: n.encrypted });
                            return { gateway: e, payment_data: { payload: (r = i.Utils.base64Encode(r)) } };
                        }),
                        (t.settings = {}),
                        (t.API_SERVER = { TEST: "https://testapi.multisafepay.com/v1/", LIVE: "https://api.multisafepay.com/v1/" }),
                        (t.API_ENDPOINTS = { JSON: "json", CONNECT: "connect" }),
                        (t.REDIRECT_MODE = { IFRAME: "IFRAME", MODAL: "MODAL", REDIRECT: "REDIRECT" }),
                        (t.FORM_TEMPLATES = { CREDITCARD: "CREDITCARD" }),
                        (t.CARD_FORMAT_OBJECT = {
                            AMEX: { format: "NNNN NNNNNN NNNNN", maxlength: 17 },
                            VISA: { format: "NNNN NNNN NNNN NNNN", maxlength: 19 },
                            MASTERCARD: { format: "NNNN NNNN NNNN NNNN", maxlength: 19 },
                            JCB: { format: "NNNN NNNN NNNN NNNN", maxlength: 19 },
                            MAESTRO: { hideCVV: !0 },
                            MISTERCASH: { hideCVV: !0 },
                        }),
                        t
                );
            })();
        e.Globals = o;
    },
    function (t, e, n) {
        "use strict";
        var r =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
                return new (n || (n = Promise))(function (i, o) {
                    function a(t) {
                        try {
                            u(r.next(t));
                        } catch (t) {
                            o(t);
                        }
                    }
                    function s(t) {
                        try {
                            u(r.throw(t));
                        } catch (t) {
                            o(t);
                        }
                    }
                    function u(t) {
                        var e;
                        t.done
                            ? i(t.value)
                            : ((e = t.value),
                                e instanceof n
                                    ? e
                                    : new n(function (t) {
                                        t(e);
                                    })).then(a, s);
                    }
                    u((r = r.apply(t, e || [])).next());
                });
            },
            i =
                (this && this.__generator) ||
                function (t, e) {
                    var n,
                        r,
                        i,
                        o,
                        a = {
                            label: 0,
                            sent: function () {
                                if (1 & i[0]) throw i[1];
                                return i[1];
                            },
                            trys: [],
                            ops: [],
                        };
                    return (
                        (o = { next: s(0), throw: s(1), return: s(2) }),
                        "function" == typeof Symbol &&
                        (o[Symbol.iterator] = function () {
                            return this;
                        }),
                            o
                    );
                    function s(o) {
                        return function (s) {
                            return (function (o) {
                                if (n) throw new TypeError("Generator is already executing.");
                                for (; a; )
                                    try {
                                        if (((n = 1), r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done)) return i;
                                        switch (((r = 0), i && (o = [2 & o[0], i.value]), o[0])) {
                                            case 0:
                                            case 1:
                                                i = o;
                                                break;
                                            case 4:
                                                return a.label++, { value: o[1], done: !1 };
                                            case 5:
                                                a.label++, (r = o[1]), (o = [0]);
                                                continue;
                                            case 7:
                                                (o = a.ops.pop()), a.trys.pop();
                                                continue;
                                            default:
                                                if (!((i = a.trys), (i = i.length > 0 && i[i.length - 1]) || (6 !== o[0] && 2 !== o[0]))) {
                                                    a = 0;
                                                    continue;
                                                }
                                                if (3 === o[0] && (!i || (o[1] > i[0] && o[1] < i[3]))) {
                                                    a.label = o[1];
                                                    break;
                                                }
                                                if (6 === o[0] && a.label < i[1]) {
                                                    (a.label = i[1]), (i = o);
                                                    break;
                                                }
                                                if (i && a.label < i[2]) {
                                                    (a.label = i[2]), a.ops.push(o);
                                                    break;
                                                }
                                                i[2] && a.ops.pop(), a.trys.pop();
                                                continue;
                                        }
                                        o = e.call(t, a);
                                    } catch (t) {
                                        (o = [6, t]), (r = 0);
                                    } finally {
                                        n = i = 0;
                                    }
                                if (5 & o[0]) throw o[1];
                                return { value: o[0] ? o[1] : void 0, done: !0 };
                            })([o, s]);
                        };
                    }
                };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var o = n(3),
            a = n(1),
            s = (function () {
                function t() {}
                return (
                    (t.__ = function (t) {
                        void 0 === t && (t = "");
                        var e = t;
                        return this.LANG_DATA[this.ACTIVE] && this.LANG_DATA[this.ACTIVE][t] && (e = this.LANG_DATA[this.ACTIVE][t]), this.LANG_DATA.en && this.LANG_DATA.en[t] && (e = this.LANG_DATA[this.ACTIVE][t]), e;
                    }),
                        (t.init = function (t) {
                            void 0 === t && (t = ""), t || (t = o.Utils.getLocale());
                            var e = "" + t.replace("-", "_").toLowerCase().split("_")[0];
                            return -1 == this.LANGS.indexOf(e) && (e = "en"), (this.LANG_DATA.en = n(20)), "en" == e ? this.LANG_DATA[e] : this.loadLanguageDyn(e);
                        }),
                        (t.loadLanguageDyn = function (t, e) {
                            return (
                                void 0 === e && (e = !0),
                                    r(this, void 0, void 0, function () {
                                        var n,
                                            r,
                                            o = this;
                                        return i(this, function (i) {
                                            return (
                                                (n = a.Globals.getSetting("appHost")),
                                                    (r = n.i18Path + "/" + t + ".json"),
                                                    [
                                                        2,
                                                        fetch(r)
                                                            .then(function (t) {
                                                                return t ? t.json() : null;
                                                            })
                                                            .then(function (n) {
                                                                return n ? (e && (o.ACTIVE = t), (o.LANG_DATA[t] = n), o.LANG_DATA[t]) : null;
                                                            }),
                                                    ]
                                            );
                                        });
                                    })
                            );
                        }),
                        (t.LANGS = ["en", "es", "fr", "it", "nl"]),
                        (t.ACTIVE = "en"),
                        (t.LANG_DATA = {}),
                        t
                );
            })();
        e.Locale = s;
    },
    function (t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 });
        var r = n(1),
            i = (function () {
                function t() {}
                return (
                    (t.loadModule = function (t) {
                        var e = t + "-msp-module";
                        if (!document.getElementById(e)) {
                            var n = r.Globals.getSetting("appHost"),
                                i = document.getElementsByTagName("head")[0] || document.documentElement,
                                o = document.createElement("script");
                            (o.src = n.assetsPath + "/" + t + ".min.js"), (o.type = "text/javascript"), (o.async = !1), (o.id = e), i.insertBefore(o, i.firstChild);
                        }
                    }),
                        (t.cardMapGateway = function (t) {
                            if ((void 0 === t && (t = ""), !t)) return t;
                            var e = { "american-express": "AMEX" };
                            return (e[t] ? e[t] : t).toUpperCase();
                        }),
                        (t.browserPlugins = function () {
                            var t = {};
                            if (navigator.plugins && navigator.plugins.length)
                                for (var e = 0; e < navigator.plugins.length; e++) {
                                    var n = navigator.plugins[e].name;
                                    if (-1 != n.indexOf("Java(TM)")) {
                                        t.java = !0;
                                        break;
                                    }
                                    if (-1 != n.indexOf("Java ")) {
                                        t.java = !0;
                                        break;
                                    }
                                }
                            return t;
                        }),
                        (t.getBrowserInfo = function () {
                            return {
                                java_enabled: t.browserPlugins().java ? 1 : 0,
                                javascript_enabled: 1,
                                language: navigator.language,
                                screen_color_depth: window.screen.colorDepth,
                                screen_height: window.screen.height,
                                screen_width: window.screen.width,
                                time_zone: new Date().getTimezoneOffset(),
                                user_agent: navigator.userAgent,
                                cookies_enabled: navigator.cookieEnabled ? 1 : 0,
                                platform: navigator.platform,
                            };
                        }),
                        (t.getAppHost = function () {
                            var t,
                                e = window.MSPCurrentScript || (t = document.getElementsByTagName("script"))[t.length - 1],
                                n = document.createElement("a");
                            n.href = e.src;
                            var r = { appHost: n.origin, basePath: n.href.substring(0, n.href.lastIndexOf("/")) + "/" };
                            return (r.assetsPath = r.basePath + "assets"), (r.i18Path = r.assetsPath + "/i18n"), r;
                        }),
                        (t.setEncryption = function (e, n) {
                            void 0 === n && (n = null);
                            var r = "MSPCrypt";
                            if ((window[r] || t.loadModule("msp-crypt"), !window[r])) throw "Encryption library not loaded";
                            try {
                                var i = new window[r]();
                                return i.setPublicKey(n), i.encrypt(e);
                            } catch (t) {}
                        }),
                        (t.base64Encode = function (t) {
                            return btoa(unescape(encodeURIComponent(t)));
                        }),
                        (t.base64Decode = function (t) {
                            return decodeURIComponent(escape(window.atob(t)));
                        }),
                        (t.isFunction = function (t) {
                            return t && "[object Function]" === {}.toString.call(t);
                        }),
                        (t.getLocale = function (t) {
                            return void 0 === t && (t = "en_US"), navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language || navigator.userLanguage || navigator.browserLanguage || t;
                        }),
                        (t.resolveImagePath = function (t, e) {
                            return void 0 === e && (e = "3x"), t && t.replace("{scale}", e).replace("{ext}", "png");
                        }),
                        (t.handleFormatPatterns = function (t) {
                            return t.replace(new RegExp("N", "g"), "9");
                        }),
                        (t.serializeObj = function (t) {
                            var e = encodeURIComponent;
                            return Object.keys(t)
                                .map(function (n) {
                                    return e(n) + "=" + e(t[n]);
                                })
                                .join("&");
                        }),
                        (t.htmlStripTags = function (t) {
                            var e = document.createElement("DIV");
                            return (e.innerHTML = t), e.textContent || e.innerText || "";
                        }),
                        (t.checkCardFormats = function (t, e) {
                            if (/^(670345|479658)/.test(e.replace(/\s/g, ""))) {
                                t.unshift({ gaps: [4, 8, 12, 16], lengths: [15, 16, 17, 18, 19], niceType: "Bancontact", patterns: [670345, 479658], type: "mistercash" });
                            }
                            return t;
                        }),
                        t
                );
            })();
        e.Utils = i;
    },
    function (t, e, n) {
        "use strict";
        var r,
            i =
                (this && this.__extends) ||
                ((r = function (t, e) {
                    return (r =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function (t, e) {
                                t.__proto__ = e;
                            }) ||
                        function (t, e) {
                            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                        })(t, e);
                }),
                    function (t, e) {
                        function n() {
                            this.constructor = t;
                        }
                        r(t, e), (t.prototype = null === e ? Object.create(e) : ((n.prototype = e.prototype), new n()));
                    });
        Object.defineProperty(e, "__esModule", { value: !0 });
        var o = n(0),
            a = (function (t) {
                function e() {
                    return (null !== t && t.apply(this, arguments)) || this;
                }
                return (
                    i(e, t),
                        (e.prototype.render = function (t) {
                            var e = t.cssClass;
                            return o.h("div", { class: "" + e }, o.h("div", { class: "msp-ui-loading" }, o.h("div", { class: "msp-ui-spinner-wrapper" }, o.h("span", { class: "msp-ui-spinner" }))));
                        }),
                        e
                );
            })(o.Component);
        e.UiLoading = a;
    },
    function (t, e, n) {
        "use strict";
        n.r(e),
            n.d(e, "IntlProvider", function () {
                return l;
            }),
            n.d(e, "Localizer", function () {
                return m;
            }),
            n.d(e, "MarkupText", function () {
                return b;
            }),
            n.d(e, "Text", function () {
                return v;
            }),
            n.d(e, "intl", function () {
                return p;
            }),
            n.d(e, "withText", function () {
                return S;
            });
        var r = n(0),
            i = n(7),
            o = n.n(i);
        function a(t) {
            return null != t;
        }
        function s(t, e) {
            for (var n in e) t[n] = e[n];
            return t;
        }
        var u = /[?&#]intl=show/,
            l = (function (t) {
                function e() {
                    t.apply(this, arguments);
                }
                return (
                    t && (e.__proto__ = t),
                        (e.prototype = Object.create(t && t.prototype)),
                        (e.prototype.constructor = e),
                        (e.prototype.getChildContext = function () {
                            var t = this.props,
                                e = t.scope,
                                n = t.definition,
                                r = t.mark,
                                i = s({}, this.context.intl || {});
                            return (
                                e && (i.scope = e),
                                n &&
                                (i.dictionary = (function t(e, n) {
                                    var r = s({}, e);
                                    for (var i in n) n.hasOwnProperty(i) && (e[i] && n[i] && "object" == typeof e[i] && "object" == typeof n[i] ? (r[i] = t(e[i], n[i])) : (r[i] = e[i] || n[i]));
                                    return r;
                                })(i.dictionary || {}, n)),
                                (r || ("undefined" != typeof location && String(location).match(u))) && (i.mark = !0),
                                    { intl: i }
                            );
                        }),
                        (e.prototype.render = function (t) {
                            return t.children;
                        }),
                        e
                );
            })(r.Component);
        function p(t, e) {
            if (arguments.length < 2)
                return (
                    (e = t),
                        function (t) {
                            return p(t, e);
                        }
                );
            function n(n) {
                return Object(r.h)(l, e || {}, Object(r.h)(t, n));
            }
            return (
                (n.getWrappedComponent =
                    (t && t.getWrappedComponent) ||
                    function () {
                        return t;
                    }),
                    n
            );
        }
        var c,
            d = {};
        function f(t, e) {
            return (c = e || d), t && t.replace(/\{\{([\w.-]+)\}\}/g, h);
        }
        function h(t, e) {
            for (var n = e.split("."), r = c, i = 0; i < n.length; i++) if (null == (r = r[n[i]])) return "";
            return "string" == typeof r && r.match(/\{\{/) && (r = f(r, c)), r;
        }
        function y(t, e, n, r, i, s) {
            e && (t = e + "." + t);
            var u = n && o()(n, t);
            return (
                (i || 0 === i) && u && "object" == typeof u && (u = u.splice ? u[i] || u[0] : 0 === i && a(u.none) ? u.none : 1 === i && a(u.one || u.singular) ? u.one || u.singular : u.some || u.many || u.plural || u.other || u),
                (u && f(u, r)) || s || null
            );
        }
        function g(t, e) {
            var n = t.value,
                i = t.id,
                a = e.intl;
            if (a && a.mark) {
                var s = "dictionary" + (a && a.scope ? "." + a.scope : "") + "." + i;
                return Object(r.h)("mark", { style: { background: n ? (o()(a, s) ? "rgba(119,231,117,.5)" : "rgba(229,226,41,.5)") : "rgba(228,147,51,.5)" }, title: i }, n);
            }
            return n;
        }
        function v(t, e) {
            var n = t.id,
                i = t.children,
                o = t.plural,
                a = t.fields,
                s = e.intl,
                u = y(n, s && s.scope, s && s.dictionary, a, o, i);
            return Object(r.h)(g, { id: n, value: u });
        }
        function _(t, e, n) {
            var r = {};
            for (var i in ((e = e || {}),
                (t = (function (t) {
                    if (("string" == typeof (t = t || {}) && (t = t.split(",")), "join" in t)) {
                        for (var e = {}, n = 0; n < t.length; n++) {
                            var r = t[n].trim();
                            r && (e[r.split(".").pop()] = r);
                        }
                        return e;
                    }
                    return t;
                })(t))))
                if (t.hasOwnProperty(i) && t[i]) {
                    var o = t[i];
                    n || "string" != typeof o ? o.type === v && ((o = s({ fallback: o.props.children }, o.props)), (r[i] = y(o.id, e.scope, e.dictionary, o.fields, o.plural, o.fallback))) : (r[i] = y(o, e.scope, e.dictionary));
                }
            return r;
        }
        function m(t, e) {
            var n = t.children,
                i = e.intl;
            return n && n.length
                ? n.map(function (t) {
                    return Object(r.cloneElement)(t, _(t.props, i, !0));
                })
                : n && Object(r.cloneElement)(n, _(n.props, i, !0));
        }
        function b(t) {
            return Object(r.h)(m, null, Object(r.h)(w, { html: Object(r.h)(v, t), id: t.id }));
        }
        function w(t) {
            var e = t.html,
                n = t.id,
                i = e ? ("string" == typeof e ? Object(r.h)("span", { dangerouslySetInnerHTML: { __html: e } }) : Object(r.h)("span", null, e)) : e;
            return Object(r.h)(g, { id: n, value: i });
        }
        function S(t) {
            return function (e) {
                function n(n, i) {
                    var o = _("function" == typeof t ? t(n, i) : t, i.intl);
                    return Object(r.h)(e, s(s({}, n), o));
                }
                return (
                    (n.getWrappedComponent =
                        (e && e.getWrappedComponent) ||
                        function () {
                            return e;
                        }),
                        n
                );
            };
        }
        (p.intl = p), (p.IntlProvider = l), (p.Text = v), (p.MarkupText = b), (p.Localizer = m), (p.withText = S), (e.default = p);
    },
    function (t, e, n) {
        "use strict";
        var r =
            (this && this.__assign) ||
            function () {
                return (r =
                    Object.assign ||
                    function (t) {
                        for (var e, n = 1, r = arguments.length; n < r; n++) for (var i in (e = arguments[n])) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                        return t;
                    }).apply(this, arguments);
            },
            i =
                (this && this.__awaiter) ||
                function (t, e, n, r) {
                    return new (n || (n = Promise))(function (i, o) {
                        function a(t) {
                            try {
                                u(r.next(t));
                            } catch (t) {
                                o(t);
                            }
                        }
                        function s(t) {
                            try {
                                u(r.throw(t));
                            } catch (t) {
                                o(t);
                            }
                        }
                        function u(t) {
                            var e;
                            t.done
                                ? i(t.value)
                                : ((e = t.value),
                                    e instanceof n
                                        ? e
                                        : new n(function (t) {
                                            t(e);
                                        })).then(a, s);
                        }
                        u((r = r.apply(t, e || [])).next());
                    });
                },
            o =
                (this && this.__generator) ||
                function (t, e) {
                    var n,
                        r,
                        i,
                        o,
                        a = {
                            label: 0,
                            sent: function () {
                                if (1 & i[0]) throw i[1];
                                return i[1];
                            },
                            trys: [],
                            ops: [],
                        };
                    return (
                        (o = { next: s(0), throw: s(1), return: s(2) }),
                        "function" == typeof Symbol &&
                        (o[Symbol.iterator] = function () {
                            return this;
                        }),
                            o
                    );
                    function s(o) {
                        return function (s) {
                            return (function (o) {
                                if (n) throw new TypeError("Generator is already executing.");
                                for (; a; )
                                    try {
                                        if (((n = 1), r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done)) return i;
                                        switch (((r = 0), i && (o = [2 & o[0], i.value]), o[0])) {
                                            case 0:
                                            case 1:
                                                i = o;
                                                break;
                                            case 4:
                                                return a.label++, { value: o[1], done: !1 };
                                            case 5:
                                                a.label++, (r = o[1]), (o = [0]);
                                                continue;
                                            case 7:
                                                (o = a.ops.pop()), a.trys.pop();
                                                continue;
                                            default:
                                                if (!((i = a.trys), (i = i.length > 0 && i[i.length - 1]) || (6 !== o[0] && 2 !== o[0]))) {
                                                    a = 0;
                                                    continue;
                                                }
                                                if (3 === o[0] && (!i || (o[1] > i[0] && o[1] < i[3]))) {
                                                    a.label = o[1];
                                                    break;
                                                }
                                                if (6 === o[0] && a.label < i[1]) {
                                                    (a.label = i[1]), (i = o);
                                                    break;
                                                }
                                                if (i && a.label < i[2]) {
                                                    (a.label = i[2]), a.ops.push(o);
                                                    break;
                                                }
                                                i[2] && a.ops.pop(), a.trys.pop();
                                                continue;
                                        }
                                        o = e.call(t, a);
                                    } catch (t) {
                                        (o = [6, t]), (r = 0);
                                    } finally {
                                        n = i = 0;
                                    }
                                if (5 & o[0]) throw o[1];
                                return { value: o[0] ? o[1] : void 0, done: !0 };
                            })([o, s]);
                        };
                    }
                };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var a = n(1),
            s = (function () {
                function t() {}
                return (
                    (t.setPath = function (t, e) {
                        return void 0 === e && (e = null), a.Globals.getSetting("API_ENV") + t;
                    }),
                        (t.httpRequest = function (e, n, r) {
                            return (
                                void 0 === n && (n = ""),
                                void 0 === r && (r = {}),
                                    i(void 0, void 0, void 0, function () {
                                        var i, s, u;
                                        return o(this, function (o) {
                                            switch (o.label) {
                                                case 0:
                                                    return (
                                                        (i = a.Globals.getSettings()),
                                                            (s = { headers: { Accept: "application/json, text/plain, */*", "Content-Type": "application/json", locale: i.locale, api_token: i.apiToken }, method: n || "GET" }),
                                                            (u = null),
                                                            "GET" == s.method ? (u = t.setPath(e, r)) : ((s.body = JSON.stringify(r)), (u = t.setPath(e))),
                                                            [
                                                                4,
                                                                fetch("" + u, s)
                                                                    .then(function (t) {
                                                                        return t.json();
                                                                    })
                                                                    .catch(function (t) {
                                                                        return Promise.reject();
                                                                    }),
                                                            ]
                                                    );
                                                case 1:
                                                    return [2, o.sent()];
                                            }
                                        });
                                    })
                            );
                        }),
                        (t.getMethod = function (e) {
                            return (
                                void 0 === e && (e = {}),
                                    i(void 0, void 0, void 0, function () {
                                        var n;
                                        return o(this, function (i) {
                                            return (
                                                (n = r({}, e)),
                                                    [
                                                        2,
                                                        t
                                                            .httpRequest(a.Globals.API_ENDPOINTS.CONNECT + "/payments/method", "POST", n)
                                                            .then(function (t) {
                                                                return t;
                                                            })
                                                            .catch(console.error),
                                                    ]
                                            );
                                        });
                                    })
                            );
                        }),
                        t
                );
            })();
        e.Api = s;
    },
    function (t, e, n) {
        t.exports = function (t, e, n, r, i) {
            for (e = e.split ? e.split(".") : e, r = 0; r < e.length; r++) t = t ? t[e[r]] : i;
            return t === i ? n : t;
        };
    },
    function (t, e, n) {
        "use strict";
        var r,
            i =
                (this && this.__extends) ||
                ((r = function (t, e) {
                    return (r =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function (t, e) {
                                t.__proto__ = e;
                            }) ||
                        function (t, e) {
                            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                        })(t, e);
                }),
                    function (t, e) {
                        function n() {
                            this.constructor = t;
                        }
                        r(t, e), (t.prototype = null === e ? Object.create(e) : ((n.prototype = e.prototype), new n()));
                    });
        Object.defineProperty(e, "__esModule", { value: !0 });
        var o = n(0),
            a = n(6),
            s = n(3),
            u = n(1),
            l = n(9),
            p = n(4),
            c = n(18),
            d = n(2),
            f = n(21),
            h = n(12),
            y = n(11),
            g = n(22),
            v = n(13),
            _ = n(10),
            m = (function (t) {
                function e(e) {
                    var r = t.call(this, e) || this;
                    return (
                        (r.setFocus = null),
                            (r.state = {
                                loading: !1,
                                defaultCardSettings: {},
                                gatewayFields: {},
                                gatewayItemSelected: {},
                                gatewayBrand: {},
                                globalSettings: {},
                                validation: { showErrors: !1, items: {} },
                                inputFieldItems: { id: null, items: [] },
                                hideCVV: !1,
                            }),
                            (r.componentDidUpdate = function () {
                                if (r.setFocus) {
                                    var t = document.querySelector(".msp-ui-payment-form #" + r.setFocus);
                                    t && t.focus(), (r.setFocus = null);
                                }
                            }),
                            (r.fillDefaultCardSettings = function (t) {
                                if (0 == Object.keys(r.state.defaultCardSettings).length)
                                    try {
                                        r.state.defaultCardSettings = { format: t.format, maxlength: t.maxlength };
                                    } catch (t) {}
                            }),
                            (r.inputOnInput = function (t, e) {
                                var i = r.props,
                                    o = i.gatewayData,
                                    l = i.onError,
                                    p = r.state,
                                    f = u.Globals.getSetting("paymentData");
                                f.fields || (f.fields = {}), (p.gatewayFields[e.id].value = t.target.value), (p.validation.items[e.id] = {});
                                var h = {},
                                    y = p.gatewayFields[e.id].value,
                                    g = y.length,
                                    v = !1,
                                    _ = null;
                                switch (e.type) {
                                    case "typing-selector":
                                        if (e.callback && t.target.value.length > 1) {
                                            var m = u.Globals.API_ENDPOINTS.CONNECT + "/" + e.callback.replace("{" + e.id + "}", t.target.value);
                                            a.Api.httpRequest(m).then(function (t) {
                                                t.error_code && l(t), r.setState({ inputFieldItems: { id: e.id, items: (t && t.items) || [] } });
                                            });
                                        }
                                }
                                switch (o.fields.template) {
                                    case u.Globals.FORM_TEMPLATES.CREDITCARD:
                                        switch ((_ || (_ = n(23)), o.gateway)) {
                                            case u.Globals.FORM_TEMPLATES.CREDITCARD:
                                                if ("extvar1" == e.id) {
                                                    r.fillDefaultCardSettings(e);
                                                    var b = !1,
                                                        w = [];
                                                    if (g >= 1 && _ && ((w = _(y)), (w = s.Utils.checkCardFormats(w, y))[0] && o.brands.length))
                                                        for (var S in o.brands) {
                                                            var C = o.brands[S];
                                                            s.Utils.cardMapGateway(w[0].type) == C.id &&
                                                            (u.Globals.CARD_FORMAT_OBJECT[C.id] && u.Globals.CARD_FORMAT_OBJECT[C.id].format
                                                                ? ((p.gatewayFields[e.id].format = u.Globals.CARD_FORMAT_OBJECT[C.id].format), (p.gatewayFields[e.id].maxlength = u.Globals.CARD_FORMAT_OBJECT[C.id].maxlength))
                                                                : ((p.gatewayFields[e.id].format = p.defaultCardSettings.format), (p.gatewayFields[e.id].maxlength = p.defaultCardSettings.maxlength)),
                                                                (p.hideCVV = u.Globals.CARD_FORMAT_OBJECT[C.id].hideCVV || !1),
                                                                (p.gatewayBrand = o.brands[S]),
                                                                (p.gatewayBrand.label = w[0].niceType),
                                                                (b = !0));
                                                        }
                                                    b ||
                                                    ((p.hideCVV = !1),
                                                        (p.validation.items[e.id].errors = !0),
                                                        w[0] ? ((p.validation.items[e.id].message = "card_not_allowed"), (p.validation.items[e.id].suffix = ": " + w[0].niceType)) : (p.validation.items[e.id].message = "card_not_valid"),
                                                        (p.gatewayBrand = {}));
                                                    try {
                                                        p.gatewayFields.extvar4.required = !p.hideCVV;
                                                    } catch (t) {}
                                                }
                                        }
                                        "extvar3" == e.id && (y = y.split("/").reverse().join("")), (v = !0);
                                }
                                if ((e.format && (h.pattern = s.Utils.handleFormatPatterns(e.format)), h.pattern && p.gatewayFields[e.id].value)) {
                                    h.patternChar = "â€€";
                                    var E = c(h);
                                    p.gatewayFields[e.id].value.split("").forEach(function (t) {
                                        E.put(t);
                                    });
                                    var I = E.getText();
                                    v && "extvar3" == e.id && "insertText" == t.inputType && (2 == I.length && -1 == ["/"].indexOf(I) ? (I += "/") : I.length == e.maxlength && (r.setFocus = "extvar4")), (p.gatewayFields[e.id].value = I);
                                }
                                (p.gatewayFields[e.id].isDirty = p.gatewayFields[e.id].defaultValue !== p.gatewayFields[e.id].value),
                                p.validation.items[e.id].errors ||
                                p.validation.items[e.id].success ||
                                (e.required && g < 2 && ((p.validation.items[e.id].errors = !0), (p.validation.items[e.id].message = e.error ? e.error : d.Locale.__("required")), (p.validation.showErrors = !0))),
                                !p.validation.items[e.id].errors && g && ((p.validation.items[e.id].success = !0), (p.validation.items[e.id].message = ""), (p.validation.showErrors = !1));
                                var O = e.id,
                                    x = null;
                                if ((p.gatewayFields[O] && p.gatewayFields[O].input_group && (x = p.gatewayFields[O].input_group), x)) {
                                    var P = [];
                                    O = x.id;
                                    for (var A = 0; A < 10; A++) {
                                        var T = x.id + "__" + A;
                                        p.gatewayFields[T] && P.push(p.gatewayFields[T].value);
                                    }
                                    y = v && "extvar3" == O ? P.reverse().join(x.separator) : P.join(x.separator);
                                }
                                (f.fields[O] = v ? s.Utils.setEncryption(y, u.Globals.getSetting("encrypt")) : y),
                                    r.setState(p),
                                    u.Globals.setSetting("paymentData", { gateway: o.gateway, fields: f.fields, validation: p.validation, encrypted: v }),
                                    setTimeout(function () {
                                        r.setOnInputError();
                                    }, 300);
                            }),
                            (r.state.globalSettings = u.Globals.getSettings()),
                            (r.setInputClass = r.setInputClass.bind(r)),
                            (r.setInputStyle = r.setInputStyle.bind(r)),
                            (r.inputOnInput = r.inputOnInput.bind(r)),
                            r
                    );
                }
                return (
                    i(e, t),
                        (e.prototype.componentDidMount = function () {
                            var t = this;
                            u.Globals.setSetting("paymentData", {}),
                                this.props.appEvents.on("msp:checkErrors", function () {
                                    (t.state.validation.showErrors = !0), t.validateInputFields();
                                });
                        }),
                        (e.prototype.onGatewayConfirm = function (t) {
                            void 0 === t && (t = !1);
                            var e = this.props,
                                n = e.onSubmit,
                                r = e.gatewayData,
                                i = u.Globals.getPaymentData(r.gateway);
                            t || (i.validation = {}), u.Globals.setSetting("paymentData", i), n({ paymentData: i });
                        }),
                        (e.prototype.gatewayItemSelect = function (t, e) {
                            var n = this.props,
                                r = n.onSelect,
                                i = n.gatewayData,
                                o = this.state.gatewayFields,
                                a = u.Globals.getSetting("paymentData");
                            a.fields || (a.fields = {}), (o[t.id].value = e.id);
                            var s = o[t.id].value;
                            (a.fields[t.id] = s), this.setState({ validation: {}, gatewayFields: o, gatewayItemSelected: e }), u.Globals.setSetting("paymentData", { gateway: i.gateway, fields: a.fields, validation: {}, encrypted: !1 }), r(e);
                        }),
                        (e.prototype.setOnInputError = function () {
                            (0, this.props.onError)({});
                        }),
                        (e.prototype.gatewaySelect = function (t) {
                            void 0 === t && (t = null), this.setState({ gatewayItemSelected: {}, inputFieldItems: { id: null, items: [] } }), (0, this.props.onGatewaySelect)(t);
                        }),
                        (e.prototype.setGatewayFieldValue = function (t, e) {
                            var n = this.state.gatewayFields;
                            (n[t].value = e.id), this.setState({ gatewayFields: n, inputFieldItems: { id: null, items: [] } });
                        }),
                        (e.prototype.validateInputFields = function (t) {
                            void 0 === t && (t = null);
                            var e = u.Globals.getSetting("paymentData");
                            e.fields || (e.fields = {});
                            var n = this.state,
                                r = !1;
                            for (var i in this.state.gatewayFields) {
                                var o = this.state.gatewayFields[i],
                                    a = ("" + (null === o.value ? "" : o.value)).length,
                                    s = !0;
                                t && t.id != t.id && (s = !1),
                                s &&
                                o.required &&
                                a < 1 &&
                                ((n.validation.items[o.id] = n.validation.items[o.id] || {}),
                                    (n.validation.items[o.id].errors = !0),
                                    (n.validation.items[o.id].message = o.error ? o.error : "Required"),
                                    (n.validation.showErrors = !0),
                                    (r = !0));
                            }
                            (n.validation.showErrors = r), this.setState(n), (e.validation = n.validation), u.Globals.setSetting("paymentData", e);
                        }),
                        (e.prototype.prepareInputFields = function (t) {
                            try {
                                var e = t.fields && t.fields.items ? t.fields.items.length : 0;
                                if (e) {
                                    for (var n in t.fields.items) {
                                        var r = t.fields.items[n];
                                        (r.isDirty = !1), (r.defaultValue = r.value), (this.state.gatewayFields[r.id] = r);
                                    }
                                    return e;
                                }
                            } catch (t) {}
                            return !1;
                        }),
                        (e.prototype.handleNoFieldsMethod = function () {
                            var t = this.props.gatewayData;
                            u.Globals.setSetting("paymentData", { gateway: t.gateway, fields: [], validation: {}, encrypted: !1 }), this.onGatewayConfirm();
                        }),
                        (e.prototype.setInputClass = function (t) {
                            var e = this.props.gatewayData,
                                n = ["msp-ui-form-control"];
                            switch (e.fields.template) {
                                case u.Globals.FORM_TEMPLATES.CREDITCARD:
                                    switch (e.gateway) {
                                        case "CREDITCARD":
                                            "extvar1" == t.id && n.push("msp-ui-credit-card-input");
                                    }
                            }
                            return this.state.validation.showErrors && this.state.validation.items[t.id] && this.state.validation.items[t.id].errors && n.push("msp-ui-control-error"), n.join(" ");
                        }),
                        (e.prototype.setInputStyle = function (t) {
                            void 0 === t && (t = {});
                            var e = this.props.gatewayData,
                                n = [];
                            switch (e.fields.template) {
                                case u.Globals.FORM_TEMPLATES.CREDITCARD:
                                    switch (e.gateway) {
                                        case "CREDITCARD":
                                            if ("extvar1" == t.id) {
                                                var r = this.state.gatewayBrand.id ? this.state.gatewayBrand.image : e.image;
                                                n.push("background-image: url(" + s.Utils.resolveImagePath(r, "icons") + ");");
                                            }
                                    }
                            }
                            return n.join(" ");
                        }),
                        (e.prototype.render = function (t) {
                            var e = this,
                                n = t.gatewayData,
                                r = this.prepareInputFields(n);
                            n.fields && n.fields.template == u.Globals.FORM_TEMPLATES.CREDITCARD && s.Utils.loadModule("msp-crypt"), r || this.handleNoFieldsMethod();
                            var i = r
                                ? n.fields.items.map(function (t, r) {
                                    return o.h(
                                        "div",
                                        null,
                                        t.label ? o.h(v.InputLabel, { item: t, parentState: e.state }) : null,
                                        t.type && -1 != ["hidden"].indexOf(t.type) ? o.h("div", null, o.h(g.HiddenInput, { item: t, parentState: e.state, inputOnInput: e.props.inputOnInput })) : null,
                                        t.type && -1 != ["select"].indexOf(t.type)
                                            ? o.h(
                                            "div",
                                            { class: "msp-ui-form-group" },
                                            o.h(h.SelectInput, { gatewayData: n, parentState: e.state, parentPops: e.props, setInputClass: e.setInputClass, setInputStyle: e.setInputStyle }),
                                            o.h(_.ErrorMessage, { item: t, parentState: e.state })
                                            )
                                            : null,
                                        t.type && -1 != ["select-button"].indexOf(t.type)
                                            ? o.h(
                                            "div",
                                            { class: "msp-ui-form-items-block" },
                                            t.options.map(function (n) {
                                                return o.h(
                                                    "div",
                                                    {
                                                        class: "msp-ui-form-item " + (e.state.gatewayItemSelected.id == n.id ? "selected" : ""),
                                                        onClick: function () {
                                                            return e.gatewayItemSelect(t, n);
                                                        },
                                                    },
                                                    o.h(l.PaymentMethodImage, { item: n, cssClass: "msp-ui-method-image-button" })
                                                );
                                            })
                                            )
                                            : null,
                                        t.type && -1 == ["select", "hidden", "select-button"].indexOf(t.type)
                                            ? o.h(
                                            "div",
                                            { class: "msp-ui-form-group" },
                                            o.h(y.TextInput, {
                                                item: t,
                                                parentState: e.state,
                                                setInputClass: e.props.setInputClass || e.setInputClass,
                                                setInputStyle: e.props.setInputStyle || e.setInputStyle,
                                                inputOnInput: e.props.inputOnInput || e.inputOnInput,
                                            }),
                                            o.h(_.ErrorMessage, { item: t, parentState: e.state })
                                            )
                                            : null
                                    );
                                })
                                : null,
                                a = this.state.inputFieldItems.items
                                    ? this.state.inputFieldItems.items.map(function (t) {
                                        return o.h(
                                            "div",
                                            {
                                                class: "msp-ui-input-field-float-item",
                                                onClick: function () {
                                                    return e.setGatewayFieldValue(e.state.inputFieldItems.id, t);
                                                },
                                            },
                                            o.h("span", null, t.label ? o.h("span", null, t.label) : "")
                                        );
                                    })
                                    : null;
                            return o.h(
                                "div",
                                null,
                                this.state.loading
                                    ? o.h(p.UiLoading, null)
                                    : o.h(
                                    "div",
                                    null,
                                    r
                                        ? o.h(
                                        "div",
                                        { class: "msp-ui-payment-form" },
                                        n.id &&
                                        o.h(
                                            "div",
                                            null,
                                            this.state.globalSettings.template.settings.embed_mode
                                                ? null
                                                : o.h(
                                                "div",
                                                null,
                                                o.h(
                                                    "div",
                                                    { class: "msp-ui-method-header" },
                                                    o.h(l.PaymentMethodImage, { item: this.state.gatewayBrand.id ? this.state.gatewayBrand : n, cssClass: "msp-ui-method-image" }),
                                                    this.state.gatewayBrand.id ? (this.state.gatewayBrand.label ? this.state.gatewayBrand.label : this.state.gatewayBrand.id) : n.label
                                                ),
                                                o.h("div", { class: "msp-ui-separator msp-ui-margin-y-10-px" })
                                                )
                                        ),
                                        n.fields && n.fields.template == u.Globals.FORM_TEMPLATES.CREDITCARD
                                            ? o.h(f.CreditCardInputs, {
                                                gatewayData: n,
                                                parentState: this.state,
                                                parentPops: this.props,
                                                setInputClass: this.setInputClass,
                                                setInputStyle: this.setInputStyle,
                                                inputOnInput: this.inputOnInput,
                                            })
                                            : i,
                                        this.state.inputFieldItems.items.length ? o.h("div", { class: "msp-ui-input-field-items-float" }, a) : null,
                                        o.h("div", { class: "msp-ui-separator msp-ui-margin-y-10-px" }),
                                        "dropin" == this.props.appConfig.component.type
                                            ? o.h(
                                            "span",
                                            { class: "" },
                                            o.h(
                                                "button",
                                                {
                                                    class: "msp-ui-btn msp-ui-btn-link msp-ui-btn-sm msp-ui-view-all-payment-methods",
                                                    onClick: function () {
                                                        return e.gatewaySelect(null);
                                                    },
                                                },
                                                d.Locale.__("view_all_payment_methods")
                                            )
                                            )
                                            : null,
                                        "dropin" == this.props.appConfig.component.type
                                            ? o.h(
                                            "button",
                                            {
                                                class: "msp-ui-btn msp-ui-btn-success msp-ui-pull-right",
                                                onClick: function () {
                                                    return e.onGatewayConfirm();
                                                },
                                            },
                                            d.Locale.__("btn_confirm")
                                            )
                                            : null
                                        )
                                        : null
                                    )
                            );
                        }),
                        e
                );
            })(o.Component);
        e.PaymentMethodForm = m;
    },
    function (t, e, n) {
        "use strict";
        var r,
            i =
                (this && this.__extends) ||
                ((r = function (t, e) {
                    return (r =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function (t, e) {
                                t.__proto__ = e;
                            }) ||
                        function (t, e) {
                            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                        })(t, e);
                }),
                    function (t, e) {
                        function n() {
                            this.constructor = t;
                        }
                        r(t, e), (t.prototype = null === e ? Object.create(e) : ((n.prototype = e.prototype), new n()));
                    });
        Object.defineProperty(e, "__esModule", { value: !0 });
        var o = n(0),
            a = n(3),
            s = (function (t) {
                function e() {
                    return (null !== t && t.apply(this, arguments)) || this;
                }
                return (
                    i(e, t),
                        (e.prototype.render = function (t) {
                            var e = t.item,
                                n = t.cssClass;
                            return o.h("span", { class: n, style: { backgroundImage: "url('" + a.Utils.resolveImagePath(e.image) + "')" } }, "Â ");
                        }),
                        e
                );
            })(o.Component);
        e.PaymentMethodImage = s;
    },
    function (t, e, n) {
        "use strict";
        var r,
            i =
                (this && this.__extends) ||
                ((r = function (t, e) {
                    return (r =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function (t, e) {
                                t.__proto__ = e;
                            }) ||
                        function (t, e) {
                            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                        })(t, e);
                }),
                    function (t, e) {
                        function n() {
                            this.constructor = t;
                        }
                        r(t, e), (t.prototype = null === e ? Object.create(e) : ((n.prototype = e.prototype), new n()));
                    });
        Object.defineProperty(e, "__esModule", { value: !0 });
        var o = n(0),
            a = n(2),
            s = (function (t) {
                function e() {
                    return (null !== t && t.apply(this, arguments)) || this;
                }
                return (
                    i(e, t),
                        (e.prototype.render = function (t) {
                            var e = t.item,
                                n = t.parentState;
                            return o.h(
                                "span",
                                null,
                                n && n.validation.items[e.id] && n.validation.items[e.id].message && n.validation.showErrors
                                    ? o.h("span", { class: "msp-ui-control-error-message", id: "input-error-" + e.id }, a.Locale.__(n.validation.items[e.id].message) + (n.validation.items[e.id].suffix ? n.validation.items[e.id].suffix : ""))
                                    : null
                            );
                        }),
                        e
                );
            })(o.Component);
        e.ErrorMessage = s;
    },
    function (t, e, n) {
        "use strict";
        var r,
            i =
                (this && this.__extends) ||
                ((r = function (t, e) {
                    return (r =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function (t, e) {
                                t.__proto__ = e;
                            }) ||
                        function (t, e) {
                            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                        })(t, e);
                }),
                    function (t, e) {
                        function n() {
                            this.constructor = t;
                        }
                        r(t, e), (t.prototype = null === e ? Object.create(e) : ((n.prototype = e.prototype), new n()));
                    });
        Object.defineProperty(e, "__esModule", { value: !0 });
        var o = n(0),
            a = (function (t) {
                function e(e) {
                    return t.call(this, e) || this;
                }
                return (
                    i(e, t),
                        (e.prototype.render = function (t) {
                            var e = this,
                                n = t.item,
                                r = t.parentState,
                                i = t.settings;
                            return (
                                (i = i || {}),
                                    n && n.id
                                        ? o.h(
                                        "span",
                                        null,
                                        o.h("input", {
                                            class: "" + this.props.setInputClass(n),
                                            style: "" + this.props.setInputStyle(n),
                                            onInput: function (t) {
                                                return e.props.inputOnInput(t, n);
                                            },
                                            type: "text",
                                            value: r.gatewayFields[n.id] ? r.gatewayFields[n.id].value : "",
                                            id: n.id,
                                            maxLength: n.maxlength ? n.maxlength : 200,
                                            placeholder: n.placeholder,
                                        })
                                        )
                                        : null
                            );
                        }),
                        e
                );
            })(o.Component);
        e.TextInput = a;
    },
    function (t, e, n) {
        "use strict";
        var r,
            i =
                (this && this.__extends) ||
                ((r = function (t, e) {
                    return (r =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function (t, e) {
                                t.__proto__ = e;
                            }) ||
                        function (t, e) {
                            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                        })(t, e);
                }),
                    function (t, e) {
                        function n() {
                            this.constructor = t;
                        }
                        r(t, e), (t.prototype = null === e ? Object.create(e) : ((n.prototype = e.prototype), new n()));
                    });
        Object.defineProperty(e, "__esModule", { value: !0 });
        var o = n(0),
            a = (function (t) {
                function e(e) {
                    return t.call(this, e) || this;
                }
                return (
                    i(e, t),
                        (e.prototype.inputOnInputSelect = function (t, e) {
                            (0, this.props.inputOnInput)(t, e);
                        }),
                        (e.prototype.render = function (t) {
                            var e = this,
                                n = t.item,
                                r = t.parentState;
                            t.settings;
                            return n && n.id
                                ? o.h(
                                    "span",
                                    null,
                                    o.h(
                                        "select",
                                        {
                                            id: "" + n.id,
                                            class: "" + this.props.setInputClass(n),
                                            style: "" + this.props.setInputStyle(n),
                                            onChange: function (t) {
                                                return e.inputOnInputSelect(t, n);
                                            },
                                        },
                                        n.options.map(function (t) {
                                            return o.h("option", { selected: t.value && r.gatewayFields[n.id] && r.gatewayFields[n.id].value == t.value, key: t.value, value: t.id }, t.label);
                                        })
                                    )
                                )
                                : null;
                        }),
                        e
                );
            })(o.Component);
        e.SelectInput = a;
    },
    function (t, e, n) {
        "use strict";
        var r,
            i =
                (this && this.__extends) ||
                ((r = function (t, e) {
                    return (r =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function (t, e) {
                                t.__proto__ = e;
                            }) ||
                        function (t, e) {
                            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                        })(t, e);
                }),
                    function (t, e) {
                        function n() {
                            this.constructor = t;
                        }
                        r(t, e), (t.prototype = null === e ? Object.create(e) : ((n.prototype = e.prototype), new n()));
                    });
        Object.defineProperty(e, "__esModule", { value: !0 });
        var o = n(0),
            a = n(2),
            s = (function (t) {
                function e(e) {
                    return t.call(this, e) || this;
                }
                return (
                    i(e, t),
                        (e.prototype.render = function (t) {
                            var e = t.item;
                            return e && e.label ? o.h("span", { class: "msp-ui-form-label" }, a.Locale.__(e.label.text)) : null;
                        }),
                        e
                );
            })(o.Component);
        e.InputLabel = s;
    },
    function (t, e, n) {
        "use strict";
        t.exports = function (t) {
            return t ? JSON.parse(JSON.stringify(t)) : null;
        };
    },
    function (t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 });
        var r = n(16);
        n(34), (window.MultiSafepay = r.MultiSafepay);
    },
    function (t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 });
        var r,
            i = n(0),
            o = n(1),
            a = n(3),
            s = n(17),
            u = n(29),
            l = n(31),
            p = n(33),
            c = n(2);
        if (window.MSPCurrentScript) throw "MultiSafepay loadaed multiple times";
        window.MSPCurrentScript = document.currentScript || (r = document.getElementsByTagName("script"))[r.length - 1];
        var d = function (t) {
                void 0 === t && (t = null);
                var e,
                    n = o.Globals.getSetting("paymentData"),
                    r = { count: 0, errors: [] };
                if (
                    (t && t.error_code && ((e = { id: null, type: "api", mesage: t.error_info ? t.error_info : "", code: t.error_code || 1e3 }), r.errors.push(e), r.count++),
                    t && t.message && ((e = { id: null, type: "error", mesage: t.message ? t.message : "", code: t.error_code || 1e3 }), r.errors.push(e), r.count++),
                    n.validation && n.validation.items)
                )
                    for (var i in n.validation.items) n.validation.items[i].errors && ((e = { id: i, code: 1e3, type: "validation", mesage: n.validation.items[i].message }), r.errors.push(e), r.count++);
                return r;
            },
            f = function (t) {
                var e = this;
                if (
                    (void 0 === t && (t = {}),
                        (this.appConfig = { component: {} }),
                        (this.appEvents = null),
                        (this.redirectConfig = {}),
                        (this.errorHandler = {}),
                        (this.ref = null),
                        (this.onError = function (t) {
                            void 0 === t && (t = null), (e.errorHandler = d(t)), e.errorHandler.count && a.Utils.isFunction(e.appConfig.onError) && e.appConfig.onError(e.errorHandler);
                        }),
                        (this.onLoad = function () {
                            a.Utils.isFunction(e.appConfig.onLoad) && e.appConfig.onLoad({ success: !0 });
                        }),
                        (this.onSubmit = function (t) {
                            void 0 === t && (t = {}), e.appEvents.emit("msp:checkErrors", {}), (e.errorHandler = d()), a.Utils.isFunction(e.appConfig.onSubmit) && e.appConfig.onSubmit(t);
                        }),
                        (this.onSelect = function (t) {
                            void 0 === t && (t = {}), a.Utils.isFunction(e.appConfig.onSelect) && e.appConfig.onSelect({ id: t.id, label: t.label });
                        }),
                        (this.hasErrors = function () {
                            return e.appEvents.emit("msp:checkErrors", {}), (e.errorHandler = d()), e.errorHandler.count > 0;
                        }),
                        (this.getErrors = function () {
                            return e.appEvents.emit("msp:checkErrors", {}), (e.errorHandler = d()), e.errorHandler;
                        }),
                        (this.getPaymentData = function () {
                            return o.Globals.getPaymentData(e.appConfig.gateway);
                        }),
                        (this.init = function (t, n) {
                            if ((void 0 === n && (n = {}), c.Locale.init(o.Globals.getSetting("locale")), "redirection" == t)) {
                                if (!n.order || !n.order.order_id) throw c.Locale.__("order_required_redirect");
                                e.redirectConfig = n;
                            } else {
                                if (e.appConfig.component.type) throw c.Locale.__("payment_instance_exists") + ": " + e.appConfig.component.type;
                                e.appConfig = n;
                            }
                            var r = null;
                            if ((n.container && (r = document.querySelector(n.container)), "redirection" != t)) {
                                if (!r) throw c.Locale.__("container_not_found") + ": " + n.container;
                                e.appConfig.component = { type: t, container: n.container, containerRef: r };
                            }
                            (e.onLoad = e.onLoad.bind(e)),
                                (e.onSubmit = e.onSubmit.bind(e)),
                                (e.onSelect = e.onSelect.bind(e)),
                                (e.hasErrors = e.hasErrors.bind(e)),
                                (e.getErrors = e.getErrors.bind(e)),
                                (e.getPaymentData = e.getPaymentData.bind(e)),
                                e.onLoad();
                            var a = function (t) {
                                e.ref = t;
                            };
                            switch (t) {
                                case "dropin":
                                    e.appConfig.gateways.methods || e.onError({ message: c.Locale.__("no_gateways_found"), code: 1e3 }),
                                        i.render(i.h(u.DropinApp, { appEvents: e.appEvents, appConfig: e.appConfig, onLoad: e.onLoad, onSubmit: e.onSubmit, onSelect: e.onSelect, onError: e.onError, hasErrors: e.hasErrors, ref: a }), r);
                                    break;
                                case "payment":
                                    i.render(i.h(s.PaymentApp, { appEvents: e.appEvents, appConfig: e.appConfig, onLoad: e.onLoad, onSubmit: e.onSubmit, onSelect: e.onSelect, onError: e.onError, hasErrors: e.hasErrors, ref: a }), r);
                                    break;
                                case "redirection":
                                    if (((e.redirectConfig.container = r || e.appConfig.component.container), r || (r = document.querySelector(e.appConfig.component.container)), !r))
                                        throw "Container " + e.redirectConfig.container + " not found";
                                    i.render(
                                        i.h(l.RedirectionApp, { appEvents: e.appEvents, redirectConfig: e.redirectConfig, onLoad: e.onLoad, onSubmit: e.onSubmit, onError: e.onError, onSelect: e.onSelect, hasErrors: e.hasErrors, ref: a }),
                                        r
                                    );
                                    break;
                                default:
                                    throw c.Locale.__("wrong_init_type") + ": " + t;
                            }
                        }),
                        !t.apiToken)
                )
                    throw "Api Token is required";
                (this.appEvents = new p.EventEmitter()), o.Globals.setSettings(t);
            };
        e.MultiSafepay = f;
    },
    function (t, e, n) {
        "use strict";
        var r,
            i =
                (this && this.__extends) ||
                ((r = function (t, e) {
                    return (r =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function (t, e) {
                                t.__proto__ = e;
                            }) ||
                        function (t, e) {
                            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                        })(t, e);
                }),
                    function (t, e) {
                        function n() {
                            this.constructor = t;
                        }
                        r(t, e), (t.prototype = null === e ? Object.create(e) : ((n.prototype = e.prototype), new n()));
                    }),
            o =
                (this && this.__awaiter) ||
                function (t, e, n, r) {
                    return new (n || (n = Promise))(function (i, o) {
                        function a(t) {
                            try {
                                u(r.next(t));
                            } catch (t) {
                                o(t);
                            }
                        }
                        function s(t) {
                            try {
                                u(r.throw(t));
                            } catch (t) {
                                o(t);
                            }
                        }
                        function u(t) {
                            var e;
                            t.done
                                ? i(t.value)
                                : ((e = t.value),
                                    e instanceof n
                                        ? e
                                        : new n(function (t) {
                                            t(e);
                                        })).then(a, s);
                        }
                        u((r = r.apply(t, e || [])).next());
                    });
                },
            a =
                (this && this.__generator) ||
                function (t, e) {
                    var n,
                        r,
                        i,
                        o,
                        a = {
                            label: 0,
                            sent: function () {
                                if (1 & i[0]) throw i[1];
                                return i[1];
                            },
                            trys: [],
                            ops: [],
                        };
                    return (
                        (o = { next: s(0), throw: s(1), return: s(2) }),
                        "function" == typeof Symbol &&
                        (o[Symbol.iterator] = function () {
                            return this;
                        }),
                            o
                    );
                    function s(o) {
                        return function (s) {
                            return (function (o) {
                                if (n) throw new TypeError("Generator is already executing.");
                                for (; a; )
                                    try {
                                        if (((n = 1), r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done)) return i;
                                        switch (((r = 0), i && (o = [2 & o[0], i.value]), o[0])) {
                                            case 0:
                                            case 1:
                                                i = o;
                                                break;
                                            case 4:
                                                return a.label++, { value: o[1], done: !1 };
                                            case 5:
                                                a.label++, (r = o[1]), (o = [0]);
                                                continue;
                                            case 7:
                                                (o = a.ops.pop()), a.trys.pop();
                                                continue;
                                            default:
                                                if (!((i = a.trys), (i = i.length > 0 && i[i.length - 1]) || (6 !== o[0] && 2 !== o[0]))) {
                                                    a = 0;
                                                    continue;
                                                }
                                                if (3 === o[0] && (!i || (o[1] > i[0] && o[1] < i[3]))) {
                                                    a.label = o[1];
                                                    break;
                                                }
                                                if (6 === o[0] && a.label < i[1]) {
                                                    (a.label = i[1]), (i = o);
                                                    break;
                                                }
                                                if (i && a.label < i[2]) {
                                                    (a.label = i[2]), a.ops.push(o);
                                                    break;
                                                }
                                                i[2] && a.ops.pop(), a.trys.pop();
                                                continue;
                                        }
                                        o = e.call(t, a);
                                    } catch (t) {
                                        (o = [6, t]), (r = 0);
                                    } finally {
                                        n = i = 0;
                                    }
                                if (5 & o[0]) throw o[1];
                                return { value: o[0] ? o[1] : void 0, done: !0 };
                            })([o, s]);
                        };
                    }
                };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var s = n(0),
            u = n(5),
            l = n(6),
            p = n(8),
            c = n(1),
            d = n(3),
            f = n(4),
            h = n(2),
            y = (function (t) {
                function e(e) {
                    var n = t.call(this, e) || this;
                    (n.state = { appConfig: {}, gatewayData: {}, loading: !1, gateway: "", language: {}, translations: null }),
                        (n.globalSettings = {}),
                        (n.getMethod = function () {
                            return o(n, void 0, void 0, function () {
                                var t,
                                    e,
                                    n,
                                    r = this;
                                return a(this, function (i) {
                                    return (
                                        (t = this.props.onError),
                                            ((e = this.state).loading = !0),
                                            (e.gatewayData = {}),
                                            this.setState(e),
                                            ((n = c.Globals.getSetting("order")).gateway = e.gateway),
                                            (n.browser = d.Utils.getBrowserInfo()),
                                            l.Api.getMethod(n)
                                                .then(function (n) {
                                                    return (e.loading = !1), n.error_code ? (t(n), (e.gatewayData = {})) : (e.gatewayData = n), r.setState(e), n;
                                                })
                                                .catch(console.error),
                                            [2]
                                    );
                                });
                            });
                        });
                    var r = n.state;
                    return (r.gateway = e.appConfig.gateway), (r.appConfig = e.appConfig), (n.globalSettings = c.Globals.getSettings()), (n.state.translations = h.Locale.init(n.globalSettings.locale)), n;
                }
                return (
                    i(e, t),
                        (e.prototype.componentDidMount = function () {
                            this.getMethod();
                        }),
                        (e.prototype.render = function () {
                            return s.h(
                                u.IntlProvider,
                                { definition: this.state.translations },
                                s.h(
                                    "div",
                                    { class: "msp-container-ui " + (this.globalSettings.template.settings && this.globalSettings.template.settings.embed_mode ? "msp-embed-mode" : "") },
                                    s.h(
                                        "div",
                                        null,
                                        this.state.loading
                                            ? s.h(f.UiLoading, null)
                                            : s.h(p.PaymentMethodForm, {
                                                appEvents: this.props.appEvents,
                                                appConfig: this.props.appConfig,
                                                onLoad: this.props.onLoad,
                                                onSubmit: this.props.onSubmit,
                                                onError: this.props.onError,
                                                onSelect: this.props.onSelect,
                                                hasErrors: this.props.hasErrors,
                                                gatewayData: this.state.gatewayData,
                                            })
                                    )
                                )
                            );
                        }),
                        e
                );
            })(s.Component);
        e.PaymentApp = y;
    },
    function (t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 });
        var r,
            i = n(19),
            o = (r = i) && r.__esModule ? r : { default: r };
        (e.default = o.default), (t.exports = e.default);
    },
    function (t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }),
            (e.default = function () {
                var t = arguments.length <= 0 || void 0 === arguments[0] ? { pattern: "", placeholder: "", patternChar: "_" } : arguments[0],
                    e = t.pattern,
                    n = t.placeholder,
                    r = t.patternChar,
                    i = /^\d$/,
                    o = /^[a-zA-Z]$/,
                    a = /^[a-zA-Z\d]$/,
                    s = e,
                    u = r,
                    l = d(n, s, u),
                    p = "",
                    c = "";
                function d(t, e) {
                    void 0 === t && (t = "");
                    var n = arguments.length <= 2 || void 0 === arguments[2] ? "_" : arguments[2],
                        r = t;
                    return e.length !== t.length && (r = String(e).replace(/[9|a|\*]/g, n)), r;
                }
                function f(t) {
                    for (var e = !0; e; ) {
                        var n = t;
                        if (((e = !1), p.length === s.length)) return !1;
                        var r = s[p.length],
                            u = l[p.length];
                        if (r !== u) {
                            switch (r) {
                                case "9":
                                    if (!n.match(i)) return !1;
                                    break;
                                case "a":
                                    if (!n.match(o)) return !1;
                                    break;
                                case "*":
                                    if (!n.match(a)) return !1;
                                    break;
                                default:
                                    return !1;
                            }
                            return (p += n), (c += n), this;
                        }
                        (p += r), (t = n), (e = !0), (r = u = void 0);
                    }
                }
                function h() {
                    if (0 === p.length) return !1;
                    ((p = p.substring(0, p.length - 1)), (c = c.substring(0, c.length - 1)), p.length > 0) && s[p.length - 1] === l[p.length - 1] && (p = p.substring(0, p.length - 1));
                    return this;
                }
                function y() {
                    return c;
                }
                function g() {
                    return p;
                }
                function v() {
                    return p + l.substring(p.length);
                }
                function _() {
                    return { start: p.length ? p.length - 1 : 0, end: p.length };
                }
                return { placeholder: l, pattern: s, put: f, getText: g, getInputText: y, getDisplayText: v, getSelection: _, back: h };
            }),
            (t.exports = e.default);
    },
    function (t) {
        t.exports = JSON.parse(
            '{"api_token_required":"ApiToken is required","btn_confirm":"Confirm","Card number":"Card number","card_expiry_date":"Expiry Date","card_not_allowed":"Card not allowed","card_not_valid":"Invalid card","container_not_found":"Container not found","Holder":"Holder","Holder is required":"Holder is required","MM/YY":"MM/YY","no_gateways_found":"No gateways found","order_required_redirect":"Order is required to initialize redirection","payment_instance_exists":"Payment instance already exists","required":"Required","view_all_payment_methods":"View All Payment Methods","wrong_init_type":"Wrong init type"}'
        );
    },
    function (t, e, n) {
        "use strict";
        var r,
            i =
                (this && this.__extends) ||
                ((r = function (t, e) {
                    return (r =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function (t, e) {
                                t.__proto__ = e;
                            }) ||
                        function (t, e) {
                            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                        })(t, e);
                }),
                    function (t, e) {
                        function n() {
                            this.constructor = t;
                        }
                        r(t, e), (t.prototype = null === e ? Object.create(e) : ((n.prototype = e.prototype), new n()));
                    });
        Object.defineProperty(e, "__esModule", { value: !0 });
        var o = n(0),
            a = n(10),
            s = n(11),
            u = n(12),
            l = n(13),
            p = n(2),
            c = (function (t) {
                function e(e) {
                    var n = t.call(this, e) || this;
                    return (n.inputs = {}), n;
                }
                return (
                    i(e, t),
                        (e.prototype.mapItems = function (t) {
                            for (var e in (void 0 === t && (t = {}), t.fields.items)) {
                                var n = t.fields.items[e];
                                this.inputs[n.id] = n;
                            }
                        }),
                        (e.prototype.render = function (t) {
                            var e = this,
                                n = t.gatewayData,
                                r = t.parentState;
                            this.mapItems(n);
                            var i = o.h(
                                "div",
                                null,
                                this.inputs.extvar2
                                    ? o.h(
                                    "div",
                                    { class: "msp-ui-form-group" },
                                    o.h(l.InputLabel, { item: this.inputs.extvar2, parentState: r }),
                                    o.h(s.TextInput, { item: this.inputs.extvar2, parentState: r, setInputClass: this.props.setInputClass, setInputStyle: this.props.setInputStyle, inputOnInput: this.props.inputOnInput }),
                                    o.h(a.ErrorMessage, { item: this.inputs.extvar2, parentState: r })
                                    )
                                    : null,
                                this.inputs.extvar1
                                    ? o.h(
                                    "div",
                                    { class: "msp-ui-form-group" },
                                    o.h(l.InputLabel, { item: this.inputs.extvar1, parentState: r }),
                                    o.h(s.TextInput, { item: this.inputs.extvar1, parentState: r, setInputClass: this.props.setInputClass, setInputStyle: this.props.setInputStyle, inputOnInput: this.props.inputOnInput }),
                                    o.h(a.ErrorMessage, { item: this.inputs.extvar1, parentState: r })
                                    )
                                    : null
                                ),
                                c = o.h(
                                    "div",
                                    null,
                                    i,
                                    o.h(
                                        "div",
                                        { class: "msp-ui-row" },
                                        this.inputs.extvar3__0
                                            ? o.h(
                                            "div",
                                            { class: "msp-ui-col-3" },
                                            o.h(
                                                "div",
                                                { class: "msp-ui-form-group" },
                                                o.h("span", { class: "msp-ui-form-label" }, p.Locale.__("card_expiry_date")),
                                                o.h(u.SelectInput, { item: this.inputs.extvar3__0, parentState: r, setInputClass: this.props.setInputClass, setInputStyle: this.props.setInputStyle, inputOnInput: this.props.inputOnInput }),
                                                o.h(a.ErrorMessage, { item: this.inputs.extvar3__0, parentState: r })
                                            )
                                            )
                                            : null,
                                        this.inputs.extvar3__1
                                            ? o.h(
                                            "div",
                                            { class: "msp-ui-col-3" },
                                            o.h(
                                                "div",
                                                { class: "msp-ui-form-group" },
                                                o.h("span", { class: "msp-ui-form-label" }, "Â "),
                                                o.h(u.SelectInput, { item: this.inputs.extvar3__1, parentState: r, setInputClass: this.props.setInputClass, setInputStyle: this.props.setInputStyle, inputOnInput: this.props.inputOnInput }),
                                                o.h(a.ErrorMessage, { item: this.inputs.extvar3__1, parentState: r })
                                            )
                                            )
                                            : null,
                                        this.inputs.extvar4 && !r.hideCVV
                                            ? o.h(
                                            "div",
                                            { class: "msp-ui-col-3" },
                                            o.h(
                                                "div",
                                                { class: "msp-ui-form-group" },
                                                o.h(l.InputLabel, { item: this.inputs.extvar4, parentState: r }),
                                                o.h(s.TextInput, { item: this.inputs.extvar4, parentState: r, setInputClass: this.props.setInputClass, setInputStyle: this.props.setInputStyle, inputOnInput: this.props.inputOnInput }),
                                                o.h(a.ErrorMessage, { item: this.inputs.extvar4, parentState: r })
                                            )
                                            )
                                            : null
                                    )
                                ),
                                d = o.h(
                                    "div",
                                    null,
                                    i,
                                    o.h(
                                        "div",
                                        { class: "msp-ui-row" },
                                        this.inputs.extvar3
                                            ? o.h(
                                            "div",
                                            { class: "msp-ui-col-2" },
                                            o.h(
                                                "div",
                                                { class: "msp-ui-form-group" },
                                                o.h(l.InputLabel, { item: this.inputs.extvar3, parentState: r }),
                                                o.h(s.TextInput, { item: this.inputs.extvar3, parentState: r, setInputClass: this.props.setInputClass, setInputStyle: this.props.setInputStyle, inputOnInput: this.props.inputOnInput }),
                                                o.h(a.ErrorMessage, { item: this.inputs.extvar3, parentState: r })
                                            )
                                            )
                                            : null,
                                        this.inputs.extvar4 && !r.hideCVV
                                            ? o.h(
                                            "div",
                                            { class: "msp-ui-col-2" },
                                            o.h(
                                                "div",
                                                { class: "msp-ui-form-group" },
                                                o.h(l.InputLabel, { item: this.inputs.extvar4, parentState: r }),
                                                o.h(s.TextInput, { item: this.inputs.extvar4, parentState: r, setInputClass: this.props.setInputClass, setInputStyle: this.props.setInputStyle, inputOnInput: this.props.inputOnInput }),
                                                o.h(a.ErrorMessage, { item: this.inputs.extvar4, parentState: r })
                                            )
                                            )
                                            : null
                                    )
                                );
                            return o.h(
                                "div",
                                null,
                                (function () {
                                    var t = "";
                                    try {
                                        e.props.parentState.globalSettings.template.payment_form.template.type && (t = e.props.parentState.globalSettings.template.payment_form.template.type);
                                    } catch (t) {}
                                    switch (t) {
                                        case "secondary":
                                            return c;
                                        default:
                                            return d;
                                    }
                                })()
                            );
                        }),
                        e
                );
            })(o.Component);
        e.CreditCardInputs = c;
    },
    function (t, e, n) {
        "use strict";
        var r,
            i =
                (this && this.__extends) ||
                ((r = function (t, e) {
                    return (r =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function (t, e) {
                                t.__proto__ = e;
                            }) ||
                        function (t, e) {
                            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                        })(t, e);
                }),
                    function (t, e) {
                        function n() {
                            this.constructor = t;
                        }
                        r(t, e), (t.prototype = null === e ? Object.create(e) : ((n.prototype = e.prototype), new n()));
                    });
        Object.defineProperty(e, "__esModule", { value: !0 });
        var o = n(0),
            a = (function (t) {
                function e(e) {
                    return t.call(this, e) || this;
                }
                return (
                    i(e, t),
                        (e.prototype.render = function (t) {
                            var e = this,
                                n = t.item,
                                r = t.parentState;
                            return n && n.id
                                ? o.h(
                                    "span",
                                    null,
                                    o.h("input", {
                                        onInput: function (t) {
                                            return e.props.inputOnInput(t, n);
                                        },
                                        type: "hidden",
                                        value: r.gatewayFields[n.id] ? r.gatewayFields[n.id].value : "",
                                    })
                                )
                                : null;
                        }),
                        e
                );
            })(o.Component);
        e.HiddenInput = a;
    },
    function (t, e, n) {
        "use strict";
        var r,
            i = n(24),
            o = n(14),
            a = n(25),
            s = n(26),
            u = n(27),
            l = {},
            p = {
                VISA: "visa",
                MASTERCARD: "mastercard",
                AMERICAN_EXPRESS: "american-express",
                DINERS_CLUB: "diners-club",
                DISCOVER: "discover",
                JCB: "jcb",
                UNIONPAY: "unionpay",
                MAESTRO: "maestro",
                ELO: "elo",
                MIR: "mir",
                HIPER: "hiper",
                HIPERCARD: "hipercard",
            },
            c = [p.VISA, p.MASTERCARD, p.AMERICAN_EXPRESS, p.DINERS_CLUB, p.DISCOVER, p.JCB, p.UNIONPAY, p.MAESTRO, p.ELO, p.MIR, p.HIPER, p.HIPERCARD];
        function d(t) {
            return l[t] || i[t];
        }
        function f(t, e) {
            var n = r.indexOf(t);
            if (!e && -1 === n) throw new Error('"' + t + '" is not a supported card type.');
            return n;
        }
        function h(t) {
            var e,
                n = [];
            return s(t)
                ? 0 === t.length
                    ? r.map(function (t) {
                        return o(d(t));
                    })
                    : (r.forEach(function (e) {
                        var r = d(e);
                        u(t, r, n);
                    }),
                        (e = a(n)) ? [e] : n)
                : [];
        }
        (r = o(c)),
            (h.getTypeInfo = function (t) {
                return o(d(t));
            }),
            (h.removeCard = function (t) {
                var e = f(t);
                r.splice(e, 1);
            }),
            (h.addCard = function (t) {
                var e = f(t.type, !0);
                (l[t.type] = t), -1 === e && r.push(t.type);
            }),
            (h.updateCard = function (t, e) {
                var n,
                    r = l[t] || i[t];
                if (!r) throw new Error('"' + t + '" is not a recognized type. Use `addCard` instead.');
                if (e.type && r.type !== e.type) throw new Error("Cannot overwrite type parameter.");
                (n = o(r, !0)),
                    Object.keys(n).forEach(function (t) {
                        e[t] && (n[t] = e[t]);
                    }),
                    (l[n.type] = n);
            }),
            (h.changeOrder = function (t, e) {
                var n = f(t);
                r.splice(n, 1), r.splice(e, 0, t);
            }),
            (h.resetModifications = function () {
                (r = o(c)), (l = {});
            }),
            (h.types = p),
            (t.exports = h);
    },
    function (t, e, n) {
        "use strict";
        t.exports = {
            visa: { niceType: "Visa", type: "visa", patterns: [4], gaps: [4, 8, 12], lengths: [16, 18, 19], code: { name: "CVV", size: 3 } },
            mastercard: { niceType: "Mastercard", type: "mastercard", patterns: [[51, 55], [2221, 2229], [223, 229], [23, 26], [270, 271], 2720], gaps: [4, 8, 12], lengths: [16], code: { name: "CVC", size: 3 } },
            "american-express": { niceType: "American Express", type: "american-express", patterns: [34, 37], gaps: [4, 10], lengths: [15], code: { name: "CID", size: 4 } },
            "diners-club": { niceType: "Diners Club", type: "diners-club", patterns: [[300, 305], 36, 38, 39], gaps: [4, 10], lengths: [14, 16, 19], code: { name: "CVV", size: 3 } },
            discover: { niceType: "Discover", type: "discover", patterns: [6011, [644, 649], 65], gaps: [4, 8, 12], lengths: [16, 19], code: { name: "CID", size: 3 } },
            jcb: { niceType: "JCB", type: "jcb", patterns: [2131, 1800, [3528, 3589]], gaps: [4, 8, 12], lengths: [16, 17, 18, 19], code: { name: "CVV", size: 3 } },
            unionpay: {
                niceType: "UnionPay",
                type: "unionpay",
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
                    [8164, 8171],
                ],
                gaps: [4, 8, 12],
                lengths: [14, 15, 16, 17, 18, 19],
                code: { name: "CVN", size: 3 },
            },
            maestro: { niceType: "Maestro", type: "maestro", patterns: [493698, [5e5, 506698], [506779, 508999], [56, 59], 63, 67, 6], gaps: [4, 8, 12], lengths: [12, 13, 14, 15, 16, 17, 18, 19], code: { name: "CVC", size: 3 } },
            elo: {
                niceType: "Elo",
                type: "elo",
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
                    [509e3, 509999],
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
                    [655e3, 655019],
                    [655021, 655058],
                ],
                gaps: [4, 8, 12],
                lengths: [16],
                code: { name: "CVE", size: 3 },
            },
            mir: { niceType: "Mir", type: "mir", patterns: [[2200, 2204]], gaps: [4, 8, 12], lengths: [16, 17, 18, 19], code: { name: "CVP2", size: 3 } },
            hiper: { niceType: "Hiper", type: "hiper", patterns: [637095, 637568, 637599, 637609, 637612], gaps: [4, 8, 12], lengths: [16], code: { name: "CVC", size: 3 } },
            hipercard: { niceType: "Hipercard", type: "hipercard", patterns: [606282], gaps: [4, 8, 12], lengths: [16], code: { name: "CVC", size: 3 } },
        };
    },
    function (t, e, n) {
        "use strict";
        t.exports = function (t) {
            if (
                (function (t) {
                    var e = t.filter(function (t) {
                        return t.matchStrength;
                    }).length;
                    return e > 0 && e === t.length;
                })(t)
            )
                return t.reduce(function (t, e) {
                    return t ? (t.matchStrength < e.matchStrength ? e : t) : e;
                });
        };
    },
    function (t, e, n) {
        "use strict";
        t.exports = function (t) {
            return "string" == typeof t || t instanceof String;
        };
    },
    function (t, e, n) {
        "use strict";
        var r = n(14),
            i = n(28);
        t.exports = function (t, e, n) {
            var o, a, s, u;
            for (o = 0; o < e.patterns.length; o++)
                if (((a = e.patterns[o]), i(t, a))) {
                    (u = r(e)), (s = Array.isArray(a) ? String(a[0]).length : String(a).length), t.length >= s && (u.matchStrength = s), n.push(u);
                    break;
                }
        };
    },
    function (t, e, n) {
        "use strict";
        t.exports = function (t, e) {
            return Array.isArray(e)
                ? (function (t, e, n) {
                    var r = String(e).length,
                        i = t.substr(0, r),
                        o = parseInt(i, 10);
                    return (e = parseInt(String(e).substr(0, i.length), 10)), (n = parseInt(String(n).substr(0, i.length), 10)), o >= e && o <= n;
                })(t, e[0], e[1])
                : (function (t, e) {
                    return (e = String(e)).substring(0, t.length) === t.substring(0, e.length);
                })(t, e);
        };
    },
    function (t, e, n) {
        "use strict";
        var r,
            i =
                (this && this.__extends) ||
                ((r = function (t, e) {
                    return (r =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function (t, e) {
                                t.__proto__ = e;
                            }) ||
                        function (t, e) {
                            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                        })(t, e);
                }),
                    function (t, e) {
                        function n() {
                            this.constructor = t;
                        }
                        r(t, e), (t.prototype = null === e ? Object.create(e) : ((n.prototype = e.prototype), new n()));
                    }),
            o =
                (this && this.__awaiter) ||
                function (t, e, n, r) {
                    return new (n || (n = Promise))(function (i, o) {
                        function a(t) {
                            try {
                                u(r.next(t));
                            } catch (t) {
                                o(t);
                            }
                        }
                        function s(t) {
                            try {
                                u(r.throw(t));
                            } catch (t) {
                                o(t);
                            }
                        }
                        function u(t) {
                            var e;
                            t.done
                                ? i(t.value)
                                : ((e = t.value),
                                    e instanceof n
                                        ? e
                                        : new n(function (t) {
                                            t(e);
                                        })).then(a, s);
                        }
                        u((r = r.apply(t, e || [])).next());
                    });
                },
            a =
                (this && this.__generator) ||
                function (t, e) {
                    var n,
                        r,
                        i,
                        o,
                        a = {
                            label: 0,
                            sent: function () {
                                if (1 & i[0]) throw i[1];
                                return i[1];
                            },
                            trys: [],
                            ops: [],
                        };
                    return (
                        (o = { next: s(0), throw: s(1), return: s(2) }),
                        "function" == typeof Symbol &&
                        (o[Symbol.iterator] = function () {
                            return this;
                        }),
                            o
                    );
                    function s(o) {
                        return function (s) {
                            return (function (o) {
                                if (n) throw new TypeError("Generator is already executing.");
                                for (; a; )
                                    try {
                                        if (((n = 1), r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done)) return i;
                                        switch (((r = 0), i && (o = [2 & o[0], i.value]), o[0])) {
                                            case 0:
                                            case 1:
                                                i = o;
                                                break;
                                            case 4:
                                                return a.label++, { value: o[1], done: !1 };
                                            case 5:
                                                a.label++, (r = o[1]), (o = [0]);
                                                continue;
                                            case 7:
                                                (o = a.ops.pop()), a.trys.pop();
                                                continue;
                                            default:
                                                if (!((i = a.trys), (i = i.length > 0 && i[i.length - 1]) || (6 !== o[0] && 2 !== o[0]))) {
                                                    a = 0;
                                                    continue;
                                                }
                                                if (3 === o[0] && (!i || (o[1] > i[0] && o[1] < i[3]))) {
                                                    a.label = o[1];
                                                    break;
                                                }
                                                if (6 === o[0] && a.label < i[1]) {
                                                    (a.label = i[1]), (i = o);
                                                    break;
                                                }
                                                if (i && a.label < i[2]) {
                                                    (a.label = i[2]), a.ops.push(o);
                                                    break;
                                                }
                                                i[2] && a.ops.pop(), a.trys.pop();
                                                continue;
                                        }
                                        o = e.call(t, a);
                                    } catch (t) {
                                        (o = [6, t]), (r = 0);
                                    } finally {
                                        n = i = 0;
                                    }
                                if (5 & o[0]) throw o[1];
                                return { value: o[0] ? o[1] : void 0, done: !0 };
                            })([o, s]);
                        };
                    }
                };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var s = n(0),
            u = n(5),
            l = n(30),
            p = n(8),
            c = n(6),
            d = n(1),
            f = n(3),
            h = n(4),
            y = n(2),
            g = (function (t) {
                function e(e) {
                    var n = t.call(this, e) || this;
                    (n.state = { appConfig: {}, globalSettings: {}, gatewayData: {}, gateway: {}, loading: !1, translations: null }),
                        (n.globalSettings = {}),
                        (n.getMethod = function (t) {
                            return (
                                void 0 === t && (t = {}),
                                    o(n, void 0, void 0, function () {
                                        var e,
                                            n,
                                            r,
                                            i = this;
                                        return a(this, function (o) {
                                            return (
                                                (e = this.props.onError),
                                                    ((n = this.state).loading = !0),
                                                    (n.gatewayData = {}),
                                                    this.setState(n),
                                                    ((r = this.globalSettings.order || {}).gateway = t.gateway),
                                                    (r.id = t.id),
                                                    (r.browser = f.Utils.getBrowserInfo()),
                                                    c.Api.getMethod(r)
                                                        .then(function (t) {
                                                            return (n.loading = !1), t.error_code ? (e(t), (n.gatewayData = {})) : (n.gatewayData = t), i.setState(n), t;
                                                        })
                                                        .catch(console.error),
                                                    [2]
                                            );
                                        });
                                    })
                            );
                        });
                    var r = n.state;
                    return (
                        (n.globalSettings = d.Globals.getSettings()),
                            (r.appConfig = e.appConfig),
                            n.setState(r),
                            (n.gatewaySelect = n.gatewaySelect.bind(n)),
                            (n.setLoading = n.setLoading.bind(n)),
                            n.setLoading(!0),
                            (n.state.translations = y.Locale.init(n.globalSettings.locale)),
                            setTimeout(function () {
                                n.setLoading(!1);
                            }, 200),
                            n
                    );
                }
                return (
                    i(e, t),
                        (e.prototype.setLoading = function (t) {
                            void 0 === t && (t = !1);
                            var e = this.state;
                            (e.loading = !!t), this.setState(e);
                        }),
                        (e.prototype.gatewaySelect = function (t) {
                            void 0 === t && (t = null);
                            var e = this.state;
                            t ? ((e.gateway = t), this.setState(e), this.getMethod(t)) : ((e.gateway = {}), this.setState(e));
                        }),
                        (e.prototype.render = function () {
                            return s.h(
                                u.IntlProvider,
                                { definition: this.state.translations },
                                s.h(
                                    "div",
                                    { class: "msp-container-ui " + (this.globalSettings.template.settings && this.globalSettings.template.settings.embed_mode ? "embed-mode" : "no-emed-mode") },
                                    s.h(
                                        "div",
                                        null,
                                        this.state.loading
                                            ? s.h(h.UiLoading, null)
                                            : s.h(
                                            "div",
                                            null,
                                            !this.state.gateway.id && this.state.appConfig.gateways.methods && this.state.appConfig.gateways.methods.length > 0
                                                ? s.h("div", null, s.h(l.PaymentMethods, { onLoading: this.setLoading, appEvents: this.props.appEvents, onGatewaySelect: this.gatewaySelect, gateways: this.state.appConfig.gateways }))
                                                : null,
                                            this.state.gateway.id
                                                ? s.h(
                                                "div",
                                                null,
                                                s.h(p.PaymentMethodForm, {
                                                    appEvents: this.props.appEvents,
                                                    onGatewaySelect: this.gatewaySelect,
                                                    onLoading: this.setLoading,
                                                    appConfig: this.props.appConfig,
                                                    onLoad: this.props.onLoad,
                                                    onError: this.props.onError,
                                                    onSubmit: this.props.onSubmit,
                                                    onSelect: this.props.onSelect,
                                                    hasErrors: this.props.hasErrors,
                                                    gatewayData: this.state.gatewayData,
                                                })
                                                )
                                                : null
                                            )
                                    )
                                )
                            );
                        }),
                        e
                );
            })(s.Component);
        e.DropinApp = g;
    },
    function (t, e, n) {
        "use strict";
        var r,
            i =
                (this && this.__extends) ||
                ((r = function (t, e) {
                    return (r =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function (t, e) {
                                t.__proto__ = e;
                            }) ||
                        function (t, e) {
                            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                        })(t, e);
                }),
                    function (t, e) {
                        function n() {
                            this.constructor = t;
                        }
                        r(t, e), (t.prototype = null === e ? Object.create(e) : ((n.prototype = e.prototype), new n()));
                    });
        Object.defineProperty(e, "__esModule", { value: !0 });
        var o = n(0),
            a = n(9),
            s = (function (t) {
                function e(e) {
                    return t.call(this, e) || this;
                }
                return (
                    i(e, t),
                        (e.prototype.render = function (t) {
                            var e = this,
                                n = t.gateways.methods.map(function (t) {
                                    return o.h(
                                        "div",
                                        {
                                            class: "msp-ui-method-item",
                                            onClick: function () {
                                                return e.props.onGatewaySelect(t);
                                            },
                                            key: t.id,
                                        },
                                        o.h(a.PaymentMethodImage, { item: t, cssClass: "msp-ui-method-image" }),
                                        o.h("span", null, t.label)
                                    );
                                });
                            return o.h("div", { class: "msp-ui-payment-methods" }, n);
                        }),
                        e
                );
            })(o.Component);
        e.PaymentMethods = s;
    },
    function (t, e, n) {
        "use strict";
        var r,
            i =
                (this && this.__extends) ||
                ((r = function (t, e) {
                    return (r =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function (t, e) {
                                t.__proto__ = e;
                            }) ||
                        function (t, e) {
                            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                        })(t, e);
                }),
                    function (t, e) {
                        function n() {
                            this.constructor = t;
                        }
                        r(t, e), (t.prototype = null === e ? Object.create(e) : ((n.prototype = e.prototype), new n()));
                    });
        Object.defineProperty(e, "__esModule", { value: !0 });
        var o = n(0),
            a = n(5),
            s = n(32),
            u = n(4),
            l = n(1),
            p = n(2),
            c = (function (t) {
                function e(e) {
                    var n = t.call(this, e) || this;
                    n.state = { redirectConfig: null, container: null, loading: !1, translations: null };
                    var r = n.state;
                    (r.loading = !0), (r.redirectConfig = e.redirectConfig), n.setState(r);
                    var i = l.Globals.getSetting("locale");
                    return (n.state.translations = p.Locale.init(i)), n;
                }
                return (
                    i(e, t),
                        (e.prototype.handleRedirect = function () {
                            var t = document.querySelector(this.state.redirectConfig.container);
                            if (this.state.redirectConfig.order)
                                if (this.state.redirectConfig.order.customer_verification) {
                                    if ("form" == this.state.redirectConfig.order.customer_verification.type) {
                                        var e = document.createElement("div");
                                        for (e.innerHTML = this.state.redirectConfig.order.customer_verification.html; e.firstChild; ) t.appendChild(e.firstChild);
                                        document.querySelector(this.state.redirectConfig.container + " > form").submit();
                                    }
                                } else this.state.redirectConfig.order.qr_url || (this.state.redirectConfig.order.payment_url && (window.location.href = this.state.redirectConfig.order.payment_url));
                        }),
                        (e.prototype.componentDidMount = function () {
                            var t = this;
                            this.handleRedirect(),
                                setTimeout(function () {
                                    var e = t.state;
                                    (e.loading = !1), t.setState(e);
                                }, 1e3);
                        }),
                        (e.prototype.render = function () {
                            return o.h(
                                a.IntlProvider,
                                { definition: this.state.translations },
                                o.h(
                                    "div",
                                    { class: "msp-container-ui" },
                                    o.h(
                                        "div",
                                        null,
                                        o.h(
                                            "div",
                                            { class: "msp-redirect-form" },
                                            this.state.loading
                                                ? o.h(u.UiLoading, null)
                                                : o.h("div", null, this.state.redirectConfig.order.qr_url ? o.h(s.PaymentQr, { item: this.state.redirectConfig.order, cssClass: "method-image-qr-code" }) : null)
                                        )
                                    )
                                )
                            );
                        }),
                        e
                );
            })(o.Component);
        e.RedirectionApp = c;
    },
    function (t, e, n) {
        "use strict";
        var r,
            i =
                (this && this.__extends) ||
                ((r = function (t, e) {
                    return (r =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function (t, e) {
                                t.__proto__ = e;
                            }) ||
                        function (t, e) {
                            for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                        })(t, e);
                }),
                    function (t, e) {
                        function n() {
                            this.constructor = t;
                        }
                        r(t, e), (t.prototype = null === e ? Object.create(e) : ((n.prototype = e.prototype), new n()));
                    });
        Object.defineProperty(e, "__esModule", { value: !0 });
        var o = n(0),
            a = (function (t) {
                function e() {
                    return (null !== t && t.apply(this, arguments)) || this;
                }
                return (
                    i(e, t),
                        (e.prototype.render = function (t) {
                            var e = t.item,
                                n = t.cssClass;
                            return o.h("span", { class: n }, o.h("img", { src: e.qr_url }));
                        }),
                        e
                );
            })(o.Component);
        e.PaymentQr = a;
    },
    function (t, e, n) {
        "use strict";
        var r,
            i = "object" == typeof Reflect ? Reflect : null,
            o =
                i && "function" == typeof i.apply
                    ? i.apply
                    : function (t, e, n) {
                        return Function.prototype.apply.call(t, e, n);
                    };
        r =
            i && "function" == typeof i.ownKeys
                ? i.ownKeys
                : Object.getOwnPropertySymbols
                ? function (t) {
                    return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t));
                }
                : function (t) {
                    return Object.getOwnPropertyNames(t);
                };
        var a =
            Number.isNaN ||
            function (t) {
                return t != t;
            };
        function s() {
            s.init.call(this);
        }
        (t.exports = s), (s.EventEmitter = s), (s.prototype._events = void 0), (s.prototype._eventsCount = 0), (s.prototype._maxListeners = void 0);
        var u = 10;
        function l(t) {
            if ("function" != typeof t) throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof t);
        }
        function p(t) {
            return void 0 === t._maxListeners ? s.defaultMaxListeners : t._maxListeners;
        }
        function c(t, e, n, r) {
            var i, o, a;
            if (
                (l(n),
                    void 0 === (o = t._events) ? ((o = t._events = Object.create(null)), (t._eventsCount = 0)) : (void 0 !== o.newListener && (t.emit("newListener", e, n.listener ? n.listener : n), (o = t._events)), (a = o[e])),
                void 0 === a)
            )
                (a = o[e] = n), ++t._eventsCount;
            else if (("function" == typeof a ? (a = o[e] = r ? [n, a] : [a, n]) : r ? a.unshift(n) : a.push(n), (i = p(t)) > 0 && a.length > i && !a.warned)) {
                a.warned = !0;
                var s = new Error("Possible EventEmitter memory leak detected. " + a.length + " " + String(e) + " listeners added. Use emitter.setMaxListeners() to increase limit");
                (s.name = "MaxListenersExceededWarning"), (s.emitter = t), (s.type = e), (s.count = a.length), console && console.warn;
            }
            return t;
        }
        function d() {
            if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), (this.fired = !0), 0 === arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
        }
        function f(t, e, n) {
            var r = { fired: !1, wrapFn: void 0, target: t, type: e, listener: n },
                i = d.bind(r);
            return (i.listener = n), (r.wrapFn = i), i;
        }
        function h(t, e, n) {
            var r = t._events;
            if (void 0 === r) return [];
            var i = r[e];
            return void 0 === i
                ? []
                : "function" == typeof i
                    ? n
                        ? [i.listener || i]
                        : [i]
                    : n
                        ? (function (t) {
                            for (var e = new Array(t.length), n = 0; n < e.length; ++n) e[n] = t[n].listener || t[n];
                            return e;
                        })(i)
                        : g(i, i.length);
        }
        function y(t) {
            var e = this._events;
            if (void 0 !== e) {
                var n = e[t];
                if ("function" == typeof n) return 1;
                if (void 0 !== n) return n.length;
            }
            return 0;
        }
        function g(t, e) {
            for (var n = new Array(e), r = 0; r < e; ++r) n[r] = t[r];
            return n;
        }
        Object.defineProperty(s, "defaultMaxListeners", {
            enumerable: !0,
            get: function () {
                return u;
            },
            set: function (t) {
                if ("number" != typeof t || t < 0 || a(t)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + t + ".");
                u = t;
            },
        }),
            (s.init = function () {
                (void 0 !== this._events && this._events !== Object.getPrototypeOf(this)._events) || ((this._events = Object.create(null)), (this._eventsCount = 0)), (this._maxListeners = this._maxListeners || void 0);
            }),
            (s.prototype.setMaxListeners = function (t) {
                if ("number" != typeof t || t < 0 || a(t)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + t + ".");
                return (this._maxListeners = t), this;
            }),
            (s.prototype.getMaxListeners = function () {
                return p(this);
            }),
            (s.prototype.emit = function (t) {
                for (var e = [], n = 1; n < arguments.length; n++) e.push(arguments[n]);
                var r = "error" === t,
                    i = this._events;
                if (void 0 !== i) r = r && void 0 === i.error;
                else if (!r) return !1;
                if (r) {
                    var a;
                    if ((e.length > 0 && (a = e[0]), a instanceof Error)) throw a;
                    var s = new Error("Unhandled error." + (a ? " (" + a.message + ")" : ""));
                    throw ((s.context = a), s);
                }
                var u = i[t];
                if (void 0 === u) return !1;
                if ("function" == typeof u) o(u, this, e);
                else {
                    var l = u.length,
                        p = g(u, l);
                    for (n = 0; n < l; ++n) o(p[n], this, e);
                }
                return !0;
            }),
            (s.prototype.addListener = function (t, e) {
                return c(this, t, e, !1);
            }),
            (s.prototype.on = s.prototype.addListener),
            (s.prototype.prependListener = function (t, e) {
                return c(this, t, e, !0);
            }),
            (s.prototype.once = function (t, e) {
                return l(e), this.on(t, f(this, t, e)), this;
            }),
            (s.prototype.prependOnceListener = function (t, e) {
                return l(e), this.prependListener(t, f(this, t, e)), this;
            }),
            (s.prototype.removeListener = function (t, e) {
                var n, r, i, o, a;
                if ((l(e), void 0 === (r = this._events))) return this;
                if (void 0 === (n = r[t])) return this;
                if (n === e || n.listener === e) 0 == --this._eventsCount ? (this._events = Object.create(null)) : (delete r[t], r.removeListener && this.emit("removeListener", t, n.listener || e));
                else if ("function" != typeof n) {
                    for (i = -1, o = n.length - 1; o >= 0; o--)
                        if (n[o] === e || n[o].listener === e) {
                            (a = n[o].listener), (i = o);
                            break;
                        }
                    if (i < 0) return this;
                    0 === i
                        ? n.shift()
                        : (function (t, e) {
                            for (; e + 1 < t.length; e++) t[e] = t[e + 1];
                            t.pop();
                        })(n, i),
                    1 === n.length && (r[t] = n[0]),
                    void 0 !== r.removeListener && this.emit("removeListener", t, a || e);
                }
                return this;
            }),
            (s.prototype.off = s.prototype.removeListener),
            (s.prototype.removeAllListeners = function (t) {
                var e, n, r;
                if (void 0 === (n = this._events)) return this;
                if (void 0 === n.removeListener)
                    return 0 === arguments.length ? ((this._events = Object.create(null)), (this._eventsCount = 0)) : void 0 !== n[t] && (0 == --this._eventsCount ? (this._events = Object.create(null)) : delete n[t]), this;
                if (0 === arguments.length) {
                    var i,
                        o = Object.keys(n);
                    for (r = 0; r < o.length; ++r) "removeListener" !== (i = o[r]) && this.removeAllListeners(i);
                    return this.removeAllListeners("removeListener"), (this._events = Object.create(null)), (this._eventsCount = 0), this;
                }
                if ("function" == typeof (e = n[t])) this.removeListener(t, e);
                else if (void 0 !== e) for (r = e.length - 1; r >= 0; r--) this.removeListener(t, e[r]);
                return this;
            }),
            (s.prototype.listeners = function (t) {
                return h(this, t, !0);
            }),
            (s.prototype.rawListeners = function (t) {
                return h(this, t, !1);
            }),
            (s.listenerCount = function (t, e) {
                return "function" == typeof t.listenerCount ? t.listenerCount(e) : y.call(t, e);
            }),
            (s.prototype.listenerCount = y),
            (s.prototype.eventNames = function () {
                return this._eventsCount > 0 ? r(this._events) : [];
            });
    },
    function (t, e, n) {
        t.exports = n.p + "components.css";
    },
]);
