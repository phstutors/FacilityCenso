import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['xlsx'],
  },
  build: {
    outDir: 'build', // agora Vite gera 'build' em vez de 'dist'
    chunkSizeWarningLimit: 1000, // opcional, aumenta limite de aviso de chunk
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});