import type { EntityBase, Extensible, ID, Metadatable, Taggable } from "./base";

/**
 * A flexible, database-driven classification system.
 *
 * Use this for things that should be customizable by a region without changing code:
 * - AO types
 * - Event types / tags
 * - Attendance types
 *
 * This aligns well with Nation's use of type/tag tables and 'meta' fields.
 */
export type TaxonomyKind =
  | "ao_type"
  | "event_type"
  | "event_tag"
  | "attendance_type"
  | "org_tag"
  | (string & {});

export interface TaxonomyTermBase extends EntityBase, Taggable, Metadatable {
  /** Owning org (usually a Region org). */
  orgId: ID;

  /** Category of the term, e.g. "ao_type". */
  kind: TaxonomyKind;

  /**
   * Stable programmatic identifier (unique within orgId+kind).
   * Examples: "bootcamp", "ruck", "trail-run"
   */
  key: string;

  /** Human-friendly display name. */
  name: string;

  description?: string;
  isActive?: boolean;
  sortOrder?: number;

  /** Optional UI metadata. */
  color?: string;
  icon?: string;
}

export type TaxonomyTerm<ExtraFields extends object = {}> = Extensible<TaxonomyTermBase, ExtraFields>;
