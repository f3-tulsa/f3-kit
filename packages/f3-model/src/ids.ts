// =============================================================================
// Entity ID Prefixes
// =============================================================================

/**
 * Standard prefixes for entity GUIDs.
 * These identify the entity type at a glance and persist through name changes.
 */
export const EntityPrefix = {
  // Core entities
  ORG: "org",
  PERSON: "per",
  PAX: "pax",
  LOCATION: "loc",

  // Events
  EVENT_SERIES: "evs",
  EVENT_INSTANCE: "evt",
  ATTENDANCE: "att",

  // Taxonomy
  TAXONOMY_TERM: "tax",
} as const;

export type EntityPrefixType = (typeof EntityPrefix)[keyof typeof EntityPrefix];

// =============================================================================
// Branded ID Types (for type safety)
// =============================================================================

/**
 * Branded type for type-safe entity IDs.
 * This allows TypeScript to distinguish between OrgId and PaxId at compile time.
 *
 * @example
 * function getOrg(id: OrgId): Org { ... }
 * getOrg(paxId); // TypeScript error!
 */
type Brand<T, BrandType> = T & { readonly __brand: BrandType };

export type OrgId = Brand<string, "OrgId">;
export type PersonId = Brand<string, "PersonId">;
export type PaxId = Brand<string, "PaxId">;
export type LocationId = Brand<string, "LocationId">;
export type EventSeriesId = Brand<string, "EventSeriesId">;
export type EventInstanceId = Brand<string, "EventInstanceId">;
export type AttendanceId = Brand<string, "AttendanceId">;
export type TaxonomyTermId = Brand<string, "TaxonomyTermId">;

/** Union of all entity ID types. */
export type EntityId =
  | OrgId
  | PersonId
  | PaxId
  | LocationId
  | EventSeriesId
  | EventInstanceId
  | AttendanceId
  | TaxonomyTermId;

// =============================================================================
// ID Generation
// =============================================================================

/**
 * Generate a random GUID base.
 * Uses crypto.randomUUID when available (Workers, Node 19+, browsers).
 */
function generateGuidBase(): string {
  if (globalThis.crypto && "randomUUID" in globalThis.crypto) {
    return globalThis.crypto.randomUUID() as string;
  }
  // Fallback for older environments
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Generic ID generator with optional prefix.
 * @deprecated Prefer entity-specific functions like newOrgId(), newPaxId(), etc.
 */
export function newId(prefix?: string): string {
  const base = generateGuidBase();
  return prefix ? `${prefix}_${base}` : base;
}

/** Generate a new Organization ID. */
export function newOrgId(): OrgId {
  return `${EntityPrefix.ORG}_${generateGuidBase()}` as OrgId;
}

/** Generate a new Person ID (non-PAX). */
export function newPersonId(): PersonId {
  return `${EntityPrefix.PERSON}_${generateGuidBase()}` as PersonId;
}

/** Generate a new PAX ID. */
export function newPaxId(): PaxId {
  return `${EntityPrefix.PAX}_${generateGuidBase()}` as PaxId;
}

/** Generate a new Location ID. */
export function newLocationId(): LocationId {
  return `${EntityPrefix.LOCATION}_${generateGuidBase()}` as LocationId;
}

/** Generate a new Event Series ID. */
export function newEventSeriesId(): EventSeriesId {
  return `${EntityPrefix.EVENT_SERIES}_${generateGuidBase()}` as EventSeriesId;
}

/** Generate a new Event Instance ID. */
export function newEventInstanceId(): EventInstanceId {
  return `${EntityPrefix.EVENT_INSTANCE}_${generateGuidBase()}` as EventInstanceId;
}

/** Generate a new Attendance ID. */
export function newAttendanceId(): AttendanceId {
  return `${EntityPrefix.ATTENDANCE}_${generateGuidBase()}` as AttendanceId;
}

/** Generate a new Taxonomy Term ID. */
export function newTaxonomyTermId(): TaxonomyTermId {
  return `${EntityPrefix.TAXONOMY_TERM}_${generateGuidBase()}` as TaxonomyTermId;
}

// =============================================================================
// ID Parsing & Validation
// =============================================================================

/**
 * Extract the prefix from an entity ID.
 * @returns The prefix (e.g., "org", "pax") or null if no prefix found.
 */
export function getIdPrefix(id: string): EntityPrefixType | null {
  const match = id.match(/^([a-z]+)_/);
  if (!match) return null;

  const prefix = match[1];
  const validPrefixes = Object.values(EntityPrefix) as string[];
  return validPrefixes.includes(prefix) ? (prefix as EntityPrefixType) : null;
}

/**
 * Check if an ID is of a specific entity type.
 */
export function isOrgId(id: string): id is OrgId {
  return id.startsWith(`${EntityPrefix.ORG}_`);
}

export function isPersonId(id: string): id is PersonId {
  return id.startsWith(`${EntityPrefix.PERSON}_`);
}

export function isPaxId(id: string): id is PaxId {
  return id.startsWith(`${EntityPrefix.PAX}_`);
}

export function isLocationId(id: string): id is LocationId {
  return id.startsWith(`${EntityPrefix.LOCATION}_`);
}

export function isEventSeriesId(id: string): id is EventSeriesId {
  return id.startsWith(`${EntityPrefix.EVENT_SERIES}_`);
}

export function isEventInstanceId(id: string): id is EventInstanceId {
  return id.startsWith(`${EntityPrefix.EVENT_INSTANCE}_`);
}

export function isAttendanceId(id: string): id is AttendanceId {
  return id.startsWith(`${EntityPrefix.ATTENDANCE}_`);
}

export function isTaxonomyTermId(id: string): id is TaxonomyTermId {
  return id.startsWith(`${EntityPrefix.TAXONOMY_TERM}_`);
}

/**
 * Get the entity type from an ID.
 * @returns The entity type name or "unknown" if not recognized.
 */
export function getEntityType(id: string): string {
  if (isOrgId(id)) return "org";
  if (isPersonId(id)) return "person";
  if (isPaxId(id)) return "pax";
  if (isLocationId(id)) return "location";
  if (isEventSeriesId(id)) return "eventSeries";
  if (isEventInstanceId(id)) return "eventInstance";
  if (isAttendanceId(id)) return "attendance";
  if (isTaxonomyTermId(id)) return "taxonomyTerm";
  return "unknown";
}

// =============================================================================
// Utility Functions
// =============================================================================

/** Get the current timestamp in ISO format. */
export function nowIso(): string {
  return new Date().toISOString();
}

/** Get today's date in YYYY-MM-DD format. */
export function todayDate(): string {
  return new Date().toISOString().split("T")[0];
}
