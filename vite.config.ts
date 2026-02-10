import pages from '@hono/vite-cloudflare-pages'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    pages({
      entry: 'src/index.tsx',
      exclude: ['/automation.html', '/templates.html', '/email-code.html', '/static/*', '/*.pdf']
    })
  ]
})
