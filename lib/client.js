window.__ModuleLoader__.load({
  id: "colorguess-dsh-plugin",
  factory: function (require) {
    const module = { exports: {} }
    ;(function (require, module, exports) {
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var client_exports = {};
__export(client_exports, {
  DEFAULT_GAME_URL: () => DEFAULT_GAME_URL,
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);

// src/client/GameAction.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var THEME_MESSAGE_SOURCE = "colorguess-dsh";
var TRIGGER_STYLE = {
  border: "none",
  background: "none",
  cursor: "pointer",
  color: "var(--dsw-text-secondary)",
  fontSize: 13,
  fontWeight: 600,
  padding: "4px 8px",
  borderRadius: 6,
  whiteSpace: "nowrap"
};
var WIN_WIDTH = 440;
var WIN_HEIGHT = 720;
var MIN_WIDTH = 300;
var MIN_HEIGHT = 480;
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function palette(theme) {
  return theme === "dark" ? { bg: "#0f1115", text: "#eceef2", secondary: "#a3aab6", border: "rgba(236,238,242,0.12)" } : { bg: "#f4f5f7", text: "#16181d", secondary: "#16181d", border: "rgba(22,24,29,0.10)" };
}
function FloatingWindow({
  gameUrl,
  theme,
  iframeRef,
  onClose
}) {
  const [pos, setPos] = (0, import_react.useState)(() => ({
    left: Math.max(8, window.innerWidth - WIN_WIDTH - 16),
    top: 48
  }));
  const [size, setSize] = (0, import_react.useState)({ width: WIN_WIDTH, height: WIN_HEIGHT });
  const dragRef = (0, import_react.useRef)(null);
  const resizeRef = (0, import_react.useRef)(null);
  const startDrag = (event) => {
    if (event.target.closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      origLeft: pos.left,
      origTop: pos.top
    };
  };
  const onDragMove = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    const left = clamp(drag.origLeft + event.clientX - drag.startX, 0, window.innerWidth - size.width);
    const top = clamp(drag.origTop + event.clientY - drag.startY, 0, window.innerHeight - 32);
    setPos({ left, top });
  };
  const endDrag = (event) => {
    dragRef.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
    }
  };
  const startResize = (event, corner) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      origW: size.width,
      origH: size.height,
      origLeft: pos.left,
      corner
    };
  };
  const onResizeMove = (event) => {
    const resizing = resizeRef.current;
    if (!resizing) return;
    const dx = event.clientX - resizing.startX;
    const dy = event.clientY - resizing.startY;
    let left = resizing.origLeft;
    let width;
    if (resizing.corner === "se") {
      width = clamp(resizing.origW + dx, MIN_WIDTH, window.innerWidth - resizing.origLeft);
    } else {
      left = clamp(resizing.origLeft + dx, 0, resizing.origLeft + resizing.origW - MIN_WIDTH);
      width = resizing.origLeft + resizing.origW - left;
    }
    const height = clamp(resizing.origH + dy, MIN_HEIGHT, window.innerHeight - pos.top - 8);
    setPos({ left, top: pos.top });
    setSize({ width, height });
  };
  const endResize = (event) => {
    resizeRef.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
    }
  };
  const p = palette(theme);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      style: {
        position: "fixed",
        left: pos.left,
        top: pos.top,
        width: size.width,
        height: size.height,
        zIndex: 9999,
        background: p.bg,
        border: `1px solid ${p.border}`,
        borderRadius: 12,
        boxShadow: "0 8px 40px rgba(0, 0, 0, 0.35)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "div",
          {
            onPointerDown: startDrag,
            onPointerMove: onDragMove,
            onPointerUp: endDrag,
            onPointerCancel: endDrag,
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 8px 6px 12px",
              cursor: "move",
              touchAction: "none",
              userSelect: "none",
              background: p.bg,
              borderBottom: `1px solid ${p.border}`,
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: p.text, fontSize: 13, fontWeight: 700 }, children: "ColorGuess" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  onPointerDown: (event) => event.stopPropagation(),
                  style: {
                    border: "none",
                    cursor: "pointer",
                    background: "transparent",
                    color: p.secondary,
                    fontSize: 14,
                    fontWeight: 600,
                    padding: "4px 8px",
                    borderRadius: 6,
                    lineHeight: 1
                  },
                  children: "\u2715"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "iframe",
          {
            ref: iframeRef,
            src: gameUrl,
            title: "ColorGuess",
            style: { flex: 1, border: "none", width: "100%" }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            onPointerDown: (event) => startResize(event, "se"),
            onPointerMove: onResizeMove,
            onPointerUp: endResize,
            onPointerCancel: endResize,
            style: {
              position: "absolute",
              right: 0,
              bottom: 0,
              width: 18,
              height: 18,
              cursor: "nwse-resize",
              touchAction: "none"
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            onPointerDown: (event) => startResize(event, "sw"),
            onPointerMove: onResizeMove,
            onPointerUp: endResize,
            onPointerCancel: endResize,
            style: {
              position: "absolute",
              left: 0,
              bottom: 0,
              width: 18,
              height: 18,
              cursor: "nesw-resize",
              touchAction: "none"
            }
          }
        )
      ]
    }
  );
}
function GameAction({ gameUrl, subscribeTheme }) {
  const [open, setOpen] = (0, import_react.useState)(false);
  const [theme, setTheme] = (0, import_react.useState)(
    () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );
  const iframeRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  (0, import_react.useEffect)(() => {
    if (!open || typeof subscribeTheme !== "function") return;
    return subscribeTheme((next) => {
      setTheme(next);
      iframeRef.current?.contentWindow?.postMessage(
        { source: THEME_MESSAGE_SOURCE, theme: next },
        "*"
      );
    });
  }, [open, subscribeTheme]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "button",
      {
        type: "button",
        style: TRIGGER_STYLE,
        "aria-expanded": open,
        onClick: () => setOpen((current) => !current),
        children: "ColorGuess"
      }
    ),
    open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      FloatingWindow,
      {
        gameUrl,
        theme,
        iframeRef,
        onClose: () => setOpen(false)
      }
    ) : null
  ] });
}

// src/client/index.ts
var inject = ["slots", "theme"];
var DEFAULT_GAME_URL = "https://hdnray.github.io/colorguess/";
function apply(ctx, config = {}) {
  const gameUrl = config.gameUrl ?? DEFAULT_GAME_URL;
  ctx.slots.inject(
    "conversation.session.header.actions",
    () => ctx.slots.register({
      name: "conversation.session.header.actions",
      id: "colorguess-game",
      order: 100,
      inject: () => ({
        gameUrl,
        /**
         * Subscribe to host theme changes; calls back immediately with the
         * current resolved theme and on every change. Returns an unsubscribe.
         */
        subscribeTheme: (listener) => {
          const onChange = (snapshot) => {
            listener(snapshot.active.colorScheme === "dark" ? "dark" : "light");
          };
          const dispose = ctx.on("theme/change", onChange);
          const themeService = ctx.theme;
          const readSnapshot = () => {
            if (typeof themeService.getTheme === "function") {
              return themeService.getTheme();
            }
            if (typeof themeService.snapshot === "function") {
              return themeService.snapshot();
            }
            if (themeService.snapshot !== null && typeof themeService.snapshot === "object") {
              return themeService.snapshot;
            }
            return void 0;
          };
          const initial = readSnapshot();
          if (initial !== void 0) onChange(initial);
          return () => {
            if (typeof dispose === "function") dispose();
          };
        }
      })
    }, GameAction)
  );
}

    })(require, module, module.exports)
    return module.exports
  },
});
