import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/static";

export default defineConfig({
  output: "static",
  adapter: vercel(),
  integrations: [tailwind()],
  site: 'https://f3-web.vercel.app', // Replace with your domain
  base: '/',
  build: {
    assets: '_assets',
  },
  vite: {
    resolve: {
      alias: {
        '~': '/src',
      },
    },
  },
});
