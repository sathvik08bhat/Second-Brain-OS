import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    open: true,
    proxy: {
      '/fatsec-auth': {
        target: 'https://oauth.fatsecret.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fatsec-auth/, '')
      },
      '/fatsec-api': {
        target: 'https://platform.fatsecret.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fatsec-api/, '')
      }
    }
  }
})
