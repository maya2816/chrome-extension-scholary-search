import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest-and-assets',
      buildEnd() {
        // Ensure dist directory exists
        if (!existsSync('dist')) {
          mkdirSync('dist', { recursive: true });
        }

        // Copy manifest.json
        copyFileSync('manifest.json', 'dist/manifest.json');

        // Copy background.js
        copyFileSync('background.js', 'dist/background.js');
        // Ensure images directory exists
        const imagesPath = 'dist/images';
        if (!existsSync(imagesPath)) {
          mkdirSync(imagesPath, { recursive: true });
        }

        // ✅ Copy only icon16.png
        copyFileSync('public/images/icon16.png', `${imagesPath}/icon16.png`);
      }
    }
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
});