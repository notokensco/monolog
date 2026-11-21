import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
        tos: resolve(__dirname, 'tos/index.html')
      }
    }
  },
  plugins: [
    {
      name: 'html-clean-urls',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/privacy') {
            req.url = '/privacy/'
          } else if (req.url === '/tos') {
            req.url = '/tos/'
          }
          next()
        })
      }
    }
  ]
})
