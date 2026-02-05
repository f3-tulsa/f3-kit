import type { Extensible, ID } from "./base";
import type { PersonBase } from "./person";
import type { PaxStatus } from "./enums";

/**
 * Base interface for a PAX (participant) in F3.
 * Extends Person with F3-specific fields.
 *
 * Nation-compatible: maps to the Person/User entity with F3-specific fields.
 *
 * F3 Membership Model:
 * - A PAX is a Person who has an F3 name and belongs to a Region.
 * - orgId: The PAX's primary/home Region (required).
 * - homeOrgId: The PAX's home AO within that Region (optional).
 *
 * Additional Relationships (via relationships[]):
 * - "eh": The PAX who EH'd (recruited) this person into F3.
 * - "shield_lock": Accountability partner(s).
 * - "site_q": If this PAX is Site Q for an AO.
 * - "nantan": Leadership relationships.
 *
 * @example
 * const pax: Pax = {
 *   id: "pax-chappie",
 *   f3Name: "Chappie",
 *   orgId: "region-tulsa",        // Home Region
 *   homeOrgId: "ao-centennial",   // Home AO
 *   relationships: [
 *     { targetType: "person", targetId: "pax-dredd", role: "eh" },
 *   ],
 *   // ... other fields
 * };
 */
export interface PaxBase extends PersonBase {
  /**
   * Primary Region Org ID (required for PAX).
   * This is the PAX's "home Region" for Nation compatibility.
   */
  orgId: ID;

  /** F3 name / nickname (required - this is what makes someone a PAX). */
  f3Name: string;

  /**
   * Home AO Org ID (optional).
   * The specific AO within the Region where this PAX posts most often.
   */
  homeOrgId?: ID;

  /** PAX status (active, inactive, etc.). */
  status?: PaxStatus;

  /** Date of first post (EH'd / became a PAX). ISO date YYYY-MM-DD. */
  firstPostDate?: string;

  /** Date of most recent post. ISO date YYYY-MM-DD. */
  lastPostDate?: string;

  /** Total post count (denormalized for quick access). */
  postCount?: number;
}

/**
 * A PAX (F3 participant) with optional extra fields.
 *
 * @example
 * // Basic PAX
 * const pax: Pax = { id: "1", f3Name: "Chappie", orgId: "region-1", ... };
 *
 * @example
 * // PAX with Slack integration
 * type SlackPax = Pax<{ slackUserId: string }>;
 */
export type Pax<ExtraFields extends object = {}> = Extensible<PaxBase, ExtraFields>;
