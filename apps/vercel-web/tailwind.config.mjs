/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'f3-red': '#ef4444',
        'f3-black': '#18181b',
      },
    },
  },
  plugins: [],
}
