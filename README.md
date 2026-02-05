# F3 Kit

This project is a **fork-friendly**, full-stack tech kit made for and by F3 Regions. Coded agentically, it is intended to be forked and run on your own Cloudflare or Vercel + Supabase account.

- **Portable core** in `packages/` — models, contracts, domain logic, repo interfaces, HTTP handlers
- **Platform-specific code** in `apps/`, `adapters/`, `infra/`
- **Two deployment options:**
  - **Cloudflare Workers + D1** — Edge-first, serverless
  - **Vercel + Supabase** — Popular alternative stack

📋 **[View the Roadmap](./ROADMAP.md)** — Track planned features and progress

## Architecture

This project follows **onion architecture** principles, with clearly separated layers:

```
┌─────────────────────────────────────────────────────────────────────┐
│  CORE (portable - take these anywhere)                              │
│  ├── f3-model     (entities, relationships, typed IDs)              │
│  ├── f3-repo      (repository interfaces)                           │
│  ├── f3-domain    (business logic, Result<T>)                       │
│  ├── f3-contracts (API DTOs, ApiResult<T>)                          │
│  └── f3-api       (HTTP handlers, error mapping)                    │
├─────────────────────────────────────────────────────────────────────┤
│  ADAPTERS (database implementations)                                │
│  ├── repo-d1       (Drizzle + Cloudflare D1)                        │
│  └── repo-supabase (Drizzle + Supabase/PostgreSQL)                  │
├─────────────────────────────────────────────────────────────────────┤
│  APPS - Cloudflare Stack                                            │
│  ├── cf-api   (Hono API Worker)                                     │
│  ├── cf-slack (Slack Bot Worker)                                    │
│  ├── cf-web   (Astro Public Site)                                   │
│  └── cf-pax   (Vite+React PAX Portal)                               │
├─────────────────────────────────────────────────────────────────────┤
│  APPS - Vercel Stack                                                │
│  ├── vercel-api   (Hono Serverless Function)                        │
│  ├── vercel-slack (Slack Bot Serverless)                            │
│  ├── vercel-web   (Astro Public Site)                               │
│  └── vercel-pax   (Vite+React PAX Portal)                           │
└─────────────────────────────────────────────────────────────────────┘
```

### Onion Layers (inside → out)

| Layer | Package | Knows About | Doesn't Know About |
|-------|---------|-------------|-------------------|
| **Core** | `f3-model` | Entities, relationships, typed IDs | Everything else |
| **Core** | `f3-repo` | Data access patterns | Implementations |
| **Domain** | `f3-domain` | Business rules, validation | HTTP, databases |
| **API** | `f3-contracts` | Request/response shapes | HTTP status codes |
| **API** | `f3-api` | HTTP semantics, handlers | Hono, Cloudflare, Vercel |
| **Adapter** | `repo-d1` | Drizzle, D1 | Business logic |
| **Adapter** | `repo-supabase` | Drizzle, PostgreSQL | Business logic |
| **App** | `cf-*` | Hono, Wrangler, D1 | Business logic |
| **App** | `vercel-*` | Hono, Vercel, Supabase | Business logic |

### Why This Matters

The **cf-api** app is just ~100 lines of route wiring:

```typescript
app.get("/api/pax/:id", async (c) => {
  const deps = createDeps(c.env);  // Wire D1 repos
  const { body, status } = await getPaxById(deps, c.req.param("id"));
  return c.json(body, status);
});
```

All the real work happens in the portable `f3-api` handlers. To run on **AWS Lambda**, you'd write:

```typescript
export const handler = async (event) => {
  const deps = createDeps(/* DynamoDB client */);
  const { body, status } = await getPaxById(deps, event.pathParameters.id);
  return { statusCode: status, body: JSON.stringify(body) };
};
```

Same handlers. Same business logic. Different infrastructure.

## Requirements

