import {
  require_react
} from "./chunk-DQW77RHJ.js";
import {
  __toESM
} from "./chunk-4MBMRILA.js";

// node_modules/@react-hook/passive-layout-effect/dist/module/index.js
var import_react = __toESM(require_react());
var usePassiveLayoutEffect = import_react.default[typeof document !== "undefined" && document.createElement !== void 0 ? "useLayoutEffect" : "useEffect"];
var module_default = usePassiveLayoutEffect;

// node_modules/@react-hook/latest/dist/module/index.js
var React2 = __toESM(require_react());
var useLatest = (current) => {
  const storedValue = React2.useRef(current);
  React2.useEffect(() => {
    storedValue.current = current;
  });
  return storedValue;
};
var module_default2 = useLatest;

// node_modules/@react-hook/resize-observer/dist/module/index.js
function _ref() {
}
function useResizeObserver(target, callback, options = {}) {
  const resizeObserver = getResizeObserver(options.polyfill);
  const storedCallback = module_default2(callback);
  module_default(() => {
    let didUnsubscribe = false;
    const targetEl = target && "current" in target ? target.current : target;
    if (!targetEl) return _ref;
    function cb(entry, observer) {
      if (didUnsubscribe) return;
      storedCallback.current(entry, observer);
    }
    resizeObserver.subscribe(targetEl, cb);
    return () => {
      didUnsubscribe = true;
      resizeObserver.unsubscribe(targetEl, cb);
    };
  }, [target, resizeObserver, storedCallback]);
  return resizeObserver.observer;
}
function createResizeObserver(polyfill) {
  let ticking = false;
  let allEntries = [];
  const callbacks = /* @__PURE__ */ new Map();
  const observer = new (polyfill || window.ResizeObserver)((entries, obs) => {
    allEntries = allEntries.concat(entries);
    function _ref2() {
      const triggered = /* @__PURE__ */ new Set();
      for (let i = 0; i < allEntries.length; i++) {
        if (triggered.has(allEntries[i].target)) continue;
        triggered.add(allEntries[i].target);
        const cbs = callbacks.get(allEntries[i].target);
        cbs === null || cbs === void 0 ? void 0 : cbs.forEach((cb) => cb(allEntries[i], obs));
      }
      allEntries = [];
      ticking = false;
    }
    if (!ticking) {
      window.requestAnimationFrame(_ref2);
    }
    ticking = true;
  });
  return {
    observer,
    subscribe(target, callback) {
      var _callbacks$get;
      observer.observe(target);
      const cbs = (_callbacks$get = callbacks.get(target)) !== null && _callbacks$get !== void 0 ? _callbacks$get : [];
      cbs.push(callback);
      callbacks.set(target, cbs);
    },
    unsubscribe(target, callback) {
      var _callbacks$get2;
      const cbs = (_callbacks$get2 = callbacks.get(target)) !== null && _callbacks$get2 !== void 0 ? _callbacks$get2 : [];
      if (cbs.length === 1) {
        observer.unobserve(target);
        callbacks.delete(target);
        return;
      }
      const cbIndex = cbs.indexOf(callback);
      if (cbIndex !== -1) cbs.splice(cbIndex, 1);
      callbacks.set(target, cbs);
    }
  };
}
var _resizeObserver;
var getResizeObserver = (polyfill) => !_resizeObserver ? _resizeObserver = createResizeObserver(polyfill) : _resizeObserver;
var module_default3 = useResizeObserver;
export {
  module_default3 as default
};
//# sourceMappingURL=@react-hook_resize-observer.js.map
