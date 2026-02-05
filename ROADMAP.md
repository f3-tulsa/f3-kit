# F3 Platform Roadmap

Track progress on features and enhancements. Check boxes as items are completed.

---

## Phase 1: Foundation ✅

Core architecture and portable packages.

### Data Layer
- [x] `f3-model` — Core entity types (Org, Location, Person, Pax, Event, Attendance)
- [x] `f3-repo` — Repository interfaces (PaxRepo, EventInstanceRepo, AttendanceRepo, OrgRepo)
- [x] `f3-domain` — Business logic services with `Result<T>` error handling
- [x] `f3-contracts` — API request/response DTOs

### HTTP Layer
- [x] `f3-api` — Generic HTTP handlers (framework-agnostic)
- [x] Domain error → HTTP status mapping
- [x] Dependency injection pattern for repos

### Cloudflare Adapter
- [x] `repo-d1` — Drizzle ORM + Cloudflare D1 implementation
- [x] `cf-api` — Hono routing, D1 bindings, auth middleware
- [x] `infra/cf` — Alchemy infrastructure as code
- [x] D1 migrations schema

### Vercel + Supabase Adapter
- [x] `repo-supabase` — Drizzle ORM + PostgreSQL implementation
- [x] `vercel-api` — Hono + Vercel Serverless Functions
- [x] `vercel-slack` — Slack bot for Vercel
- [x] `vercel-web` — Astro site for Vercel
- [x] `vercel-pax` — React PAX portal for Vercel
- [x] Supabase migrations schema
- [x] Environment variable examples
- [x] Pulumi infrastructure as code (`infra/vercel`)

### Documentation
- [x] README with architecture diagram
- [x] Onion layer documentation
- [x] Local development instructions
- [x] AGPL-3.0 license

---

## Phase 2: Slack Integration 🚧

Slack bot for posting workouts and tracking attendance.

### Basic Commands
- [x] Slack worker scaffolding (`cf-slack`)
- [x] `slack-cloudflare-workers` integration
- [x] `/backblast` slash command (basic)
- [x] Health check endpoint
- [ ] Request signature verification (production)

### Backblast Flow
- [ ] Backblast modal with full fields (AO, Q, PAX list, date, notes)
- [ ] PAX autocomplete from database
- [ ] Create EventInstance + Attendance on submit
- [ ] Confirmation message with summary

### Attendance Tracking
- [ ] Post workout summary to channel
- [ ] Track attendance via emoji reactions
- [ ] "I was there" button interaction
- [ ] FNG (first-time) detection and welcome

### Notifications
- [ ] Daily Q schedule reminder
- [ ] Weekly stats summary
- [ ] HC (headcount) pre-blast reminders

---

## Phase 3: Public Website 📋

Static marketing/info site for the region.

### Core Pages
- [x] Astro project scaffolding (`cf-web`)
- [x] Tailwind CSS setup
- [ ] Homepage with hero and mission
- [ ] "What is F3?" explainer page
- [ ] Workout schedule / AO locations
- [ ] Contact / getting started page

### Content
- [ ] Region-specific branding (logo, colors)
- [ ] AO cards with map integration
- [ ] Weekly schedule calendar view
- [ ] Photo gallery (optional)

### Deployment
- [x] Cloudflare Pages configuration
- [ ] Custom domain setup
- [ ] SEO meta tags

---

## Phase 4: PAX Portal 📋

Authenticated web app for PAX to view stats and manage profile.

### Authentication
- [x] Vite + React scaffolding (`cf-pax`)
- [x] React Router setup
- [ ] Cloudflare Access integration OR custom auth
- [ ] Login/logout flow
- [ ] Protected routes

### Dashboard
- [x] Dashboard page shell
- [ ] Personal stats (posts this month/year, streak)
- [ ] Recent activity feed
- [ ] Upcoming events

### Events
- [x] Events page shell
- [ ] Event list with filters (date range, AO)
- [ ] Event detail view with attendance
- [ ] Calendar view (monthly)

### PAX Directory
- [x] PAX list page shell
- [ ] Search and filter
- [ ] PAX profile cards
- [ ] Link to individual profiles

### Profile
- [x] Profile page shell
- [ ] Edit F3 name, contact info
- [ ] View personal attendance history
- [ ] Badge/achievement display (future)

---

## Phase 5: Data & Analytics 📋

Reporting and insights for region leadership.

### Region Stats
- [ ] Total PAX count, active vs inactive
- [ ] Posts per week/month trends
- [ ] AO popularity rankings
- [ ] Q rotation tracking

### Individual Stats
- [ ] Personal post history
- [ ] Streak tracking (consecutive weeks)
- [ ] "Respect" detection (6+ months inactive)

### Exports
- [ ] CSV export for PAX list
- [ ] CSV export for attendance records
- [ ] API endpoints for integrations

---

## Phase 6: Fitness Tests 📋

Track timed and rep-based fitness benchmarks.

### Test Definitions
- [ ] `FitnessTest` model (name, type, unit)
- [ ] Standard tests (Murph, mile run, max pullups, etc.)
- [ ] Custom test creation

### Results Tracking
- [ ] `FitnessTestResult` model (paxId, testId, value, date)
- [ ] Record results via Slack or portal
- [ ] Personal best tracking

### Leaderboards
- [ ] Region leaderboards by test
- [ ] Age-group categories (optional)
- [ ] Personal progress charts

---

## Future Ideas 💡

Unprioritized ideas for later consideration.

- [ ] Multi-region support (Nation-level features)
- [ ] Region-to-region PAX transfers
- [ ] Gear/merchandise store integration
- [ ] CSAUP (special event) planning
- [ ] Shield Lock support resources
- [ ] Mobile app (React Native?)
- [ ] AWS Lambda adapter (`aws-lambda` + `repo-dynamodb`)
- [ ] PostgreSQL adapter (`repo-postgres`)
- [ ] Email notifications (in addition to Slack)
- [ ] iCal feed for workout schedule
- [ ] Strava/fitness tracker integration

---

## Completed Milestones

| Date | Milestone |
|------|-----------|
| 2026-01 | Phase 1 complete — Foundation architecture |
| 2026-01 | Onion architecture with f3-api layer |
| 2026-01 | Drizzle ORM integration |
| 2026-01 | AGPL-3.0 license |
| 2026-01 | Vercel + Supabase adapter |
| 2026-01 | Full Vercel app suite (api, slack, web, pax) |
| 2026-01 | Pulumi IaC for Vercel |

---

## Contributing

See [README.md](./README.md) for setup instructions. When completing a roadmap item:

1. Check the box in this file
2. Add to "Completed Milestones" if significant
3. Update README if it affects usage/setup
