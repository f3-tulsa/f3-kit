import type { EntityBase, Extensible, GeoPoint, ID, Taggable, Metadatable } from "./base";

/**
 * Nation-compatible Location entity.
 * Prefer referencing by locationId (or Org.defaultLocationId) instead of duplicating geo/address fields everywhere.
 */
export interface LocationBase extends EntityBase, Taggable, Metadatable {
  orgId: ID;

  name: string;
  description?: string;

  isActive?: boolean;

  geo?: GeoPoint;

  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressZip?: string;
  addressCountry?: string;
}

export type Location<ExtraFields extends object = {}> = Extensible<LocationBase, ExtraFields>;
