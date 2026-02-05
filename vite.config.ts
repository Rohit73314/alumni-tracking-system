// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';   // ← this is important!

export default defineConfig({
  plugins: [react()],

  // ← Add this block!
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),   // maps @ → src folder
    },
  },

  // If you're deploying to GitHub Pages (recommended to keep)
  base: process.env.NODE_ENV === 'production' ? '/alumni-tracking-system/' : '/',
});