import { SlackApp } from "slack-cloudflare-workers";
import type { CreateEventInstanceRequest } from "f3-contracts";
import { newEventInstanceId, nowIso } from "f3-model";

// =============================================================================
// Types
// =============================================================================

type Env = {
  APP_ENV: string;
  API_BASE_URL: string;
  API_TOKEN?: string;
  SLACK_SIGNING_SECRET: string;
  SLACK_BOT_TOKEN: string;
};

// =============================================================================
// API Client
// =============================================================================

async function callApi<T>(
  env: Env,
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: unknown
): Promise<{ ok: boolean; status: number; data: T | null }> {
  const url = new URL(path, env.API_BASE_URL).toString();
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (env.API_TOKEN) headers["authorization"] = `Bearer ${env.API_TOKEN}`;

  try {
    const resp = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = (await resp.json().catch(() => null)) as T | null;
    return { ok: resp.ok, status: resp.status, data };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}

// =============================================================================
// Slack App
// =============================================================================

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const app = new SlackApp({ env });

    // =========================================================================
    // Event Handlers
    // =========================================================================

    // Handle app_mention events
    app.event("app_mention", async ({ payload, context }) => {
      const { channel, user, text, ts } = payload;
      console.log(`App mentioned by ${user} in ${channel}: ${text}`);

      // Respond to the mention
      await context.client.chat.postMessage({
        channel,
        thread_ts: ts,
        text: `Hey <@${user}>! I'm the F3 bot. Try \`/backblast\` to post a workout recap.`,
      });
    });

    // Handle message events (for future backblast parsing, etc.)
    app.anyMessage(async ({ payload }) => {
      // Only process regular messages, not subtypes
      if ("subtype" in payload && payload.subtype) return;
      console.log(`Message from ${payload.user}: ${payload.text}`);
      // TODO: Parse messages for backblast content, HC counts, etc.
    });

    // =========================================================================
    // Slash Commands
    // =========================================================================

    // /backblast command - create an event/workout recap
    app.command(
      "/backblast",
      // Ack handler - must respond quickly
      async ({ payload, context }) => {
        const { text, user_id, user_name, channel_id, channel_name, trigger_id } = payload;

        // If no text provided, open a modal for input
        if (!text || text.trim() === "") {
          await context.client.views.open({
            trigger_id,
            view: {
              type: "modal",
              callback_id: "backblast_modal",
              title: { type: "plain_text", text: "Post Backblast" },
              submit: { type: "plain_text", text: "Submit" },
              close: { type: "plain_text", text: "Cancel" },
              blocks: [
                {
                  type: "input",
                  block_id: "title_block",
                  label: { type: "plain_text", text: "Workout Title" },
                  element: {
                    type: "plain_text_input",
                    action_id: "title_input",
                    placeholder: { type: "plain_text", text: "e.g., The Murph" },
                  },
                },
                {
                  type: "input",
                  block_id: "date_block",
                  label: { type: "plain_text", text: "Date" },
                  element: {
                    type: "datepicker",
                    action_id: "date_input",
                    initial_date: nowIso().slice(0, 10),
                  },
                },
                {
                  type: "input",
                  block_id: "pax_block",
                  label: { type: "plain_text", text: "PAX Count" },
                  element: {
                    type: "number_input",
                    action_id: "pax_input",
                    is_decimal_allowed: false,
                    min_value: "1",
                  },
                  optional: true,
                },
                {
                  type: "input",
                  block_id: "summary_block",
                  label: { type: "plain_text", text: "Workout Summary" },
                  element: {
                    type: "plain_text_input",
                    action_id: "summary_input",
                    multiline: true,
                    placeholder: { type: "plain_text", text: "What happened at the workout?" },
                  },
                  optional: true,
                },
              ],
              private_metadata: JSON.stringify({ channel_id, channel_name, user_id, user_name }),
            },
          });
          return; // Empty ack
        }

        // Quick backblast with just the title - create in lazy handler
        return {
          response_type: "in_channel" as const,
          text: `⏳ Creating backblast: *${text}*...`,
        };
      },
      // Lazy handler - runs after ack, can take longer
      async (req) => {
        const { text, user_id, user_name, channel_id, channel_name } = req.payload;

        if (!text || text.trim() === "") return; // Modal was opened instead

        const result = await createBackblast(req.env, {
          title: text,
          userName: user_name,
          channelName: channel_name,
        });

        if (result.ok) {
          await req.context.client.chat.postMessage({
            channel: channel_id,
            text: `✅ Backblast posted by <@${user_id}>: *${text}*`,
          });
        } else {
          await req.context.client.chat.postEphemeral({
            channel: channel_id,
            user: user_id,
            text: `❌ Failed to create backblast. Please try again.`,
          });
        }
      }
    );

    // /hc or /headcount command
    app.command("/hc", async ({ payload }) => {
      return {
        response_type: "ephemeral" as const,
        text: `📊 Headcount tracking coming soon! Text: ${payload.text}`,
      };
    });

    app.command("/headcount", async ({ payload }) => {
      return {
        response_type: "ephemeral" as const,
        text: `📊 Headcount tracking coming soon! Text: ${payload.text}`,
      };
    });

    // =========================================================================
    // View Submissions (Modals)
    // =========================================================================

    app.viewSubmission(
      "backblast_modal",
      // Ack handler
      async () => {
        // Return empty to close the modal
        return;
      },
      // Lazy handler
      async (req) => {
        const values = req.payload.view.state.values;
        const title = values.title_block?.title_input?.value ?? "Untitled";
        const date = values.date_block?.date_input?.selected_date ?? nowIso().slice(0, 10);
        const paxCountStr = values.pax_block?.pax_input?.value;
        const paxCount = paxCountStr ? parseInt(paxCountStr, 10) : undefined;
        const summary = values.summary_block?.summary_input?.value;

        const metadata = JSON.parse(req.payload.view.private_metadata || "{}");
        const channelId = metadata.channel_id;
        const channelName = metadata.channel_name;
        const userId = metadata.user_id;
        const userName = metadata.user_name || req.payload.user.name || req.payload.user.id;

        const result = await createBackblast(req.env, {
          title,
          date,
          paxCount,
          summary,
          userName,
          channelName,
        });

        if (result.ok && channelId) {
          await req.context.client.chat.postMessage({
            channel: channelId,
            text: `✅ Backblast posted by <@${userId}>: *${title}*${summary ? `\n> ${summary.slice(0, 200)}${summary.length > 200 ? "..." : ""}` : ""}`,
          });
        }
      }
    );

    // =========================================================================
    // Block Actions (Buttons, etc.)
    // =========================================================================

    app.action(
      /.*/,
      async ({ payload }) => {
        console.log("Block action received:", payload.actions);
        // Ack the action
        return;
      }
    );

    // =========================================================================
    // Run the app
    // =========================================================================

    return await app.run(request, ctx);
  },
};

// =============================================================================
// Helper Functions
// =============================================================================

interface BackblastInput {
  title: string;
  date?: string;
  paxCount?: number;
  summary?: string;
  userName: string;
  channelName?: string;
}

async function createBackblast(
  env: Env,
  input: BackblastInput
): Promise<{ ok: boolean }> {
  const now = nowIso();
  const date = input.date ?? now.slice(0, 10);

  const request: CreateEventInstanceRequest = {
    eventInstance: {
      id: newEventInstanceId(),
      createdAt: now,
      updatedAt: now,
      orgId: "org_default", // TODO: Look up org from Slack workspace
      type: "beatdown",
      startDate: date,
      startTime: "05:30",
      name: input.title,
      description: input.summary,
      paxCount: input.paxCount,
      tags: [
        "source:slack",
        ...(input.channelName ? [`channel:${input.channelName}`] : []),
      ],
    },
    attendance: [],
  };

  const result = await callApi(env, "/api/event-instances", "POST", request);
  return { ok: result.ok };
}
