/*
 Copyright (C) Federico Zivolo 2018
 Distributed under the MIT License (license terms are at http://opensource.org/licenses/MIT).
 */ function a(a, b) {
  if (1 !== a.nodeType) return [];
  const c = getComputedStyle(a, null);
  return b ? c[b] : c;
}
function b(a) {
  return "HTML" === a.nodeName ? a : a.parentNode || a.host;
}
function c(d) {
  if (!d) return document.body;
  switch (d.nodeName) {
    case "HTML":
    case "BODY":
      return d.ownerDocument.body;
    case "#document":
      return d.body;
  }
  const { overflow: e, overflowX: f, overflowY: g } = a(d);
  return /(auto|scroll|overlay)/.test(e + g + f) ? d : c(b(d));
}
var d = "undefined" != typeof window && "undefined" != typeof document;
const e = d && !!(window.MSInputMethodContext && document.documentMode),
  f = d && /MSIE 10/.test(navigator.userAgent);
function g(a) {
  return 11 === a ? e : 10 === a ? f : e || f;
}
function h(b) {
  if (!b) return document.documentElement;
  const c = g(10) ? document.body : null;
  let d = b.offsetParent;
  for (; d === c && b.nextElementSibling; )
    d = (b = b.nextElementSibling).offsetParent;
  const e = d && d.nodeName;
  return e && "BODY" !== e && "HTML" !== e
    ? -1 !== ["TD", "TABLE"].indexOf(d.nodeName) &&
      "static" === a(d, "position")
      ? h(d)
      : d
    : b
    ? b.ownerDocument.documentElement
    : document.documentElement;
}
function i(a) {
  const { nodeName: b } = a;
  return "BODY" !== b && ("HTML" === b || h(a.firstElementChild) === a);
}
function j(a) {
  return null === a.parentNode ? a : j(a.parentNode);
}
function k(a, b) {
  if (!a || !a.nodeType || !b || !b.nodeType) return document.documentElement;
  const c = a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING,
    d = c ? a : b,
    e = c ? b : a,
    f = document.createRange();
  f.setStart(d, 0), f.setEnd(e, 0);
  const { commonAncestorContainer: g } = f;
  if ((a !== g && b !== g) || d.contains(e)) return i(g) ? g : h(g);
  const l = j(a);
  return l.host ? k(l.host, b) : k(a, j(b).host);
}
function l(a, b = "top") {
  const c = "top" === b ? "scrollTop" : "scrollLeft",
    d = a.nodeName;
  if ("BODY" === d || "HTML" === d) {
    const b = a.ownerDocument.documentElement,
      d = a.ownerDocument.scrollingElement || b;
    return d[c];
  }
  return a[c];
}
function m(a, b, c = !1) {
  const d = l(b, "top"),
    e = l(b, "left"),
    f = c ? -1 : 1;
  return (
    (a.top += d * f),
    (a.bottom += d * f),
    (a.left += e * f),
    (a.right += e * f),
    a
  );
}
function n(a, b) {
  const c = "x" === b ? "Left" : "Top",
    d = "Left" == c ? "Right" : "Bottom";
  return (
    parseFloat(a[`border${c}Width`], 10) + parseFloat(a[`border${d}Width`], 10)
  );
}
function o(a, b, c, d) {
  return Math.max(
    b[`offset${a}`],
    b[`scroll${a}`],
    c[`client${a}`],
    c[`offset${a}`],
    c[`scroll${a}`],
    g(10)
      ? c[`offset${a}`] +
          d[`margin${"Height" === a ? "Top" : "Left"}`] +
          d[`margin${"Height" === a ? "Bottom" : "Right"}`]
      : 0
  );
}
function p() {
  const a = document.body,
    b = document.documentElement,
    c = g(10) && getComputedStyle(b);
  return { height: o("Height", a, b, c), width: o("Width", a, b, c) };
}
var q =
  Object.assign ||
  function (a) {
    for (var b, c = 1; c < arguments.length; c++)
      for (var d in ((b = arguments[c]), b))
        Object.prototype.hasOwnProperty.call(b, d) && (a[d] = b[d]);
    return a;
  };
