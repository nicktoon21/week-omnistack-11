import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  // O plugin-react não roda no ambiente SSR do Vitest; garante o JSX automático lá.
  esbuild: { jsx: 'automatic' },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['tests/**/*.test.jsx'],
    setupFiles: ['./tests/setup.js'],
  },
});
