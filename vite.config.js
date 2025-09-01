import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "7cbb49e799dd.ngrok-free.app",
      "42038c7d7ae2.ngrok-free.app"
    ]
  }
})
