import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    // Target modern browsers — allows Vite to emit smaller, more efficient output
    target: 'es2020',

    // Raise the chunk warning threshold slightly (default 500kB is very aggressive)
    chunkSizeWarningLimit: 800,

    rollupOptions: {
      output: {
        // Split vendor libraries into named chunks so browsers can cache them
        // independently of app code changes
        manualChunks: {
          // React core — changes very rarely
          'vendor-react': ['react', 'react-dom'],
          // Routing — changes rarely
          'vendor-router': ['react-router-dom'],
          // Animation library — largest dep, keep isolated
          'vendor-motion': ['framer-motion'],
          // UI primitives bundled together
          'vendor-ui': ['lucide-react', 'clsx'],
          // Toast notifications
          'vendor-toast': ['react-toastify'],
        },
      },
    },

    // Generate source maps for production error tracking (omit if bundle size
    // is critical and you have no error tracking service)
    sourcemap: false,

    // Minify with esbuild (default, fastest) — switch to 'terser' only if you
    // need advanced dead-code elimination
    minify: 'esbuild',
  },

  // Optimise pre-bundling so first-load in dev is faster
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'clsx',
      'react-toastify',
    ],
  },
});
