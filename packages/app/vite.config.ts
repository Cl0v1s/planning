import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {}
  },
  resolve: {
    preserveSymlinks: true,
  },
  optimizeDeps: {
    include: ['./../lib'],
  },
  build: {
    commonjsOptions: {
      include: ['./../lib', /node_modules/],
    },
  },
})
