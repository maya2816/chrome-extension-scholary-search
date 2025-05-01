import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-extension-assets',
      buildEnd() {
        // Ensure dist directory exists
        if (!existsSync('dist')) {
          mkdirSync('dist', { recursive: true });
        }

        // Copy manifest.json from root
        copyFileSync('manifest.json', 'dist/manifest.json');

        // Copy background.js from root
        copyFileSync('background.js', 'dist/background.js');

        // Copy /public/images/ to /dist/images/
        const sourceImagesPath = 'public/images';
        const targetImagesPath = 'dist/images';

        if (!existsSync(targetImagesPath)) {
          mkdirSync(targetImagesPath, { recursive: true });
        }

        if (existsSync(sourceImagesPath)) {
          const files = readdirSync(sourceImagesPath);
          files.forEach(file => {
            copyFileSync(`${sourceImagesPath}/${file}`, `${targetImagesPath}/${file}`);
          });
        }

        // Copy scripts folder (e.g., panel.js)
        const sourceScriptsPath = 'public/scripts';
        const targetScriptsPath = 'dist/scripts';

        if (!existsSync(targetScriptsPath)) {
          mkdirSync(targetScriptsPath, { recursive: true });
        }

        if (existsSync(sourceScriptsPath)) {
          const files = readdirSync(sourceScriptsPath);
          files.forEach(file => {
            copyFileSync(`${sourceScriptsPath}/${file}`, `${targetScriptsPath}/${file}`);
          });
        }
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