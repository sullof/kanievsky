import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    include: "**/*.{jsx,js}"
  })],
  esbuild: {
    jsx: 'automatic'
  },
  build: {
    outDir: 'public/dist',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        main: './client/index.html'
      }
    }
  },
  server: {
    port: 3000
  }
})