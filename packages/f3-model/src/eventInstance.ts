import type { EntityBase, Extensible, ID, Taggable, Metadatable } from "./base";
import type { EventType } from "./enums";

/**
 * Nation-aligned single occurrence (maps to Nation EventInstance).
 * NOTE: Your app may still choose to store a combined ISODateTime; this model is designed for clean Nation export.
 */
export interface EventInstanceBase extends EntityBase, Taggable, Metadatable {
  orgId: ID;
  locationId?: ID | null;
  seriesId?: ID | null;

  type?: EventType;

  name?: string;
  description?: string;

  isActive?: boolean;
  highlight?: boolean;

  /** ISO date (YYYY-MM-DD). Required for Nation portability. */
  startDate: string;

  /** Optional ISO date (YYYY-MM-DD) */
  endDate?: string;

  /** Local time, e.g. "05:30" */
  startTime?: string;
  endTime?: string;

  paxCount?: number;
  fngCount?: number;

  /** Optional content fields */
  preblast?: string;
  backblast?: string;
  preblastRich?: unknown;
  backblastRich?: unknown;

  /** Slack message TS values (if applicable) */
  preblastTs?: string;
  backblastTs?: string;

  /** Optional convenience lists for small datasets; prefer Attendance join rows at scale. */
  qPaxIds?: ID[];
  coQPaxIds?: ID[];
  paxIds?: ID[];
}

export type EventInstance<ExtraFields extends object = {}> = Extensible<EventInstanceBase, ExtraFields>;
