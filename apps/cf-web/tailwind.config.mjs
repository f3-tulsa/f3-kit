/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        f3: {
          red: "#c41e3a",
          black: "#1a1a1a",
          gray: "#4a4a4a",
        },
      },
      fontFamily: {
        display: ["Oswald", "sans-serif"],
        body: ["Source Sans Pro", "sans-serif"],
      },
    },
  },
  plugins: [],
};
