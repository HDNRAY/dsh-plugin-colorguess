/**
 * Session-header action for ColorGuess: a trigger button that toggles a
 * draggable, resizable floating window (default top-right) holding the game
 * in an iframe. The window tracks the host theme and matches the game's
 * palette so the title bar blends with the game background.
 */
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { HostTheme } from './index.ts'

export type GameActionProps = PropsRuntime<'conversation.session.header.actions'> & {
  /** Where the game is hosted (from the plugin row config). */
  gameUrl: string
  /** Subscribe to the host's resolved theme (immediate + on change). */
  subscribeTheme?: (listener: (theme: HostTheme) => void) => () => void
}

const THEME_MESSAGE_SOURCE = 'colorguess-dsh'

const TRIGGER_STYLE: CSSProperties = {
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: 'var(--dsw-text-secondary)',
  fontSize: 13,
  fontWeight: 600,
  padding: '4px 8px',
  borderRadius: 6,
  whiteSpace: 'nowrap',
}

// Default window fits the game's phone-frame layout without scrolling.
const WIN_WIDTH = 440
const WIN_HEIGHT = 720
const MIN_WIDTH = 300
const MIN_HEIGHT = 480

/** Clamp a value into [min, max]. */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/** Theme palette mirroring the game's tokens, so the window blends with it. */
function palette(theme: HostTheme): {
  bg: string
  text: string
  secondary: string
  border: string
} {
  return theme === 'dark'
    ? { bg: '#0f1115', text: '#eceef2', secondary: '#a3aab6', border: 'rgba(236,238,242,0.12)' }
    : { bg: '#f4f5f7', text: '#16181d', secondary: '#16181d', border: 'rgba(22,24,29,0.10)' }
}

/** Draggable, resizable floating window hosting the game. */
function FloatingWindow({
  gameUrl,
  theme,
  iframeRef,
  onClose,
}: {
  gameUrl: string
  theme: HostTheme
  iframeRef: RefObject<HTMLIFrameElement | null>
  onClose: () => void
}) {
  const [pos, setPos] = useState(() => ({
    left: Math.max(8, window.innerWidth - WIN_WIDTH - 16),
    top: 48,
  }))
  const [size, setSize] = useState({ width: WIN_WIDTH, height: WIN_HEIGHT })
  const dragRef = useRef<{
    startX: number
    startY: number
    origLeft: number
    origTop: number
  } | null>(null)
  const resizeRef = useRef<{
    startX: number
    startY: number
    origW: number
    origH: number
  } | null>(null)

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>): void => {
    // Capture the pointer so move/up keep firing even outside the window —
    // releasing anywhere stops the drag.
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      origLeft: pos.left,
      origTop: pos.top,
    }
  }

  const onDragMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    const drag = dragRef.current
    if (!drag) return
    const left = clamp(drag.origLeft + event.clientX - drag.startX, 0, window.innerWidth - size.width)
    const top = clamp(drag.origTop + event.clientY - drag.startY, 0, window.innerHeight - 32)
    setPos({ left, top })
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>): void => {
    dragRef.current = null
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {
      /* pointer already released */
    }
  }

  const startResize = (event: ReactPointerEvent<HTMLDivElement>): void => {
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    resizeRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      origW: size.width,
      origH: size.height,
    }
  }

  const onResizeMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    const resizing = resizeRef.current
    if (!resizing) return
    const width = clamp(resizing.origW + event.clientX - resizing.startX, MIN_WIDTH, window.innerWidth - pos.left)
    const height = clamp(resizing.origH + event.clientY - resizing.startY, MIN_HEIGHT, window.innerHeight - pos.top - 8)
    setSize({ width, height })
  }

  const endResize = (event: ReactPointerEvent<HTMLDivElement>): void => {
    resizeRef.current = null
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {
      /* pointer already released */
    }
  }

  const p = palette(theme)

  return (
    <div
      style={{
        position: 'fixed',
        left: pos.left,
        top: pos.top,
        width: size.width,
        height: size.height,
        zIndex: 9999,
        background: p.bg,
        border: `1px solid ${p.border}`,
        borderRadius: 12,
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        onPointerDown={startDrag}
        onPointerMove={onDragMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 8px 6px 12px',
          cursor: 'move',
          touchAction: 'none',
          userSelect: 'none',
          background: p.bg,
          borderBottom: `1px solid ${p.border}`,
          flexShrink: 0,
        }}
      >
        <span style={{ color: p.text, fontSize: 13, fontWeight: 700 }}>
          ColorGuess
        </span>
        <button
          type="button"
          onClick={onClose}
          style={{
            border: 'none',
            cursor: 'pointer',
            background: 'transparent',
            color: p.secondary,
            fontSize: 14,
            fontWeight: 600,
            padding: '4px 8px',
            borderRadius: 6,
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>
      <iframe
        ref={iframeRef}
        src={gameUrl}
        title="ColorGuess"
        style={{ flex: 1, border: 'none', width: '100%' }}
      />
      {/* invisible resize hotspot — cursor shows the affordance */}
      <div
        onPointerDown={startResize}
        onPointerMove={onResizeMove}
        onPointerUp={endResize}
        onPointerCancel={endResize}
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: 18,
          height: 18,
          cursor: 'nwse-resize',
          touchAction: 'none',
        }}
      />
    </div>
  )
}

/**
 * Header entry point: toggles the floating game window, tracks the host theme
 * and forwards it into the iframe. Closes on Escape.
 * @param props - runtime slot currency plus the game URL and theme hook.
 */
export function GameAction({ gameUrl, subscribeTheme }: GameActionProps) {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<HostTheme>(() =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
  )
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Track the host theme (styles the window) and forward it into the game.
  useEffect(() => {
    if (!open || typeof subscribeTheme !== 'function') return
    return subscribeTheme((next) => {
      setTheme(next)
      iframeRef.current?.contentWindow?.postMessage(
        { source: THEME_MESSAGE_SOURCE, theme: next },
        '*',
      )
    })
  }, [open, subscribeTheme])

  return (
    <>
      <button
        type="button"
        style={TRIGGER_STYLE}
        aria-expanded={open}
        onClick={() => setOpen(current => !current)}
      >
        ColorGuess
      </button>
      {open ? (
        <FloatingWindow
          gameUrl={gameUrl}
          theme={theme}
          iframeRef={iframeRef}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  )
}
