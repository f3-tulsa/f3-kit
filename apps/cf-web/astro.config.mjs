import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// Static site - no adapter needed for Cloudflare Pages
// Just deploy the built `dist` folder to Pages
export default defineConfig({
  output: "static",
  integrations: [tailwind()],
  build: {
    assets: "assets",
  },
  vite: {
    define: {
      "import.meta.env.PUBLIC_API_URL": JSON.stringify(
        process.env.PUBLIC_API_URL || "http://localhost:8787"
      ),
    },
  },
});
