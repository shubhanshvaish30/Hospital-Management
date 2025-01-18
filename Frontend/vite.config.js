import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/auth':'https://hospital-management-3tyt.onrender.com',
    },
  },
  resolve: {
    alias: {
      '@': '/src', // Point @ to src folder
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
