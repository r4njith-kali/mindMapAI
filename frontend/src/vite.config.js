import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // frontend/vite.config.js
  server: {
    proxy: {
      '/api': { // Keep '/api' if your fetch URL *starts* with /api
        target: 'http://localhost:8000', // Change port to 8000
        changeOrigin: true,
      }
    }
  }
})
