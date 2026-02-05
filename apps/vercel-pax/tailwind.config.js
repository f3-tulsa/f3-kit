/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
