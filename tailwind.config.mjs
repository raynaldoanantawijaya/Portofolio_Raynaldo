import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "primary": "#6C63FF",
                "primary-light": "#7c75ff",
                "background-light": "#f6f6f8",
                "background-dark": "#111111",
                "card-dark": "#1E1E1E",
                "charcoal": "#121212",
                "slate-panel": "#1e1e1e",
                "editor-paper": "#262626",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
        require('tailwindcss-animate'),
    ],
}
