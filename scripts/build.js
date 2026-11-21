import { build } from 'vite'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

await build({
  configFile: false,
  build: {
    rollupOptions: {
      input: {
        main: resolve('index.html'),
        privacy: resolve('privacy/index.html')
      }
    }
  }
})

const privacyIndex = resolve('dist/privacy/index.html')
const privacyHtml = resolve('dist/privacy.html')
if (existsSync(privacyIndex)) {
  copyFileSync(privacyIndex, privacyHtml)
  console.log('✓ Created dist/privacy.html fallback')
}
