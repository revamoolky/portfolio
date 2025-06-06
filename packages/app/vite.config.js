import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/auth": "http://localhost:3000",
      "/images": "http://localhost:3000",
      "/login": "http://localhost:3000",
      "/register": "http://localhost:3000"
    }
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true // cleans the folder before building
  }
});
