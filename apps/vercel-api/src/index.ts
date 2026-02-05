/**
 * Vercel Serverless Function Entry Point
 *
 * This is the Vercel-specific layer that:
 * - Wires Hono routes to f3-api handlers
 * - Provides Supabase/PostgreSQL database connection
 * - Handles Vercel-specific concerns (env vars)
 *
 * All business logic and HTTP response formatting is in f3-api.
 */

import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";

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
} from "f3-api";

import {
  createDb,
  SupabasePaxRepo,
  SupabaseEventInstanceRepo,
  SupabaseAttendanceRepo,
} from "repo-supabase";

// =============================================================================
// Environment & Database
// =============================================================================

const DATABASE_URL = process.env.DATABASE_URL!;
const API_TOKEN = process.env.API_TOKEN;

// Create database connection (reused across requests in warm lambdas)
let db: ReturnType<typeof createDb> | null = null;

function getDb() {
  if (!db) {
    if (!DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    db = createDb(DATABASE_URL);
  }
  return db;
}

// =============================================================================
// Hono App
// =============================================================================

const app = new Hono().basePath("/api");

// Middleware
app.use("*", cors());

// =============================================================================
// Helpers
// =============================================================================

function createDeps(): PaxDeps & EventDeps {
  const database = getDb();
  return {
    paxRepo: new SupabasePaxRepo(database),
    eventInstanceRepo: new SupabaseEventInstanceRepo(database),
    attendanceRepo: new SupabaseAttendanceRepo(database),
  };
}

function checkAuth(authHeader: string | undefined): string | null {
  if (!API_TOKEN) return null; // No token configured = open (dev mode)
  const token = authHeader?.replace(/^Bearer\s+/i, "") ?? "";
  return token === API_TOKEN ? null : "Unauthorized";
}

function unauthorized(c: any, message: string) {
  return c.json({ ok: false, error: { code: "UNAUTHORIZED", message } }, 401);
}

// =============================================================================
// Routes
// =============================================================================

// Health check
app.get("/health", (c) =>
  c.json({ ok: true, service: "f3-api-vercel", env: process.env.NODE_ENV })
);

// GET /api/pax?orgId=xxx
app.get("/pax", async (c) => {
  const authErr = checkAuth(c.req.header("authorization"));
  if (authErr) return unauthorized(c, authErr);

  const orgId = c.req.query("orgId");
  if (!orgId) {
    return c.json({ ok: false, error: { code: "VALIDATION_ERROR", message: "orgId query param required" } }, 400);
  }

  const deps = createDeps();
  const { body, status } = await listPaxByOrg(deps, orgId);
  return c.json(body, status as any);
});

// GET /api/pax/:id
app.get("/pax/:id", async (c) => {
  const authErr = checkAuth(c.req.header("authorization"));
  if (authErr) return unauthorized(c, authErr);

  const deps = createDeps();
  const { body, status } = await getPaxById(deps, c.req.param("id"));
  return c.json(body, status as any);
});

// POST /api/pax/upsert
app.post("/pax/upsert", async (c) => {
  const authErr = checkAuth(c.req.header("authorization"));
  if (authErr) return unauthorized(c, authErr);

  const reqBody = await c.req.json<{ pax?: any }>();
  const deps = createDeps();
  const { body, status } = await upsertPax(deps, reqBody?.pax);
  return c.json(body, status as any);
});

// GET /api/event-instances?orgId=xxx&fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD
app.get("/event-instances", async (c) => {
  const authErr = checkAuth(c.req.header("authorization"));
  if (authErr) return unauthorized(c, authErr);

  const orgId = c.req.query("orgId");
  if (!orgId) {
    return c.json({ ok: false, error: { code: "VALIDATION_ERROR", message: "orgId query param required" } }, 400);
  }

  const deps = createDeps();
  const { body, status } = await listEventsByOrg(deps, {
    orgId,
    fromDate: c.req.query("fromDate"),
    toDate: c.req.query("toDate"),
  });
  return c.json(body, status as any);
});

// GET /api/event-instances/:id
app.get("/event-instances/:id", async (c) => {
  const authErr = checkAuth(c.req.header("authorization"));
  if (authErr) return unauthorized(c, authErr);

  const deps = createDeps();
  const { body, status } = await getEventById(deps, c.req.param("id"));
  return c.json(body, status as any);
});

// POST /api/event-instances
app.post("/event-instances", async (c) => {
  const authErr = checkAuth(c.req.header("authorization"));
  if (authErr) return unauthorized(c, authErr);

  const reqBody = await c.req.json<{ eventInstance?: any; attendance?: any[] }>();
  const deps = createDeps();
  const { body, status } = await createEventInstance(deps, {
    eventInstance: reqBody?.eventInstance,
    attendance: reqBody?.attendance,
  });
  return c.json(body, status as any);
});

// =============================================================================
// Export for Vercel
// =============================================================================

export default handle(app);
