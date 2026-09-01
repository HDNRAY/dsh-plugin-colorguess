/**
 * Session-header action for ColorGuess: a trigger button that toggles a
 * draggable floating window (default top-right) holding the game in an
 * iframe. The game follows the host theme via postMessage. All visuals use
 * DSH theme tokens (var(--dsw-*)).
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

const CLOSE_STYLE: CSSProperties = {
  border: 'none',
  cursor: 'pointer',
  background: 'var(--dsw-surface-2)',
  color: 'var(--dsw-text-secondary)',
  fontSize: 13,
  fontWeight: 600,
  padding: '4px 10px',
  borderRadius: 6,
  lineHeight: 1,
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

/** Draggable, resizable floating window hosting the game. */
function FloatingWindow({
  gameUrl,
  iframeRef,
  onClose,
}: {
  gameUrl: string
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
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      origLeft: pos.left,
      origTop: pos.top,
    }

    const onMove = (move: PointerEvent): void => {
      const drag = dragRef.current
      if (!drag) return
      const left = clamp(drag.origLeft + move.clientX - drag.startX, 0, window.innerWidth - size.width)
      const top = clamp(drag.origTop + move.clientY - drag.startY, 0, window.innerHeight - 32)
      setPos({ left, top })
    }
    const onUp = (): void => {
      dragRef.current = null
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const startResize = (event: ReactPointerEvent<HTMLDivElement>): void => {
    event.stopPropagation()
    resizeRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      origW: size.width,
      origH: size.height,
    }

    const onMove = (move: PointerEvent): void => {
      const resizing = resizeRef.current
      if (!resizing) return
      const width = clamp(resizing.origW + move.clientX - resizing.startX, MIN_WIDTH, window.innerWidth - pos.left)
      const height = clamp(resizing.origH + move.clientY - resizing.startY, MIN_HEIGHT, window.innerHeight - pos.top - 8)
      setSize({ width, height })
    }
    const onUp = (): void => {
      resizeRef.current = null
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: pos.left,
        top: pos.top,
        width: size.width,
        height: size.height,
        zIndex: 9999,
        background: 'var(--dsw-bg)',
        border: '1px solid var(--dsw-border)',
        borderRadius: 12,
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        onPointerDown={startDrag}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 8px 6px 12px',
          cursor: 'move',
          touchAction: 'none',
          userSelect: 'none',
          // Solid bar — explicit fallbacks so it is never transparent even if
          // the shell theme tokens are unavailable.
          background: 'var(--dsw-surface, #ffffff)',
          borderBottom: '1px solid var(--dsw-border, rgba(128,128,128,0.3))',
          flexShrink: 0,
        }}
      >
        <span style={{ color: 'var(--dsw-text)', fontSize: 13, fontWeight: 700 }}>
          ColorGuess
        </span>
        <button type="button" style={CLOSE_STYLE} onClick={onClose}>
          ✕
        </button>
      </div>
      <iframe
        ref={iframeRef}
        src={gameUrl}
        title="ColorGuess"
        style={{ flex: 1, border: 'none', width: '100%' }}
      />
      {/* resize handle (bottom-right corner) */}
      <div
        onPointerDown={startResize}
        title="Drag to resize"
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: 20,
          height: 20,
          cursor: 'nwse-resize',
          touchAction: 'none',
          // visible diagonal grip triangle in the corner
          background:
            'linear-gradient(135deg, transparent 50%, var(--dsw-text-muted, #888888) 50%)',
          borderBottomRightRadius: 12,
        }}
      />
    </div>
  )
}

/**
 * Header entry point: toggles the floating game window and forwards the host
 * theme into the iframe. Closes on Escape.
 * @param props - runtime slot currency plus the game URL and theme hook.
 */
export function GameAction({ gameUrl, subscribeTheme }: GameActionProps) {
  const [open, setOpen] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Forward the host's resolved theme into the game iframe (immediate + on
  // change), while the window is open. Defensive: the inject face is optional.
  useEffect(() => {
    if (!open || typeof subscribeTheme !== 'function') return
    return subscribeTheme((theme) => {
      iframeRef.current?.contentWindow?.postMessage(
        { source: THEME_MESSAGE_SOURCE, theme },
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
          iframeRef={iframeRef}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  )
}
