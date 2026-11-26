import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        demo: resolve(__dirname, 'demo/index.html'),
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
          const [pathname, search = ''] = (req.url || '').split('?')
          const suffix = search ? `?${search}` : ''
          if (pathname === '/demo') {
            req.url = `/demo/${suffix}`
          } else if (pathname === '/privacy') {
            req.url = `/privacy/${suffix}`
          } else if (pathname === '/tos') {
            req.url = `/tos/${suffix}`
          }
          next()
        })
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          const [pathname, search = ''] = (req.url || '').split('?')
          const suffix = search ? `?${search}` : ''
          if (pathname === '/demo') {
            req.url = `/demo/${suffix}`
          } else if (pathname === '/privacy') {
            req.url = `/privacy/${suffix}`
          } else if (pathname === '/tos') {
            req.url = `/tos/${suffix}`
          }
          next()
        })
      }
    }
  ]
})

