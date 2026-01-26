import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { VitePWA } from 'vite-plugin-pwa';
import vercel from '@astrojs/vercel';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    site: 'https://raynaldoanantawijaya.my.id',
    output: 'server',
    adapter: vercel({
        imageService: true,
        webAnalytics: {
            enabled: true,
        },
    }),
    integrations: [sitemap(), react()],
    vite: {
        plugins: [
            VitePWA({
                registerType: 'autoUpdate',
                manifest: {
                    name: 'Portofolio Raynaldo Ananta Wijaya',
                    short_name: 'Raynaldo',
                    description: 'Portofolio Raynaldo Ananta Wijaya - Teknik Elektro, Robotik, dan Pemrograman',
                    theme_color: '#111111',
                    background_color: '#111111',
                    display: 'standalone',
                    icons: [
                        {
                            src: '/assets/Foto/logo.png', // Assuming this exists or falls back to favicon if specific size needed
                            sizes: '192x192',
                            type: 'image/png'
                        },
                        {
                            src: '/assets/Foto/logo.png',
                            sizes: '512x512',
                            type: 'image/png'
                        }
                    ]
                },
                workbox: {
                    globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,webp,woff,woff2}'],
                    navigateFallback: '/404',
                },
                devOptions: {
                    enabled: true,
                    navigateFallbackAllowlist: [/^\/404$/],
                }
            })
        ]
    }
});