import alchemy from "alchemy";
import { D1Database, Worker } from "alchemy/cloudflare";

// Initialize Alchemy app
const app = await alchemy("f3-kit", {
  stage: process.env.STAGE ?? "dev",
});

// =============================================================================
// D1 Database
// =============================================================================

const database = await D1Database("f3-db", {
  name: "f3-db",
});

// =============================================================================
// API Worker (Hono)
// =============================================================================

const apiWorker = await Worker("f3-api", {
  name: "f3-api",
  entrypoint: "../../apps/cf-api/src/index.ts",
  compatibilityDate: "2025-01-01",
  bindings: {
    DB: database,
  },
  vars: {
    APP_ENV: app.stage,
  },
});

// =============================================================================
// Slack Worker (Hono)
// =============================================================================

const slackWorker = await Worker("f3-slack", {
  name: "f3-slack",
  entrypoint: "../../apps/cf-slack/src/index.ts",
  compatibilityDate: "2025-01-01",
  vars: {
    APP_ENV: app.stage,
    API_BASE_URL: apiWorker.url,
  },
  // Secrets are set manually via: wrangler secret put SLACK_SIGNING_SECRET
  // - SLACK_SIGNING_SECRET
  // - SLACK_BOT_TOKEN
  // - API_TOKEN
});

// =============================================================================
// Cloudflare Pages (deployed via wrangler pages)
// =============================================================================
//
// The following apps are static sites deployed to Cloudflare Pages:
//
// 1. cf-web (Public Website - Astro)
//    - Build: pnpm --filter cf-web build
//    - Deploy: wrangler pages deploy apps/cf-web/dist --project-name=f3-web
//    - Or via: pnpm deploy:web
//
// 2. cf-pax (PAX Portal - Vite + React)
//    - Build: pnpm --filter cf-pax build
//    - Deploy: wrangler pages deploy apps/cf-pax/dist --project-name=f3-pax
//    - Or via: pnpm deploy:pax
//
// Pages projects are created automatically on first deploy.
// Set environment variables in the Cloudflare dashboard:
//   - f3-web: PUBLIC_API_URL
//   - f3-pax: VITE_API_URL
//

// =============================================================================
// Outputs
// =============================================================================

console.log("\n✅ Infrastructure deployed!\n");
console.log("📦 Workers:");
console.log(`   D1 Database:  ${database.name} (${database.id})`);
console.log(`   API Worker:   ${apiWorker.url}`);
console.log(`   Slack Worker: ${slackWorker.url}`);
console.log("\n📄 Pages (deploy separately):");
console.log("   pnpm deploy:web   → f3-web (public site)");
console.log("   pnpm deploy:pax   → f3-pax (PAX portal)");
console.log("\n🔐 Don't forget to set secrets:");
console.log("   cd apps/cf-slack && pnpm wrangler secret put SLACK_SIGNING_SECRET");
console.log("   cd apps/cf-slack && pnpm wrangler secret put SLACK_BOT_TOKEN");
console.log("\n📝 Run migrations:");
console.log("   pnpm --filter cf-api d1:migrate:remote");
console.log("\n🌐 Set Pages env vars in Cloudflare dashboard:");
console.log(`   f3-web: PUBLIC_API_URL = ${apiWorker.url}`);
console.log(`   f3-pax: VITE_API_URL = ${apiWorker.url}`);

// Finalize
await app.finalize();
