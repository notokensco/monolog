import { build } from 'vite'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

await build({
  configFile: false,
  build: {
    rollupOptions: {
      input: {
        main: resolve('index.html'),
        privacy: resolve('privacy/index.html'),
        tos: resolve('tos/index.html')
      }
    }
  }
})

// Ensure clean URL fallbacks for static hosting
const fallbacks = [
  { src: 'dist/privacy/index.html', dest: 'dist/privacy.html' },
  { src: 'dist/tos/index.html', dest: 'dist/tos.html' }
]

for (const { src, dest } of fallbacks) {
  const srcPath = resolve(src)
  const destPath = resolve(dest)
  if (existsSync(srcPath)) {
    copyFileSync(srcPath, destPath)
    console.log(`✓ Created ${dest} fallback`)
  }
}
