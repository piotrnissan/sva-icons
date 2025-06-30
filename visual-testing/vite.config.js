import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 3000,
    open: true,
    fs: {
      // Allow serving files from parent directory (to access dist folder)
      allow: ['..']
    }
  },
  // Add alias to make dist folder accessible
  resolve: {
    alias: {
      '@dist': resolve(__dirname, '../dist'),
      'sva-icons/class-based': resolve(__dirname, '../dist/class-based/esm/index.js'),
      'sva-icons': resolve(__dirname, '../')
    }
  }
})
