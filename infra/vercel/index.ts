/**
 * Pulumi Infrastructure as Code for Vercel + Supabase
 *
 * This deploys:
 * - 4 Vercel projects (API, Slack, Web, PAX)
 * - Environment variables for each project
 *
 * Prerequisites:
 * - Vercel account with API token
 * - Supabase project (created manually or via Supabase CLI)
 * - GitHub repo connected to Vercel
 *
 * Usage:
 *   cd infra/vercel
 *   pulumi config set vercel:apiToken <token> --secret
 *   pulumi config set databaseUrl <supabase-connection-string> --secret
 *   pulumi config set slackSigningSecret <secret> --secret
 *   pulumi config set slackBotToken <token> --secret
 *   pulumi up
 */

import * as pulumi from "@pulumi/pulumi";
import * as vercel from "@pulumiverse/vercel";

// =============================================================================
// Configuration
// =============================================================================

const config = new pulumi.Config();
const githubRepo = config.require("githubRepo"); // e.g., "yourname/f3-kit"

// Secrets (set via: pulumi config set <key> <value> --secret)
const databaseUrl = config.requireSecret("databaseUrl");
const slackSigningSecret = config.getSecret("slackSigningSecret");
const slackBotToken = config.getSecret("slackBotToken");
const apiToken = config.getSecret("apiToken"); // Optional shared auth token

// =============================================================================
// Vercel Projects
// =============================================================================

// API Project
const apiProject = new vercel.Project("f3-api", {
  name: "f3-api",
  framework: "other",
  gitRepository: {
    type: "github",
    repo: githubRepo,
  },
  rootDirectory: "apps/vercel-api",
  buildCommand: "cd ../.. && pnpm install && pnpm build:packages && pnpm build:adapters && cd apps/vercel-api && pnpm build",
  installCommand: "echo 'Install handled in build command'",
  outputDirectory: "dist",
});

// Slack Bot Project
const slackProject = new vercel.Project("f3-slack", {
  name: "f3-slack",
  framework: "other",
  gitRepository: {
    type: "github",
    repo: githubRepo,
  },
  rootDirectory: "apps/vercel-slack",
  buildCommand: "cd ../.. && pnpm install && pnpm build:packages && pnpm build:adapters && cd apps/vercel-slack && pnpm build",
  installCommand: "echo 'Install handled in build command'",
  outputDirectory: "dist",
});

// Public Website Project
const webProject = new vercel.Project("f3-web", {
  name: "f3-web",
  framework: "astro",
  gitRepository: {
    type: "github",
    repo: githubRepo,
  },
  rootDirectory: "apps/vercel-web",
});

// PAX Portal Project
const paxProject = new vercel.Project("f3-pax", {
  name: "f3-pax",
  framework: "vite",
  gitRepository: {
    type: "github",
    repo: githubRepo,
  },
  rootDirectory: "apps/vercel-pax",
});

// =============================================================================
// Environment Variables - API
// =============================================================================

new vercel.ProjectEnvironmentVariable("api-database-url", {
  projectId: apiProject.id,
  key: "DATABASE_URL",
  value: databaseUrl,
  targets: ["production", "preview"],
});

if (apiToken) {
  new vercel.ProjectEnvironmentVariable("api-token", {
    projectId: apiProject.id,
    key: "API_TOKEN",
    value: apiToken,
    targets: ["production", "preview"],
  });
}

// =============================================================================
// Environment Variables - Slack
// =============================================================================

new vercel.ProjectEnvironmentVariable("slack-database-url", {
  projectId: slackProject.id,
  key: "DATABASE_URL",
  value: databaseUrl,
  targets: ["production", "preview"],
});

if (slackSigningSecret) {
  new vercel.ProjectEnvironmentVariable("slack-signing-secret", {
    projectId: slackProject.id,
    key: "SLACK_SIGNING_SECRET",
    value: slackSigningSecret,
    targets: ["production", "preview"],
  });
}

if (slackBotToken) {
  new vercel.ProjectEnvironmentVariable("slack-bot-token", {
    projectId: slackProject.id,
    key: "SLACK_BOT_TOKEN",
    value: slackBotToken,
    targets: ["production", "preview"],
  });
}

// API base URL for Slack to call API
const apiUrl = pulumi.interpolate`https://${apiProject.name}.vercel.app`;
new vercel.ProjectEnvironmentVariable("slack-api-base-url", {
  projectId: slackProject.id,
  key: "API_BASE_URL",
  value: apiUrl,
  targets: ["production", "preview"],
});

if (apiToken) {
  new vercel.ProjectEnvironmentVariable("slack-api-token", {
    projectId: slackProject.id,
    key: "API_TOKEN",
    value: apiToken,
    targets: ["production", "preview"],
  });
}

// =============================================================================
// Environment Variables - PAX Portal
// =============================================================================

new vercel.ProjectEnvironmentVariable("pax-api-url", {
  projectId: paxProject.id,
  key: "VITE_API_URL",
  value: apiUrl,
  targets: ["production", "preview"],
});

// =============================================================================
// Outputs
// =============================================================================

export const apiProjectUrl = pulumi.interpolate`https://${apiProject.name}.vercel.app`;
export const slackProjectUrl = pulumi.interpolate`https://${slackProject.name}.vercel.app`;
export const webProjectUrl = pulumi.interpolate`https://${webProject.name}.vercel.app`;
export const paxProjectUrl = pulumi.interpolate`https://${paxProject.name}.vercel.app`;

export const slackEventUrl = pulumi.interpolate`https://${slackProject.name}.vercel.app/slack/events`;
export const slackCommandUrl = pulumi.interpolate`https://${slackProject.name}.vercel.app/slack/commands`;
export const slackInteractionUrl = pulumi.interpolate`https://${slackProject.name}.vercel.app/slack/interactions`;
