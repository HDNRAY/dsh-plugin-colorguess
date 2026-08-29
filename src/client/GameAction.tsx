/**
 * Session-header action for ColorGuess: a trigger button that toggles a
 * right-side drawer holding the game in an iframe. The rest of the DSH UI
 * stays visible behind a scrim, so the game never takes over the screen.
 * The game follows the host theme via postMessage. All visuals use DSH
 * theme tokens (var(--dsw-*)).
 */
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { HostTheme } from './index.ts'

export type GameActionProps = PropsRuntime<'conversation.session.header.actions'> & {
  /** Where the game is hosted (from the plugin row config). */
  gameUrl: string
  /** Subscribe to the host's resolved theme (immediate + on change). */
  subscribeTheme: (listener: (theme: HostTheme) => void) => () => void
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
  padding: '6px 14px',
  borderRadius: 8,
}

/** Right-side drawer hosting the game. */
function GameDrawer({
  gameUrl,
  iframeRef,
  onClose,
}: {
  gameUrl: string
  iframeRef: RefObject<HTMLIFrameElement | null>
  onClose: () => void
}) {
  return (
    <>
      {/* scrim over the rest of the UI; click to close */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          background: 'rgba(0, 0, 0, 0.4)',
        }}
      />
      {/* drawer panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(480px, 94vw)',
          zIndex: 9999,
          background: 'var(--dsw-bg)',
          borderLeft: '1px solid var(--dsw-border)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            borderBottom: '1px solid var(--dsw-border)',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              color: 'var(--dsw-text)',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            ColorGuess
          </span>
          <button type="button" style={CLOSE_STYLE} onClick={onClose}>
            Close
          </button>
        </div>
        <iframe
          ref={iframeRef}
          src={gameUrl}
          title="ColorGuess"
          style={{ flex: 1, border: 'none', width: '100%' }}
        />
      </div>
    </>
  )
}

/**
 * Header entry point: toggles the game drawer and forwards the host theme
 * into the iframe. Closes on Escape.
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
  // change), while the drawer is open.
  useEffect(() => {
    if (!open) return
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
        <GameDrawer
          gameUrl={gameUrl}
          iframeRef={iframeRef}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  )
}
