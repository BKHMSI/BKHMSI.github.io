import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    // GitHub Pages for bkhmsi.github.io is served from the docs/ folder,
    // so we build directly into it.
    outDir: 'docs',
    emptyOutDir: true,
  },
})
