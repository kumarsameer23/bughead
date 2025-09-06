// File: plugin/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Specify the output directory and file name
    outDir: 'dist',
    assetsDir: '',
    rollupOptions: {
      output: {
        // This ensures a single JS file without a hash
        entryFileNames: 'bughead-plugin.js',
        // And no CSS file
        assetFileNames: 'bughead-plugin.css',
      },
    },
  },
});
