import type { Extensible, ID } from "./base";
import type { Org } from "./org";
import type { AOTypeKey, DayOfWeek } from "./enums";

/**
 * AO-specific optional fields layered on top of Org.
 * Note: scheduling belongs on EventSeries, but these are useful conveniences for simple apps.
 */
export interface AOFields {
  displayName?: string;

  /**
   * Database-driven AO type classification.
   * Prefer aoTypeId (references a TaxonomyTerm with kind="ao_type").
   * aoTypeKey is a lightweight alternative that still allows arbitrary strings.
   */
  aoTypeId?: ID | null;
  aoTypeKey?: AOTypeKey;

  typicalDays?: DayOfWeek[];
  typicalTime?: string; // "05:30"

  /** Prefer Org.defaultLocationId + Location entity; keep for convenience/back-compat. */
  locationId?: ID | null;
}

/**
 * Alias of Org where orgType="ao".
 */
export type AO<ExtraFields extends object = {}> = Org<AOFields & ExtraFields> & { orgType: "ao" };
