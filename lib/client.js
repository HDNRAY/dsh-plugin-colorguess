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
var CLOSE_STYLE = {
  border: "none",
  cursor: "pointer",
  background: "var(--dsw-surface-2)",
  color: "var(--dsw-text-secondary)",
  fontSize: 13,
  fontWeight: 600,
  padding: "4px 10px",
  borderRadius: 6,
  lineHeight: 1
};
var WIN_WIDTH = 440;
var WIN_HEIGHT = 720;
var MIN_WIDTH = 300;
var MIN_HEIGHT = 480;
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function FloatingWindow({
  gameUrl,
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
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      origLeft: pos.left,
      origTop: pos.top
    };
    const onMove = (move) => {
      const drag = dragRef.current;
      if (!drag) return;
      const left = clamp(drag.origLeft + move.clientX - drag.startX, 0, window.innerWidth - size.width);
      const top = clamp(drag.origTop + move.clientY - drag.startY, 0, window.innerHeight - 32);
      setPos({ left, top });
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };
  const startResize = (event) => {
    event.stopPropagation();
    resizeRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      origW: size.width,
      origH: size.height
    };
    const onMove = (move) => {
      const resizing = resizeRef.current;
      if (!resizing) return;
      const width = clamp(resizing.origW + move.clientX - resizing.startX, MIN_WIDTH, window.innerWidth - pos.left);
      const height = clamp(resizing.origH + move.clientY - resizing.startY, MIN_HEIGHT, window.innerHeight - pos.top - 8);
      setSize({ width, height });
    };
    const onUp = () => {
      resizeRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };
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
        background: "var(--dsw-bg)",
        border: "1px solid var(--dsw-border)",
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
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 8px 6px 12px",
              cursor: "move",
              touchAction: "none",
              userSelect: "none",
              // Solid bar — explicit fallbacks so it is never transparent even if
              // the shell theme tokens are unavailable.
              background: "var(--dsw-surface, #ffffff)",
              borderBottom: "1px solid var(--dsw-border, rgba(128,128,128,0.3))",
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "var(--dsw-text)", fontSize: 13, fontWeight: 700 }, children: "ColorGuess" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: CLOSE_STYLE, onClick: onClose, children: "\u2715" })
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
            onPointerDown: startResize,
            title: "Drag to resize",
            style: {
              position: "absolute",
              right: 0,
              bottom: 0,
              width: 20,
              height: 20,
              cursor: "nwse-resize",
              touchAction: "none",
              // visible diagonal grip triangle in the corner
              background: "linear-gradient(135deg, transparent 50%, var(--dsw-text-muted, #888888) 50%)",
              borderBottomRightRadius: 12
            }
          }
        )
      ]
    }
  );
}
function GameAction({ gameUrl, subscribeTheme }) {
  const [open, setOpen] = (0, import_react.useState)(false);
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
    return subscribeTheme((theme) => {
      iframeRef.current?.contentWindow?.postMessage(
        { source: THEME_MESSAGE_SOURCE, theme },
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
