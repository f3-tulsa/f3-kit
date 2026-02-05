/**
 * Vercel Slack Bot
 *
 * This is the Vercel-specific Slack bot that:
 * - Handles Slack events, commands, and interactions
 * - Uses Supabase/PostgreSQL for data storage
 * - Calls f3-api handlers for business logic
 */

import { Hono } from "hono";
import { handle } from "hono/vercel";
import crypto from "crypto";

import {
  createDb,
  SupabasePaxRepo,
  SupabaseEventInstanceRepo,
  SupabaseAttendanceRepo,
} from "repo-supabase";

// =============================================================================
// Environment
// =============================================================================

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET!;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN!;
const DATABASE_URL = process.env.DATABASE_URL!;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

// Database connection
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
// Slack Signature Verification
// =============================================================================

function verifySlackSignature(
  signature: string | undefined,
  timestamp: string | undefined,
  body: string
): boolean {
  if (!signature || !timestamp || !SLACK_SIGNING_SECRET) {
    return false;
  }

  // Check timestamp is within 5 minutes
  const time = Math.floor(Date.now() / 1000);
  if (Math.abs(time - parseInt(timestamp)) > 60 * 5) {
    return false;
  }

  const sigBasestring = `v0:${timestamp}:${body}`;
  const mySignature =
    "v0=" +
    crypto
      .createHmac("sha256", SLACK_SIGNING_SECRET)
      .update(sigBasestring)
      .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(mySignature),
    Buffer.from(signature)
  );
}

// =============================================================================
// Hono App
// =============================================================================

const app = new Hono();

// Health check
app.get("/health", (c) =>
  c.json({ ok: true, service: "f3-slack-vercel", env: process.env.NODE_ENV })
);

// =============================================================================
// Slack Events API
// =============================================================================

app.post("/slack/events", async (c) => {
  const body = await c.req.text();
  const payload = JSON.parse(body);

  // URL verification challenge
  if (payload.type === "url_verification") {
    return c.json({ challenge: payload.challenge });
  }

  // Verify signature
  const signature = c.req.header("x-slack-signature");
  const timestamp = c.req.header("x-slack-request-timestamp");

  if (!verifySlackSignature(signature, timestamp, body)) {
    return c.json({ error: "Invalid signature" }, 401);
  }

  // Handle events
  const event = payload.event;

  if (event?.type === "app_mention") {
    // Respond to mentions
    console.log("App mentioned:", event.text);
  }

  return c.json({ ok: true });
});

// =============================================================================
// Slash Commands
// =============================================================================

app.post("/slack/commands", async (c) => {
  const body = await c.req.text();

  // Verify signature
  const signature = c.req.header("x-slack-signature");
  const timestamp = c.req.header("x-slack-request-timestamp");

  if (!verifySlackSignature(signature, timestamp, body)) {
    return c.json({ error: "Invalid signature" }, 401);
  }

  const params = new URLSearchParams(body);
  const command = params.get("command");
  const text = params.get("text") || "";
  const userId = params.get("user_id");
  const channelId = params.get("channel_id");

  console.log(`Command: ${command}, Text: ${text}, User: ${userId}`);

  if (command === "/backblast") {
    // Quick backblast response
    if (text) {
      return c.json({
        response_type: "in_channel",
        text: `🏋️ *Backblast*\n${text}\n\n_Posted by <@${userId}>_`,
      });
    }

    // Open modal for detailed entry
    // In production, you'd call Slack's views.open API here
    return c.json({
      response_type: "ephemeral",
      text: "Opening backblast form... (Modal would open here in production)",
    });
  }

  if (command === "/hc" || command === "/headcount") {
    return c.json({
      response_type: "ephemeral",
      text: "👍 Headcount noted! (Feature coming soon)",
    });
  }

  return c.json({
    response_type: "ephemeral",
    text: `Unknown command: ${command}`,
  });
});

// =============================================================================
// Interactions (Buttons, Modals)
// =============================================================================

app.post("/slack/interactions", async (c) => {
  const body = await c.req.text();

  // Verify signature
  const signature = c.req.header("x-slack-signature");
  const timestamp = c.req.header("x-slack-request-timestamp");

  if (!verifySlackSignature(signature, timestamp, body)) {
    return c.json({ error: "Invalid signature" }, 401);
  }

  const params = new URLSearchParams(body);
  const payloadStr = params.get("payload");
  if (!payloadStr) {
    return c.json({ error: "Missing payload" }, 400);
  }

  const payload = JSON.parse(payloadStr);
  console.log("Interaction:", payload.type);

  if (payload.type === "view_submission") {
    // Handle modal submission
    return c.json({ response_action: "clear" });
  }

  if (payload.type === "block_actions") {
    // Handle button clicks
    const action = payload.actions?.[0];
    console.log("Action:", action?.action_id);
  }

  return c.json({ ok: true });
});

// =============================================================================
// Export for Vercel
// =============================================================================

export default handle(app);
