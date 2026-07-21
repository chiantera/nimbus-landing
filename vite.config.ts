import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://chiantera.github.io/nimbus-landing/
  base: '/nimbus-landing/',
  plugins: [react()],
})
