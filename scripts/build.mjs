/**
 * Build script for the ColorGuess DSH plugin.
 *
 * 1. lib/index.js  — host half (ESM, empty apply). Loaded by the host Loader.
 * 2. lib/client.js — browser half: the DSH client-module contract requires a
 *    classic script that calls `window.__ModuleLoader__.load({ id, factory })`,
 *    where `factory` receives the loader's `require` (module-table bound).
 *    We bundle the client source as CJS with react / react/jsx-runtime
 *    externalized, then wrap it so those externals resolve through the
 *    injected require.
 *
 * esbuild resolves from the parent project's node_modules (vite dependency).
 */
import { build } from 'esbuild'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PLUGIN_ID = 'colorguess-dsh-plugin'

await mkdirSync(join(ROOT, 'lib'), { recursive: true })

// ── Host half ────────────────────────────────────────────────────────────────
await build({
  entryPoints: [join(ROOT, 'src/index.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: join(ROOT, 'lib/index.js'),
  logLevel: 'info',
})

// ── Browser half ─────────────────────────────────────────────────────────────
const result = await build({
  entryPoints: [join(ROOT, 'src/client/index.ts')],
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  jsx: 'automatic',
  external: ['react', 'react/jsx-runtime'],
  write: false,
  logLevel: 'info',
})

const bundle = result.outputFiles[0].text
const wrapped = `window.__ModuleLoader__.load({
  id: ${JSON.stringify(PLUGIN_ID)},
  factory: function (require) {
    const module = { exports: {} }
    ;(function (require, module, exports) {
${bundle}
    })(require, module, module.exports)
    return module.exports
  },
});
`
writeFileSync(join(ROOT, 'lib/client.js'), wrapped)
console.log('wrote lib/client.js')
