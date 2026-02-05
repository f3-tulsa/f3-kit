import type { EntityBase, Extensible, ID, Taggable, Metadatable } from "./base";
import type { DayOfWeek, EventCadence } from "./enums";

/**
 * Nation-aligned recurring schedule definition (maps to Nation Event when is_series=true).
 */
export interface EventSeriesBase extends EntityBase, Taggable, Metadatable {
  /** Usually the AO org, but can be any org. */
  orgId: ID;

  /** Optional explicit location for this series; otherwise use Org.defaultLocationId. */
  locationId?: ID | null;

  name: string;
  description?: string;

  isActive?: boolean;
  isPrivate?: boolean;
  highlight?: boolean;

  /** ISO date (YYYY-MM-DD) */
  startDate?: string;
  endDate?: string;

  /** Local time, e.g. "05:30" */
  startTime?: string;
  endTime?: string;

  dayOfWeek?: DayOfWeek;

  cadence?: EventCadence;
  recurrencePattern?: string;
  recurrenceInterval?: number;
  indexWithinInterval?: number;

  paxCount?: number;
  fngCount?: number;
}

export type EventSeries<ExtraFields extends object = {}> = Extensible<EventSeriesBase, ExtraFields>;
