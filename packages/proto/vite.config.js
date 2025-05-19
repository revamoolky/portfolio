import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        casify: resolve(__dirname, 'casify.html'),
        panw: resolve(__dirname, 'paloaltonetworks.html'),
        amplitude: resolve(__dirname, 'amplitude.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        resume: resolve(__dirname, 'resume.html'),
      },
    },
  },
})
