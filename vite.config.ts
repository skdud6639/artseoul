import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig, loadEnv, normalizePath } from 'vite';
import type { Plugin } from 'vite';
import { createInquiryApp } from './server/app';
import { readInquiryConfig } from './server/config';

export default defineConfig(({ mode }) => {
  const environment = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  const databasePath = normalizePath(
    path.resolve(environment.INQUIRY_DATABASE_PATH || '.data/inquiries.sqlite'),
  ).replace(/[?*()[\]{}!+@]/g, '\\$&');
  let closeApi: (() => void) | undefined;
  const stopApi = () => {
    closeApi?.();
    closeApi = undefined;
  };
  const inquiryApi: Plugin = {
    name: 'artseoul-inquiry-api',
    configureServer(server) {
      const api = createInquiryApp({
        config: readInquiryConfig(environment),
        databasePath: environment.INQUIRY_DATABASE_PATH,
      });
      closeApi = api.close;
      server.middlewares.use(api.app);
      server.httpServer?.once('close', stopApi);
    },
    configurePreviewServer(server) {
      const api = createInquiryApp({
        config: readInquiryConfig(environment),
        databasePath: environment.INQUIRY_DATABASE_PATH,
      });
      closeApi = api.close;
      server.middlewares.use(api.app);
      server.httpServer.once('close', stopApi);
    },
    closeBundle: stopApi,
  };
  return {
    plugins: [react(), tailwindcss(), inquiryApi],
    resolve: { alias: { '@': path.resolve(import.meta.dirname, '.') } },
    preview: { host: '0.0.0.0', port: 3000, strictPort: true },
    server: {
      fs: {
        deny: [
          '.env',
          '.env.*',
          '*.{crt,pem}',
          '**/.git/**',
          '**/.data/**',
          databasePath,
          `${databasePath}-*`,
        ],
      },
      port: 3000,
      strictPort: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
