import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
    },
    server: {
      port: 3000,
      strictPort: true,
      hmr: true,
      // Polling also detects changes on shared folders and mounted volumes.
      watch: {
        usePolling: true,
        interval: 200,
      },
    },
  };
});
