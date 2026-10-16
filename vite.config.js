import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { isPreviewBuild } from './tools/build-environment.mjs';

export default defineConfig({
  base: "/",
  plugins: [react()],
  define: { 'import.meta.env.VITE_PREVIEW_BUILD': JSON.stringify(isPreviewBuild()) },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  build: {
    outDir: 'dist',
    manifest: true,
    chunkSizeWarningLimit: 1600
  }
});
