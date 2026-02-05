import type { ID } from "./base";

// =============================================================================
// Relationship Types
// =============================================================================

/**
 * The type of entity being referenced in a relationship.
 * Extensible with `string & {}` to allow custom entity types.
 */
export type RelationshipTargetType =
  | "org"
  | "person"
  | "event"
  | "eventSeries"
  | "location"
  | "taxonomy"
  | (string & {});

/**
 * Common relationship roles in F3.
 * Extensible with `string & {}` to allow custom roles.
 *
 * Org → Org Roles:
 * - "parent": Parent org (e.g., Region is parent of AO)
 * - "child": Child org (inverse of parent)
 *
 * Person → Org Roles:
 * - "member": General membership in an org
 * - "home_ao": PAX's home AO (where they post most often)
 * - "home_region": PAX's home Region
 * - "site_q": Site Q for an AO
 * - "nantan": Nantan (leader) of a Region/Area
 * - "weasel_shaker": Region leadership role
 * - "comz": Communications lead
 *
 * Person → Person Roles:
 * - "eh": The PAX who EH'd (recruited) this person
 * - "m": Married to (spouse relationship)
 * - "shield_lock": Accountability partner
 * - "nantan": Mentorship relationship
 *
 * Person → Event Roles:
 * - "q": Q (leader) for this event
 * - "co_q": Co-Q for this event
 * - "attendee": Attended this event
 * - "fng": First time attendee (FNG)
 */
export type RelationshipRole =
  // Org → Org
  | "parent"
  | "child"
  // Person → Org
  | "member"
  | "home_ao"
  | "home_region"
  | "site_q"
  | "nantan"
  | "weasel_shaker"
  | "comz"
  // Person → Person
  | "eh"
  | "m"
  | "shield_lock"
  // Person → Event
  | "q"
  | "co_q"
  | "attendee"
  | "fng"
  // Extensible
  | (string & {});

/**
 * A relationship between two entities.
 *
 * @example
 * // PAX's home AO relationship
 * {
 *   targetType: "org",
 *   targetId: "ao-centennial",
 *   role: "home_ao",
 * }
 *
 * @example
 * // Who EH'd this PAX
 * {
 *   targetType: "person",
 *   targetId: "pax-dredd",
 *   role: "eh",
 *   meta: { ehDate: "2023-06-15" }
 * }
 *
 * @example
 * // Region parent relationship
 * {
 *   targetType: "org",
 *   targetId: "region-tulsa",
 *   role: "parent",
 * }
 */
export interface Relationship {
  /** The type of entity being referenced. */
  targetType: RelationshipTargetType;

  /** The ID of the related entity. */
  targetId: ID;

  /** The role/nature of this relationship. */
  role: RelationshipRole;

  /** Optional metadata for this specific relationship. */
  meta?: Record<string, unknown>;
}

/** Mixin for entities that can have relationships to other entities. */
export interface Relatable {
  relationships?: Relationship[];
}

// Legacy alias - prefer RelationshipTargetType
export type RelationshipType = RelationshipTargetType;