- **pnpm** — package management ([install](https://pnpm.io/installation))
- **Bun** — TypeScript runtime for scripts ([install](https://bun.sh/docs/installation))
- **Wrangler** — Cloudflare CLI (installed as dev dependency)
- **Cloudflare account** — for Workers and D1

## Quick Start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Build packages

```bash
pnpm build
```

### 3. Configure Cloudflare

Login to Cloudflare via Wrangler:

```bash
pnpm wrangler login
```

### 4. Deploy infrastructure

Deploy D1 database and workers using Alchemy:

```bash
pnpm infra:deploy
```

This creates:
- D1 database (`f3-db`)
- API Worker (`f3-api`)
- Slack Worker (`f3-slack`)

### 5. Run database migrations

```bash
pnpm db:migrate:remote
```

### 6. Set Slack secrets

```bash
cd apps/cf-slack
pnpm wrangler secret put SLACK_SIGNING_SECRET
pnpm wrangler secret put SLACK_BOT_TOKEN
```

### 7. Configure Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and create a new app
2. Under **Event Subscriptions**, set Request URL to: `https://f3-slack.<your-account>.workers.dev/slack/events`
3. Under **Slash Commands**, create commands pointing to: `https://f3-slack.<your-account>.workers.dev/slack/commands`
4. Under **Interactivity**, set Request URL to: `https://f3-slack.<your-account>.workers.dev/slack/interactions`
5. Install the app to your workspace

## Alternative: Vercel + Supabase

If you prefer Vercel and Supabase over Cloudflare:

### 1. Create Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy the connection string from Settings → Database → Connection string

### 2. Run migrations

In the Supabase SQL Editor, run the migration file:

```bash
# Copy contents of this file to Supabase SQL Editor:
adapters/repo-supabase/migrations/0001_init.sql
```

### 3. Deploy with Pulumi (Recommended)

Use Infrastructure as Code for reproducible deployments:

```bash
# Install Pulumi CLI: https://www.pulumi.com/docs/install/

cd infra/vercel
pnpm install

# Login to Pulumi (free account)
pulumi login

# Initialize stack
pulumi stack init dev

# Configure secrets
pulumi config set githubRepo yourname/f3-kit
pulumi config set databaseUrl "postgresql://..." --secret
pulumi config set slackSigningSecret "xxx" --secret
pulumi config set slackBotToken "xoxb-xxx" --secret

# Set Vercel API token (get from vercel.com/account/tokens)
pulumi config set vercel:apiToken "xxx" --secret

# Deploy all 4 Vercel projects
pulumi up
```

This creates:
- `f3-api` — API serverless functions
- `f3-slack` — Slack bot serverless functions
- `f3-web` — Public website (Astro)
- `f3-pax` — PAX portal (Vite + React)

### 3b. Manual Deployment (Alternative)

If you prefer manual setup over Pulumi:

```bash
# Configure local environment
cd apps/vercel-api
cp .env.example .env.local
# Edit .env.local with your Supabase connection string

# Deploy each app
pnpm deploy:vercel-api
pnpm deploy:vercel-slack
pnpm deploy:vercel-web
pnpm deploy:vercel-pax
```

Then set environment variables in Vercel dashboard for each project.

### 4. Configure Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Set Request URLs (Pulumi outputs these):
   - Events: `https://f3-slack.vercel.app/slack/events`
   - Commands: `https://f3-slack.vercel.app/slack/commands`
   - Interactivity: `https://f3-slack.vercel.app/slack/interactions`

## Local Development

### Run API locally

```bash
pnpm dev:api
```

Runs at http://localhost:8787

### Run Slack worker locally

```bash
pnpm dev:slack
```

Runs at http://localhost:8788

### Run public website locally

```bash
pnpm dev:web
```

Runs at http://localhost:4321 (Astro default)

### Run PAX portal locally

```bash
pnpm dev:pax
```

Runs at http://localhost:5173 (Vite default)

### Apply local migrations

```bash
pnpm db:migrate:local
```

### Expose local dev to Slack (using Cloudflare Tunnel)

```bash
cloudflared tunnel --url http://localhost:8788
```

Use the generated URL in your Slack app configuration for testing.

## Scripts

### Build & Development

| Script | Description |
|--------|-------------|
| `pnpm build` | Build all packages and apps |
| `pnpm build:packages` | Build portable packages (f3-model → f3-api) |
| `pnpm build:adapters` | Build adapters (repo-d1, repo-supabase) |
| `pnpm typecheck` | TypeScript type checking |

### Cloudflare Development

| Script | Description |
|--------|-------------|
| `pnpm dev:api` | Run cf-api locally (port 8787) |
| `pnpm dev:slack` | Run cf-slack locally (port 8788) |
| `pnpm dev:web` | Run cf-web locally (port 4321) |
| `pnpm dev:pax` | Run cf-pax locally (port 5173) |

### Cloudflare Deployment

| Script | Description |
|--------|-------------|
| `pnpm deploy:cf` | Deploy all Cloudflare apps |
| `pnpm deploy:api` | Deploy cf-api worker |
| `pnpm deploy:slack` | Deploy cf-slack worker |
| `pnpm deploy:web` | Deploy cf-web to Pages |
| `pnpm deploy:pax` | Deploy cf-pax to Pages |
| `pnpm infra:deploy` | Deploy Cloudflare infra via Alchemy |
| `pnpm infra:destroy` | Tear down Cloudflare infra |
| `pnpm db:migrate:local` | Run D1 migrations locally |
| `pnpm db:migrate:remote` | Run D1 migrations on Cloudflare |

### Vercel Development

| Script | Description |
|--------|-------------|
| `pnpm dev:vercel-api` | Run vercel-api locally |
| `pnpm dev:vercel-slack` | Run vercel-slack locally |
| `pnpm dev:vercel-web` | Run vercel-web locally |
| `pnpm dev:vercel-pax` | Run vercel-pax locally |

### Vercel Deployment

| Script | Description |
|--------|-------------|
| `pnpm deploy:vercel` | Deploy all Vercel apps |
| `pnpm deploy:vercel-api` | Deploy vercel-api |
| `pnpm deploy:vercel-slack` | Deploy vercel-slack |
| `pnpm deploy:vercel-web` | Deploy vercel-web |
| `pnpm deploy:vercel-pax` | Deploy vercel-pax |
| `pnpm infra:vercel:deploy` | Deploy Vercel infra via Pulumi |
| `pnpm infra:vercel:destroy` | Tear down Vercel infra |
| `pnpm infra:vercel:preview` | Preview Vercel infra changes |

## API Endpoints

### cf-api

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/pax?orgId=xxx` | List PAX by organization |
| GET | `/api/pax/:id` | Get a single PAX |
| POST | `/api/pax/upsert` | Create/update a PAX |
| GET | `/api/event-instances?orgId=xxx` | List events by org (optional: fromDate, toDate) |
| GET | `/api/event-instances/:id` | Get a single event instance |
| POST | `/api/event-instances` | Create an event instance with attendance |

### cf-slack

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/slack/events` | Slack Events API |
| POST | `/slack/commands` | Slash commands |
| POST | `/slack/interactions` | Button/modal interactions |

## Slack Commands

| Command | Description |
|---------|-------------|
| `/backblast <title>` | Create a new event/backblast |
| `/backblast` | Opens a modal for detailed backblast entry |
| `/hc` or `/headcount` | Track headcount (coming soon) |

The Slack app uses [slack-cloudflare-workers](https://github.com/slack-edge/slack-cloudflare-workers), a TypeScript-first framework designed specifically for Cloudflare Workers with built-in:
- Request signature verification
- Lazy listeners for long-running tasks
- Full Slack API type coverage

## Web Apps

### cf-web (Public Website)

Built with **Astro** for fast, static-first content delivery:
- Homepage with F3 mission and information
- Workout schedule and locations
- About page explaining F3's three F's

Deployed to Cloudflare Pages.

### cf-pax (PAX Portal)

Built with **Vite + React** for rich interactivity:
- Dashboard with stats and activity feed
- Events list and calendar views
- PAX directory with search
- Profile management

Features:
- TanStack Query for data fetching
- TanStack Table for data tables
- React Router for navigation
- Tailwind CSS for styling

Deployed to Cloudflare Pages. Requires authentication (configure via Cloudflare Access or custom auth).

## Forking for a Different Platform

To run on AWS, GCP, Fly.io, etc.:

1. **Keep**: `packages/*` (portable core)
2. **Replace**:
   - `apps/cf-*` → your platform's app layer (e.g., `apps/aws-lambda`)
   - `adapters/repo-d1` → e.g., `adapters/repo-postgres`, `adapters/repo-dynamodb`
   - `infra/cf` → e.g., `infra/aws-cdk`, `infra/pulumi`

### The Portability Seams

| Package | What It Does | Portable? |
|---------|--------------|-----------|
| **f3-model** | TypeScript interfaces for all entities | ✅ 100% |
| **f3-repo** | Repository interfaces (PaxRepo, EventRepo, etc.) | ✅ 100% |
| **f3-domain** | Business logic, validation, Result<T> types | ✅ 100% |
| **f3-contracts** | API request/response DTOs | ✅ 100% |
| **f3-api** | HTTP handlers returning `{ body, status }` | ✅ 100% |
| **repo-d1** | Drizzle + Cloudflare D1 implementation | ❌ Replace |
| **cf-api** | Hono + Cloudflare Workers wiring | ❌ Replace |

### Example: Adding AWS Lambda Support

```
packages/           ← Keep all of these
  f3-model/
  f3-repo/
  f3-domain/
  f3-contracts/
  f3-api/           ← Handlers work anywhere!

adapters/
  repo-d1/          ← Keep for Cloudflare
  repo-dynamodb/    ← NEW: Implement PaxRepo, etc. for DynamoDB

apps/
  cf-api/           ← Keep for Cloudflare
  aws-lambda/       ← NEW: Wire f3-api handlers to Lambda

infra/
  cf/               ← Keep for Cloudflare (Alchemy)
  vercel/           ← Keep for Vercel (Pulumi)
  aws-cdk/          ← NEW: CDK stack for Lambda + DynamoDB
```

The `f3-api` handlers don't change—you just inject different repos!

## Environment Variables

### Cloudflare Stack

Cloudflare Workers use `.dev.vars` for local development and `wrangler secret put` for production.

#### cf-api

| Variable | Required | Description |
|----------|----------|-------------|
| `APP_ENV` | No | Environment name (dev/staging/production) |
| `API_TOKEN` | No | Shared secret for Slack→API auth |

#### cf-slack

| Variable | Required | Description |
|----------|----------|-------------|
| `APP_ENV` | No | Environment name |
| `API_BASE_URL` | Yes | URL of the API worker (e.g., `https://f3-api.workers.dev`) |
| `SLACK_SIGNING_SECRET` | Yes | From Slack app Basic Information page |
| `SLACK_BOT_TOKEN` | Yes | Bot token starting with `xoxb-` |
| `API_TOKEN` | No | Must match cf-api's token if set |

#### cf-web

| Variable | Required | Description |
|----------|----------|-------------|
| `PUBLIC_API_URL` | No | API URL for client-side calls |
| `PUBLIC_SITE_URL` | No | Site URL for SEO meta tags |
| `PUBLIC_REGION_NAME` | No | Region name for branding |

#### cf-pax

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | API URL (e.g., `https://f3-api.workers.dev`) |
| `VITE_REGION_NAME` | No | Region name for display |

---

### Vercel Stack

Vercel uses `.env.local` for local development and the Vercel dashboard for production.

#### vercel-api

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Supabase PostgreSQL connection string |
| `API_TOKEN` | No | Shared secret for Slack→API auth |

#### vercel-slack

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Supabase PostgreSQL connection string |
| `SLACK_SIGNING_SECRET` | Yes | From Slack app Basic Information page |
| `SLACK_BOT_TOKEN` | Yes | Bot token starting with `xoxb-` |
| `API_BASE_URL` | Yes | URL of vercel-api (e.g., `https://f3-api.vercel.app`) |
| `API_TOKEN` | No | Must match vercel-api's token if set |

#### vercel-web

| Variable | Required | Description |
|----------|----------|-------------|
| `PUBLIC_SITE_URL` | No | Site URL for SEO meta tags |
| `PUBLIC_REGION_NAME` | No | Region name for branding |

#### vercel-pax

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | API URL (e.g., `https://f3-api.vercel.app`) |
| `VITE_REGION_NAME` | No | Region name for display |

---

### Pulumi Configuration (Vercel IaC)

When using Pulumi for Vercel infrastructure:

```bash
cd infra/vercel
pulumi config set githubRepo yourname/f3-kit
pulumi config set databaseUrl postgresql://... --secret
pulumi config set slackSigningSecret xxx --secret
pulumi config set slackBotToken xoxb-xxx --secret
pulumi config set apiToken your-shared-secret --secret  # Optional
```

---

### Getting Slack Credentials

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Create or select your app
3. **Signing Secret**: Basic Information → App Credentials → Signing Secret
4. **Bot Token**: OAuth & Permissions → Bot User OAuth Token (`xoxb-...`)

### Getting Supabase Connection String

1. Go to [supabase.com](https://supabase.com) → Your Project
2. Settings → Database → Connection string → URI
3. Replace `[YOUR-PASSWORD]` with your database password

## License

**AGPL-3.0** — Free to use, modify, and distribute, but any network deployment must share the complete source code under the same license.

See [LICENSE](./LICENSE) for full terms.