function r(a) {
  return q({}, a, { right: a.left + a.width, bottom: a.top + a.height });
}
function s(b) {
  let c = {};
  try {
    if (g(10)) {
      c = b.getBoundingClientRect();
      const a = l(b, "top"),
        d = l(b, "left");
      (c.top += a), (c.left += d), (c.bottom += a), (c.right += d);
    } else c = b.getBoundingClientRect();
  } catch (a) {}
  const d = {
      left: c.left,
      top: c.top,
      width: c.right - c.left,
      height: c.bottom - c.top,
    },
    e = "HTML" === b.nodeName ? p() : {},
    f = e.width || b.clientWidth || d.right - d.left,
    h = e.height || b.clientHeight || d.bottom - d.top;
  let i = b.offsetWidth - f,
    j = b.offsetHeight - h;
  if (i || j) {
    const c = a(b);
    (i -= n(c, "x")), (j -= n(c, "y")), (d.width -= i), (d.height -= j);
  }
  return r(d);
}
function t(b, d, e = !1) {
  var f = Math.max;
  const h = g(10),
    i = "HTML" === d.nodeName,
    j = s(b),
    k = s(d),
    l = c(b),
    n = a(d),
    o = parseFloat(n.borderTopWidth, 10),
    p = parseFloat(n.borderLeftWidth, 10);
  e &&
    "HTML" === d.nodeName &&
    ((k.top = f(k.top, 0)), (k.left = f(k.left, 0)));
  let q = r({
    top: j.top - k.top - o,
    left: j.left - k.left - p,
    width: j.width,
    height: j.height,
  });
  if (((q.marginTop = 0), (q.marginLeft = 0), !h && i)) {
    const a = parseFloat(n.marginTop, 10),
      b = parseFloat(n.marginLeft, 10);
    (q.top -= o - a),
      (q.bottom -= o - a),
      (q.left -= p - b),
      (q.right -= p - b),
      (q.marginTop = a),
      (q.marginLeft = b);
  }
  return (
    (h && !e ? d.contains(l) : d === l && "BODY" !== l.nodeName) &&
      (q = m(q, d)),
    q
  );
}
function u(a, b = !1) {
  var c = Math.max;
  const d = a.ownerDocument.documentElement,
    e = t(a, d),
    f = c(d.clientWidth, window.innerWidth || 0),
    g = c(d.clientHeight, window.innerHeight || 0),
    h = b ? 0 : l(d),
    i = b ? 0 : l(d, "left"),
    j = {
      top: h - e.top + e.marginTop,
      left: i - e.left + e.marginLeft,
      width: f,
      height: g,
    };
  return r(j);
}
function v(c) {
  const d = c.nodeName;
  return "BODY" === d || "HTML" === d
    ? !1
    : !("fixed" !== a(c, "position")) || v(b(c));
}
function w(b) {
  if (!b || !b.parentElement || g()) return document.documentElement;
  let c = b.parentElement;
  for (; c && "none" === a(c, "transform"); ) c = c.parentElement;
  return c || document.documentElement;
}
function x(a, d, e, f, g = !1) {
  let h = { top: 0, left: 0 };
  const i = g ? w(a) : k(a, d);
  if ("viewport" === f) h = u(i, g);
  else {
    let e;
    "scrollParent" === f
      ? ((e = c(b(d))),
        "BODY" === e.nodeName && (e = a.ownerDocument.documentElement))
      : "window" === f
      ? (e = a.ownerDocument.documentElement)
      : (e = f);
    const j = t(e, i, g);
    if ("HTML" === e.nodeName && !v(i)) {
      const { height: a, width: b } = p();
      (h.top += j.top - j.marginTop),
        (h.bottom = a + j.top),
        (h.left += j.left - j.marginLeft),
        (h.right = b + j.left);
    } else h = j;
  }
  return (h.left += e), (h.top += e), (h.right -= e), (h.bottom -= e), h;
}
function y({ width: a, height: b }) {
  return a * b;
}
function z(a, b, c, d, e, f = 0) {
  if (-1 === a.indexOf("auto")) return a;
  const g = x(c, d, f, e),
    h = {
      top: { width: g.width, height: b.top - g.top },
      right: { width: g.right - b.right, height: g.height },
      bottom: { width: g.width, height: g.bottom - b.bottom },
      left: { width: b.left - g.left, height: g.height },
    },
    i = Object.keys(h)
      .map((a) => q({ key: a }, h[a], { area: y(h[a]) }))
      .sort((c, a) => a.area - c.area),
    j = i.filter(
      ({ width: a, height: b }) => a >= c.clientWidth && b >= c.clientHeight
    ),
    k = 0 < j.length ? j[0].key : i[0].key,
    l = a.split("-")[1];
  return k + (l ? `-${l}` : "");
}
const A = ["Edge", "Trident", "Firefox"];
let B = 0;
for (let a = 0; a < A.length; a += 1)
  if (d && 0 <= navigator.userAgent.indexOf(A[a])) {
    B = 1;
    break;
  }
