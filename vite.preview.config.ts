import { mergeConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import base from './vite.config'

// Builds one self-contained index.html (JS, CSS, fonts and images inlined).
// Used for the hosted preview; normal deploys use `npm run build`.
export default mergeConfig(base, {
  plugins: [viteSingleFile()],
  build: { outDir: 'dist-preview', assetsInlineLimit: 100_000_000 },
})
