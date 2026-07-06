import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const BACKEND_TARGET = 'http://localhost:5000';

function injectTokenFromCookie(proxyReq, req) {
  if (req.headers.authorization) return;

  const cookie = req.headers.cookie || '';
  const match = cookie.match(/(?:^|;\s*)wa_token=([^;]+)/);
  if (match?.[1]) {
    proxyReq.setHeader('Authorization', `Bearer ${decodeURIComponent(match[1])}`);
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/google/connect': {
        target: BACKEND_TARGET,
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            injectTokenFromCookie(proxyReq, req);
          });
        },
      },
      '/api': {
        target: BACKEND_TARGET,
        changeOrigin: true,
      },
    },
  },
});