function C(a) {
  let b = !1;
  return () => {
    b ||
      ((b = !0),
      window.Promise.resolve().then(() => {
        (b = !1), a();
      }));
  };
}
function D(a) {
  let b = !1;
  return () => {
    b ||
      ((b = !0),
      setTimeout(() => {
        (b = !1), a();
      }, B));
  };
}
const E = d && window.Promise;
var F = E ? C : D;
function G(a, b) {
  return Array.prototype.find ? a.find(b) : a.filter(b)[0];
}
function H(a, b, c) {
  if (Array.prototype.findIndex) return a.findIndex((a) => a[b] === c);
  const d = G(a, (a) => a[b] === c);
  return a.indexOf(d);
}
function I(a) {
  let b;
  if ("HTML" === a.nodeName) {
    const { width: a, height: c } = p();
    b = { width: a, height: c, left: 0, top: 0 };
  } else
    b = {
      width: a.offsetWidth,
      height: a.offsetHeight,
      left: a.offsetLeft,
      top: a.offsetTop,
    };
  return r(b);
}
function J(a) {
  const b = getComputedStyle(a),
    c = parseFloat(b.marginTop) + parseFloat(b.marginBottom),
    d = parseFloat(b.marginLeft) + parseFloat(b.marginRight),
    e = { width: a.offsetWidth + d, height: a.offsetHeight + c };
  return e;
}
function K(a) {
  const b = { left: "right", right: "left", bottom: "top", top: "bottom" };
  return a.replace(/left|right|bottom|top/g, (a) => b[a]);
}
function L(a, b, c) {
  c = c.split("-")[0];
  const d = J(a),
    e = { width: d.width, height: d.height },
    f = -1 !== ["right", "left"].indexOf(c),
    g = f ? "top" : "left",
    h = f ? "left" : "top",
    i = f ? "height" : "width",
    j = f ? "width" : "height";
  return (
    (e[g] = b[g] + b[i] / 2 - d[i] / 2),
    (e[h] = c === h ? b[h] - d[j] : b[K(h)]),
    e
  );
}
function M(a, b, c, d = null) {
  const e = d ? w(b) : k(b, c);
  return t(c, e, d);
}
function N(a) {
  const b = [!1, "ms", "Webkit", "Moz", "O"],
    c = a.charAt(0).toUpperCase() + a.slice(1);
  for (let d = 0; d < b.length; d++) {
    const e = b[d],
      f = e ? `${e}${c}` : a;
    if ("undefined" != typeof document.body.style[f]) return f;
  }
  return null;
}
function O(a) {
  return a && "[object Function]" === {}.toString.call(a);
}
function P(a, b) {
  return a.some(({ name: a, enabled: c }) => c && a === b);
}
function Q(a, b, c) {
  const d = G(a, ({ name: a }) => a === b),
    e = !!d && a.some((a) => a.name === c && a.enabled && a.order < d.order);
  if (!e) {
    const a = `\`${b}\``,
      d = `\`${c}\``;
    console.warn(
      `${d} modifier is required by ${a} modifier in order to work, be sure to include it before ${a}!`
    );
  }
  return e;
}
function R(a) {
  return "" !== a && !isNaN(parseFloat(a)) && isFinite(a);
}
function S(a) {
  const b = a.ownerDocument;
  return b ? b.defaultView : window;
}
function T(a, b) {
  return (
    S(a).removeEventListener("resize", b.updateBound),
    b.scrollParents.forEach((a) => {
      a.removeEventListener("scroll", b.updateBound);
    }),
    (b.updateBound = null),
    (b.scrollParents = []),
    (b.scrollElement = null),
    (b.eventsEnabled = !1),
    b
  );
}
function U(a, b, c) {
  const d = void 0 === c ? a : a.slice(0, H(a, "name", c));
  return (
    d.forEach((a) => {
      a["function"] &&
        console.warn("`modifier.function` is deprecated, use `modifier.fn`!");
      const c = a["function"] || a.fn;
      a.enabled &&
        O(c) &&
        ((b.offsets.popper = r(b.offsets.popper)),
        (b.offsets.reference = r(b.offsets.reference)),
        (b = c(b, a)));
    }),
    b
  );
}
function V(a, b) {
  Object.keys(b).forEach(function (c) {
    const d = b[c];
    !1 === d ? a.removeAttribute(c) : a.setAttribute(c, b[c]);
  });
}
function W(a, b) {
  Object.keys(b).forEach((c) => {
    let d = "";
    -1 !== ["width", "height", "top", "right", "bottom", "left"].indexOf(c) &&
      R(b[c]) &&
      (d = "px"),
      (a.style[c] = b[c] + d);
  });
}
function X(a, b, d, e) {
  const f = "BODY" === a.nodeName,
    g = f ? a.ownerDocument.defaultView : a;
  g.addEventListener(b, d, { passive: !0 }),
    f || X(c(g.parentNode), b, d, e),
    e.push(g);
}
function Y(a, b, d, e) {
  (d.updateBound = e),
    S(a).addEventListener("resize", d.updateBound, { passive: !0 });
  const f = c(a);
  return (
    X(f, "scroll", d.updateBound, d.scrollParents),
    (d.scrollElement = f),
    (d.eventsEnabled = !0),
    d
  );
}
var Z = {
  computeAutoPlacement: z,
  debounce: F,
  findIndex: H,
  getBordersSize: n,
  getBoundaries: x,
  getBoundingClientRect: s,
  getClientRect: r,
  getOffsetParent: h,
  getOffsetRect: I,
  getOffsetRectRelativeToArbitraryNode: t,
  getOuterSizes: J,
  getParentNode: b,
  getPopperOffsets: L,
  getReferenceOffsets: M,
  getScroll: l,
  getScrollParent: c,
  getStyleComputedProperty: a,
  getSupportedPropertyName: N,
  getWindowSizes: p,
  isFixed: v,
  isFunction: O,
  isModifierEnabled: P,
  isModifierRequired: Q,
  isNumeric: R,
  removeEventListeners: T,
  runModifiers: U,
  setAttributes: V,
  setStyles: W,
  setupEventListeners: Y,
};
export {
  z as computeAutoPlacement,
  F as debounce,
  H as findIndex,
  n as getBordersSize,
  x as getBoundaries,
  s as getBoundingClientRect,
  r as getClientRect,
  h as getOffsetParent,
  I as getOffsetRect,
  t as getOffsetRectRelativeToArbitraryNode,
  J as getOuterSizes,
  b as getParentNode,
  L as getPopperOffsets,
  M as getReferenceOffsets,
  l as getScroll,
  c as getScrollParent,
  a as getStyleComputedProperty,
  N as getSupportedPropertyName,
  p as getWindowSizes,
  v as isFixed,
  O as isFunction,
  P as isModifierEnabled,
  Q as isModifierRequired,
  R as isNumeric,
  T as removeEventListeners,
  U as runModifiers,
  V as setAttributes,
  W as setStyles,
  Y as setupEventListeners,
};
export default Z;
