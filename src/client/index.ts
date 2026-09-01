/**
 * ColorGuess client plugin: adds a session-header action that opens the
 * ColorGuess game in a right-side drawer iframe. The game follows the host
 * theme: this plugin forwards DSH's resolved theme into the iframe via
 * postMessage.
 */
import type { Context } from '@deepseek-ai/cordis'
import { GameAction } from './GameAction.tsx'

/** Cordis services this client plugin needs. */
export const inject = ['slots', 'theme']

/** Plugin row configuration. */
export interface ColorGuessConfig {
  /** Where the game is hosted. */
  gameUrl?: string
}

export const DEFAULT_GAME_URL = 'https://hdnray.github.io/colorguess/'

/** Theme pushed to the game iframe. */
export type HostTheme = 'light' | 'dark'

/**
 * Client plugin body: register the header action and forward theme changes.
 * @param ctx - client root context.
 * @param config - plugin row config (gameUrl).
 */
export function apply(ctx: Context, config: ColorGuessConfig = {}): void {
  const gameUrl = config.gameUrl ?? DEFAULT_GAME_URL

  ctx.slots.inject(
    'conversation.session.header.actions',
    () => ctx.slots.register({
      name: 'conversation.session.header.actions',
      id: 'colorguess-game',
      order: 100,
      inject: () => ({
        gameUrl,
        /**
         * Subscribe to host theme changes; calls back immediately with the
         * current resolved theme and on every change. Returns an unsubscribe.
         */
        subscribeTheme: (listener: (theme: HostTheme) => void): (() => void) => {
          const onChange = (snapshot: { active: { colorScheme: string } }): void => {
            listener(snapshot.active.colorScheme === 'dark' ? 'dark' : 'light')
          }
          ctx.on('theme/change', onChange)
          // API drift guard across DSH versions:
          //  - old: ThemeRuntime#snapshot() method
          //  - new (0.1.2): ThemeRuntime#getTheme() method; the compiled
          //    instance also leaks `snapshot` as the snapshot object itself.
          const themeService = ctx.theme as unknown as {
            snapshot?: unknown
            getTheme?: () => { active: { colorScheme: string } }
          }
          const readSnapshot = (): { active: { colorScheme: string } } | undefined => {
            if (typeof themeService.getTheme === 'function') {
              return themeService.getTheme()
            }
            if (typeof themeService.snapshot === 'function') {
              return (themeService.snapshot as () => { active: { colorScheme: string } })()
            }
            if (
              themeService.snapshot !== null &&
              typeof themeService.snapshot === 'object'
            ) {
              return themeService.snapshot as { active: { colorScheme: string } }
            }
            return undefined
          }
          const initial = readSnapshot()
          if (initial !== undefined) onChange(initial)
          return () => {
            ctx.off('theme/change', onChange)
          }
        },
      }),
    }, GameAction),
  )
}
