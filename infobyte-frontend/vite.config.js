import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add this 'server' section:
  server: {
    port: 5173, // This is the port you saw earlier
    proxy: {
      // Any request starting with /api will be sent to your Java backend
      '/api': {
        target: 'http://localhost:8080', // Your Spring Boot port
        changeOrigin: true,
        secure: false,
      },
    },
  },
})