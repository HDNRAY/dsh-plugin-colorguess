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

const WIN_WIDTH = 400
const WIN_HEIGHT = 600

/** Draggable floating window hosting the game. */
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
  const dragRef = useRef<{
    startX: number
    startY: number
    origLeft: number
    origTop: number
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
      const left = Math.max(0, Math.min(window.innerWidth - WIN_WIDTH, drag.origLeft + move.clientX - drag.startX))
      const top = Math.max(0, Math.min(window.innerHeight - 32, drag.origTop + move.clientY - drag.startY))
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

  return (
    <div
      style={{
        position: 'fixed',
        left: pos.left,
        top: pos.top,
        width: WIN_WIDTH,
        maxWidth: '94vw',
        height: WIN_HEIGHT,
        maxHeight: '90vh',
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
          borderBottom: '1px solid var(--dsw-border)',
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
