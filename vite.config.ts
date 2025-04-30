import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

// https://vitejs.dev/config/
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

        // Copy images folder (recursive copy not implemented here, 
        // you may need to enhance this for complex directory structures)
        if (!existsSync('dist/images')) {
          mkdirSync('dist/images', { recursive: true });
        }
        // Copy individual image files
        copyFileSync('public/images/icon16.png', 'dist/images/icon16.png');
        copyFileSync('public/images/icon32.png', 'dist/images/icon32.png');
        copyFileSync('public/images/icon48.png', 'dist/images/icon48.png');
        copyFileSync('public/images/icon128.png', 'dist/images/icon128.png');
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