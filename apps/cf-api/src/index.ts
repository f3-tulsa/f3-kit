/**
 * Cloudflare Workers API Adapter
 *
 * This is the Cloudflare-specific layer that:
 * - Wires Hono routes to f3-api handlers
 * - Provides D1 database bindings
 * - Handles Cloudflare-specific concerns (env, secrets)
 *
 * All business logic and HTTP response formatting is in f3-api.
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { D1Database } from "@cloudflare/workers-types";

import {
  // PAX handlers
  getPaxById,
  listPaxByOrg,
  upsertPax,
  // Event handlers
  getEventById,
  listEventsByOrg,
  createEventInstance,
  // Types
  type PaxDeps,
  type EventDeps,
  type HttpStatusCode,
} from "f3-api";

import {
  createDb,
  D1PaxRepo,
  D1EventInstanceRepo,
  D1AttendanceRepo,
} from "repo-d1";

// =============================================================================
// Cloudflare Worker Types
// =============================================================================

type Env = {
  DB: D1Database;
  APP_ENV: string;
  API_TOKEN?: string;
};

const app = new Hono<{ Bindings: Env }>();

// =============================================================================
// Middleware
// =============================================================================

app.use("*", cors());

// =============================================================================
// Helpers
// =============================================================================

/**
 * Create repository dependencies from Cloudflare D1 binding.
 */
function createDeps(env: Env): PaxDeps & EventDeps {
  const db = createDb(env.DB);
  return {
    paxRepo: new D1PaxRepo(db),
    eventInstanceRepo: new D1EventInstanceRepo(db),
    attendanceRepo: new D1AttendanceRepo(db),
  };
}

/**
 * Simple token auth for machine-to-machine calls.
 * Returns error message if unauthorized, null if OK.
 */
function checkAuth(env: Env, authHeader: string | undefined): string | null {
  const expected = env.API_TOKEN;
  if (!expected) return null; // No token configured = open (dev mode)
  const token = authHeader?.replace(/^Bearer\s+/i, "") ?? "";
  return token === expected ? null : "Unauthorized";
}

/**
 * Return unauthorized response.
 */
function unauthorized(c: any, message: string) {
  return c.json({ ok: false, error: { code: "UNAUTHORIZED", message } }, 401);
}

// =============================================================================
// Routes
// =============================================================================

// Health check
app.get("/health", (c) =>
  c.json({ ok: true, service: "f3-api", env: c.env.APP_ENV })
);

// GET /api/pax?orgId=xxx
app.get("/api/pax", async (c) => {
  const authErr = checkAuth(c.env, c.req.header("authorization"));
  if (authErr) return unauthorized(c, authErr);

  const orgId = c.req.query("orgId");
  if (!orgId) {
    return c.json({ ok: false, error: { code: "VALIDATION_ERROR", message: "orgId query param required" } }, 400);
  }

  const deps = createDeps(c.env);
  const { body, status } = await listPaxByOrg(deps, orgId);
  return c.json(body, status as ContentfulStatusCode);
});

// GET /api/pax/:id
app.get("/api/pax/:id", async (c) => {
  const authErr = checkAuth(c.env, c.req.header("authorization"));
  if (authErr) return unauthorized(c, authErr);

  const deps = createDeps(c.env);
  const { body, status } = await getPaxById(deps, c.req.param("id"));
  return c.json(body, status as ContentfulStatusCode);
});

// POST /api/pax/upsert
app.post("/api/pax/upsert", async (c) => {
  const authErr = checkAuth(c.env, c.req.header("authorization"));
  if (authErr) return unauthorized(c, authErr);

  const reqBody = await c.req.json<{ pax?: any }>();
  const deps = createDeps(c.env);
  const { body, status } = await upsertPax(deps, reqBody?.pax);
  return c.json(body, status as ContentfulStatusCode);
});

// GET /api/event-instances?orgId=xxx&fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD
app.get("/api/event-instances", async (c) => {
  const authErr = checkAuth(c.env, c.req.header("authorization"));
  if (authErr) return unauthorized(c, authErr);

  const orgId = c.req.query("orgId");
  if (!orgId) {
    return c.json({ ok: false, error: { code: "VALIDATION_ERROR", message: "orgId query param required" } }, 400);
  }

  const deps = createDeps(c.env);
  const { body, status } = await listEventsByOrg(deps, {
    orgId,
    fromDate: c.req.query("fromDate"),
    toDate: c.req.query("toDate"),
  });
  return c.json(body, status as ContentfulStatusCode);
});

// GET /api/event-instances/:id
app.get("/api/event-instances/:id", async (c) => {
  const authErr = checkAuth(c.env, c.req.header("authorization"));
  if (authErr) return unauthorized(c, authErr);

  const deps = createDeps(c.env);
  const { body, status } = await getEventById(deps, c.req.param("id"));
  return c.json(body, status as ContentfulStatusCode);
});

// POST /api/event-instances
app.post("/api/event-instances", async (c) => {
  const authErr = checkAuth(c.env, c.req.header("authorization"));
  if (authErr) return unauthorized(c, authErr);

  const reqBody = await c.req.json<{ eventInstance?: any; attendance?: any[] }>();
  const deps = createDeps(c.env);
  const { body, status } = await createEventInstance(deps, {
    eventInstance: reqBody?.eventInstance,
    attendance: reqBody?.attendance,
  });
  return c.json(body, status as ContentfulStatusCode);
});

export default app;
