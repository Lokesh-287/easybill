import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/assets/easybill/frontend/' : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: '../easybill/public/frontend',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '^/(api|files)': {
        target: 'http://easybill.localhost:8007',
        changeOrigin: true,
      },
    },
  },
}));
