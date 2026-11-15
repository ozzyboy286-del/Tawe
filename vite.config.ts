import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

const pwaManifest = {
  id: '/',
  name: 'Reçu Pro Bénin - Factures & Reçus Express',
  short_name: 'Reçu Pro',
  description:
    'Créez vos reçus professionnels en 10 secondes au Bénin. Mode hors ligne, WhatsApp, PDF pro, MTN MoMo & Celtiis Cash.',
  theme_color: '#0F172A',
  background_color: '#0F172A',
  display: 'standalone' as const,
  orientation: 'portrait-primary' as const,
  start_url: '/',
  scope: '/',
  lang: 'fr',
  categories: ['business', 'finance', 'productivity'],
  icons: [
    {
      src: '/pwa-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/pwa-maskable-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
};

export default defineConfig(() => {
  const isHmrDisabled = process.env.DISABLE_HMR === 'true';

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png', 'pwa-maskable-512x512.png'],
        manifest: pwaManifest,
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          // vite-plugin-pwa's dev registration relies on import.meta.hot.send(),
          // which throws SendBeforeConnectError when HMR is disabled.
          enabled: !isHmrDisabled,
          type: 'module',
        },
      }),
      ...(isHmrDisabled
        ? [
            {
              name: 'pwa-manifest-no-hmr-dev',
              apply: 'serve' as const,
              configureServer(server: { middlewares: { use: (path: string, handler: (req: unknown, res: { setHeader: (k: string, v: string) => void; end: (b: string) => void }) => void) => void } }) {
                server.middlewares.use('/manifest.webmanifest', (_req, res) => {
                  res.setHeader('Content-Type', 'application/manifest+json');
                  res.end(JSON.stringify(pwaManifest));
                });
              },
              transformIndexHtml() {
                return [
                  {
                    tag: 'link',
                    attrs: {
                      rel: 'manifest',
                      href: '/manifest.webmanifest',
                    },
                    injectTo: 'head' as const,
                  },
                ];
              },
            },
          ]
        : []),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
