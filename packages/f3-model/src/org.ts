import type { EntityBase, Extensible, ID, Taggable, Metadatable, Relatable } from "./base";
import type { OrgType } from "./enums";

/**
 * Nation-compatible primary organizational unit.
 * - AO / Region / Area / Sector / Nation are all Orgs distinguished by orgType.
 *
 * F3 Org Hierarchy (typical):
 * - Nation (top level)
 *   └── Area (geographic grouping)
 *       └── Region (e.g., "F3 Tulsa")
 *           └── AO (e.g., "Centennial", "Titan")
 *
 * Relationships:
 * - parentId: Direct reference to parent org (required for fast traversal)
 * - relationships[]: Additional relationships (sponsors, sister regions, etc.)
 */
export interface OrgBase extends EntityBase, Taggable, Metadatable, Relatable {
  orgType: OrgType;

  /** Parent org ID. Use for the primary hierarchy (Region → AO, Area → Region, etc.). */
  parentId?: ID | null;

  /** Primary display name (e.g. "F3 Tulsa", "ao-centennial"). */
  name: string;

  /** Optional short label (e.g. "Tulsa", "Centennial"). */
  shortName?: string;

  /** Optional slug for URLs. */
  slug?: string;

  description?: string;

  /** Nation has default_location_id on Org. */
  defaultLocationId?: ID | null;

  /** Common profile fields (optional). */
  timezone?: string;     // e.g. "America/Chicago"
  countryCode?: string;  // e.g. "US"
  state?: string;        // e.g. "OK"
  websiteUrl?: string;
  logoUrl?: string;
  email?: string;

  /** Social links (optional). */
  twitter?: string;
  facebook?: string;
  instagram?: string;

  isActive?: boolean;
}

export type Org<ExtraFields extends object = {}> = Extensible<OrgBase, ExtraFields>;
