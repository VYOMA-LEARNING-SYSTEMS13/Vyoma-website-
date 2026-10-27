import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true, // Listen on all network addresses (0.0.0.0)
        allowedHosts: true, // Allow ngrok-free.app and other tunnel domains
        cors: true, // Enable CORS for tunnel requests
        proxy: {
            '/api': {
                target: 'http://localhost:5001',
                changeOrigin: true,
                secure: false,
            }
        }
    }
})
