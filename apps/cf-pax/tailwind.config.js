/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
