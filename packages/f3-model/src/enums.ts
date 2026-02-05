export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

/**
 * AO types should be data-driven (taxonomy) so regions can customize.
 * For developer ergonomics, we provide a small set of commonly-used keys as hints.
 */
export const KnownAOTypeKeys = [
  "bootcamp",
  "ruck",
  "run",
  "swim",
  "bike",
  "hybrid",
] as const;

export type KnownAOTypeKey = typeof KnownAOTypeKeys[number];

/**
 * Open string type:
 * - allows any string (so it can be configured in the database)
 * - still gives autocomplete for KnownAOTypeKey in editors
 */
export type AOTypeKey = KnownAOTypeKey | (string & {});

export type EventType =
  | "beatdown"
  | "qsource"
  | "special"
  | "convergence"
  | "service"
  | "happy-hour"
  | "other";

export type PaxStatus = "present" | "downrange" | "shield-lock" | "awol";

export type RegionRole = "admin" | "weaselshaker" | "siteq" | "comz" | "pax";

export type AttendanceRole = "pax" | "q" | "coq";

export type OrgType = "ao" | "region" | "area" | "sector" | "nation";

export type EventCadence = "weekly" | "monthly" | "custom";
