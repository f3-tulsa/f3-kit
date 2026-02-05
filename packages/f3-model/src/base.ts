export type ID = string;
export type ISODateTime = string;

// =============================================================================
// Core Entity Base
// =============================================================================

export interface EntityBase {
  id: ID;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  deletedAt?: ISODateTime | null;
}

// =============================================================================
// Mixins
// =============================================================================

/** Mixin for entities that support free-form tags. */
export interface Taggable {
  tags?: string[];
}

/** Mixin for entities that support arbitrary metadata. */
export interface Metadatable {
  /** Arbitrary metadata for portability / integrations. */
  meta?: Record<string, unknown>;
}

/** Geographic coordinates. */
export interface GeoPoint {
  lat: number;
  lng: number;
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Extensible helper:
 * Pax<{ slackUserId: string }> adds fields without forking the base model.
 */
export type Extensible<BaseFields, ExtraFields extends object = {}> = BaseFields & ExtraFields;

// =============================================================================
// Re-exports from relationship.ts (for backward compatibility)
// =============================================================================

export {
  type Relationship,
  type Relatable,
  type RelationshipTargetType,
  type RelationshipRole,
  type RelationshipType,
} from "./relationship";

// Legacy aliases for backward compatibility
export type TagsField = Taggable;
export type MetaField = Metadatable;
export type { Relatable as RelatedField } from "./relationship";
