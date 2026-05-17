// vite.config.js — Configuração de Build
// Ceará Planejados — Vidraçaria
//
// Etapa 7 — Performance:
//   - manualChunks separados por domínio (react | pages | storage | utils)
//   - terser com passes extras de compressão
//   - cssCodeSplit: true para CSS por chunk (não carrega CSS de página não visitada)
//   - assetsInlineLimit: 4KB — arquivos menores viram base64 (menos requests)
//   - chunkSizeWarningLimit: 400KB

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // Babel plugin: remove prop-types em produção (economiza ~5KB)
      babel: {
        plugins: process.env.NODE_ENV === 'production'
          ? [['babel-plugin-transform-react-remove-prop-types', { removeImport: true }]]
          : [],
      },
    }),
  ],

  build: {
    sourcemap: false,

    // Inline assets pequenos como base64 (menos round-trips)
    assetsInlineLimit: 4096,

    // CSS separado por chunk — só carrega o CSS da página visitada
    cssCodeSplit: true,

    // Avisa se chunk > 400KB
    chunkSizeWarningLimit: 400,

    rollupOptions: {
      output: {
        // Chunks separados por domínio para melhor cache
        manualChunks(id) {
          // Vendor React
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          // Páginas — cada uma em seu chunk (lazy loading funciona melhor)
          if (id.includes('/pages/dashboard'))     return 'page-home';
          if (id.includes('/pages/orcamentos'))    return 'page-orc';
          if (id.includes('/pages/financeiro'))    return 'page-fin';
          if (id.includes('/pages/agenda'))        return 'page-agenda';
          if (id.includes('/pages/clientes'))      return 'page-clientes';
          if (id.includes('/pages/configuracoes')) return 'page-config';
          // Storage / IndexedDB
          if (id.includes('/storage/') || id.includes('/db.js')) return 'storage';
        },

        // Nomes de chunks com hash para cache busting correto
        chunkFileNames:  'assets/[name]-[hash].js',
        entryFileNames:  'assets/[name]-[hash].js',
        assetFileNames:  'assets/[name]-[hash].[ext]',
      },
    },

    // Compressão extra para produção
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 2,
        drop_console: true,       // Remove console.log em produção
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug', 'console.warn'],
      },
      mangle: { safari10: true }, // Compatibilidade iOS 10+
    },
  },

  server: {
    port: 5173,
    host: true,
  },
});
