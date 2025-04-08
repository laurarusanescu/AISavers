import { minifyHtmlPlugin } from './plugins/vite-plugin-minify-html/minifyHtmlPlugin';
import { minifyJsonPlugin } from './plugins/vite-plugin-minify-json/minifyJsonPlugin';
import vue from '@vitejs/plugin-vue';
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

export default defineConfig({
  envPrefix: ['OCULAR'],
  server: {
    port: 3008,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    port: 3000
  },
  define: {
    'import.meta.env.OCULAR_BUILD_TIMESTAMP': Date.now()
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    }
  },
  resolve: {
    alias: {
      '@styles': '/src/styles', // Keep if needed
      '@directives': '/src/directives',
      '@components': '/src/app/components',
      '@app': '/src/app',
      '@i18n': '/src/i18n',
      '@storage': '/src/storage',
      '@utils': '/src/utils',
      '@store': '/src/store',
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    target: 'ES2022'
  },
  plugins: [
    tsconfigPaths({ loose: true }),
    optimizeCssModules(),
    minifyJsonPlugin(),
    minifyHtmlPlugin(),
    vue({
      script: {
        defineModel: true
      }
    }),
    VitePWA({
      manifest: {
        name: 'Ocular',
        short_name: 'Ocular',
        start_url: '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#fff',
        theme_color: '#6bb1ff',
        description: 'Budgeting app',
        icons: [
          {
            src: '/images/icon-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/images/icon-maskable-256x256.png',
            sizes: '256x256',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/images/icon-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/images/icon-maskable-1024x1024.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/images/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/images/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/images/icon-1024x1024.png',
            sizes: '1024x1024',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,json}']
      },
      registerType: 'autoUpdate'
    })
  ],
  test: {
    include: ['./src/**/*.spec.ts']
  }
});
