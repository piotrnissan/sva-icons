import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Allow serving files from parent directory
      allow: ['..']
    }
  },
  assetsInclude: ['**/*.svg'], // Ensure SVG files are treated as assets
})
