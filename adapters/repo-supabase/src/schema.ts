/**
 * Drizzle schema for Supabase (PostgreSQL).
 * Mirrors the D1/SQLite schema but uses PostgreSQL types.
 */

import {
  pgTable,
  text,
  integer,
  boolean,
  index,
  uniqueIndex,
  json,
} from "drizzle-orm/pg-core";

// =============================================================================
// Orgs (Region, AO, Area, Sector, Nation)
// =============================================================================

export const orgs = pgTable(
  "orgs",
  {
    id: text("id").primaryKey(),
    orgType: text("org_type").notNull(), // 'ao', 'region', 'area', 'sector', 'nation'
    parentId: text("parent_id"),
    slug: text("slug"),
    name: text("name").notNull(),
    shortName: text("short_name"),
    description: text("description"),
    defaultLocationId: text("default_location_id"),
    timezone: text("timezone"),
    countryCode: text("country_code"),
    state: text("state"),
    websiteUrl: text("website_url"),
    logoUrl: text("logo_url"),
    email: text("email"),
    twitter: text("twitter"),
    facebook: text("facebook"),
    instagram: text("instagram"),
    isActive: boolean("is_active").default(true),
    tags: json("tags").$type<string[]>(),
    meta: json("meta").$type<Record<string, unknown>>(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    deletedAt: text("deleted_at"),
  },
  (table) => ({
    orgTypeIdx: index("idx_orgs_org_type").on(table.orgType),
    parentIdIdx: index("idx_orgs_parent_id").on(table.parentId),
    slugIdx: index("idx_orgs_slug").on(table.slug),
  })
);

// =============================================================================
// Locations
// =============================================================================

export const locations = pgTable(
  "locations",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    address: text("address"),
    city: text("city"),
    state: text("state"),
    postalCode: text("postal_code"),
    country: text("country"),
    lat: text("lat"),
    lng: text("lng"),
    meta: json("meta").$type<Record<string, unknown>>(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    deletedAt: text("deleted_at"),
  },
  (table) => ({
    orgIdIdx: index("idx_locations_org_id").on(table.orgId),
  })
);

// =============================================================================
// Persons (base contact/person - not necessarily a PAX)
// =============================================================================

export const persons = pgTable(
  "persons",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id"),
    firstName: text("first_name"),
    lastName: text("last_name"),
    email: text("email"),
    phone: text("phone"),
    avatarUrl: text("avatar_url"),
    notes: text("notes"),
    meta: json("meta").$type<Record<string, unknown>>(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    deletedAt: text("deleted_at"),
  },
  (table) => ({
    orgIdIdx: index("idx_persons_org_id").on(table.orgId),
    emailIdx: index("idx_persons_email").on(table.email),
  })
);

// =============================================================================
// PAX (F3 participants - extends Person concept)
// =============================================================================

export const pax = pgTable(
  "pax",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(), // Primary region
    f3Name: text("f3_name").notNull(), // Required for PAX
    firstName: text("first_name"),
    lastName: text("last_name"),
    email: text("email"),
    phone: text("phone"),
    avatarUrl: text("avatar_url"),
    homeOrgId: text("home_org_id"), // Home AO
    status: text("status"), // 'active', 'inactive', 'moved', etc.
    firstPostDate: text("first_post_date"),
    lastPostDate: text("last_post_date"),
    postCount: integer("post_count").default(0),
    meta: json("meta").$type<Record<string, unknown>>(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    deletedAt: text("deleted_at"),
  },
  (table) => ({
    orgIdIdx: index("idx_pax_org_id").on(table.orgId),
    f3NameIdx: index("idx_pax_f3_name").on(table.f3Name),
    homeOrgIdIdx: index("idx_pax_home_org_id").on(table.homeOrgId),
    emailIdx: index("idx_pax_email").on(table.email),
  })
);

// =============================================================================
// Event Series (recurring schedule definitions)
// =============================================================================

export const eventSeries = pgTable(
  "event_series",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    locationId: text("location_id"),
    name: text("name").notNull(),
    description: text("description"),
    type: text("type"), // EventType enum
    dayOfWeek: text("day_of_week"), // DayOfWeek enum
    startTime: text("start_time"), // HH:MM format
    durationMinutes: integer("duration_minutes"),
    isActive: boolean("is_active").default(true),
    tags: json("tags").$type<string[]>(),
    meta: json("meta").$type<Record<string, unknown>>(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    deletedAt: text("deleted_at"),
  },
  (table) => ({
    orgIdIdx: index("idx_event_series_org_id").on(table.orgId),
    locationIdIdx: index("idx_event_series_location_id").on(table.locationId),
  })
);

// =============================================================================
// Event Instances (single occurrences)
// =============================================================================

export const eventInstances = pgTable(
  "event_instances",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    locationId: text("location_id"),
    seriesId: text("series_id"),
    name: text("name"),
    description: text("description"),
    type: text("type"), // EventType enum
    isActive: boolean("is_active").default(true),
    highlight: boolean("highlight").default(false),
    startDate: text("start_date").notNull(), // ISO date: YYYY-MM-DD
    endDate: text("end_date"),
    startTime: text("start_time"), // HH:MM format
    endTime: text("end_time"),
    paxCount: integer("pax_count").default(0),
    fngCount: integer("fng_count").default(0),
    preblast: text("preblast"),
    backblast: text("backblast"),
    preblastRich: json("preblast_rich"),
    backblastRich: json("backblast_rich"),
    preblastTs: text("preblast_ts"),
    backblastTs: text("backblast_ts"),
    qPaxIds: json("q_pax_ids").$type<string[]>(),
    coQPaxIds: json("co_q_pax_ids").$type<string[]>(),
    paxIds: json("pax_ids").$type<string[]>(),
    tags: json("tags").$type<string[]>(),
    meta: json("meta").$type<Record<string, unknown>>(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    deletedAt: text("deleted_at"),
  },
  (table) => ({
    orgIdIdx: index("idx_event_instances_org_id").on(table.orgId),
    startDateIdx: index("idx_event_instances_start_date").on(table.startDate),
    seriesIdIdx: index("idx_event_instances_series_id").on(table.seriesId),
  })
);

// =============================================================================
// Attendance (PAX at EventInstance)
// =============================================================================

export const attendance = pgTable(
  "attendance",
  {
    id: text("id").primaryKey(),
    eventInstanceId: text("event_instance_id").notNull(),
    paxId: text("pax_id").notNull(),
    role: text("role"), // AttendanceRole: 'pax' | 'q' | 'coq'
    isPlanned: boolean("is_planned").default(false),
    meta: json("meta").$type<Record<string, unknown>>(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    eventInstanceIdIdx: index("idx_attendance_event_instance_id").on(table.eventInstanceId),
    paxIdIdx: index("idx_attendance_pax_id").on(table.paxId),
    uniqueIdx: uniqueIndex("idx_attendance_unique").on(table.eventInstanceId, table.paxId),
  })
);

// =============================================================================
// Taxonomy Terms (data-driven classifications)
// =============================================================================

export const taxonomyTerms = pgTable(
  "taxonomy_terms",
  {
    id: text("id").primaryKey(),
    orgId: text("org_id").notNull(),
    kind: text("kind").notNull(), // 'ao_type', 'event_type', etc.
    key: text("key").notNull(),
    label: text("label").notNull(),
    description: text("description"),
    sortOrder: integer("sort_order").default(0),
    isActive: boolean("is_active").default(true),
    meta: json("meta").$type<Record<string, unknown>>(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    orgKindIdx: index("idx_taxonomy_terms_org_kind").on(table.orgId, table.kind),
    uniqueIdx: uniqueIndex("idx_taxonomy_terms_unique").on(table.orgId, table.kind, table.key),
  })
);

// =============================================================================
// Type exports for use in repos
// =============================================================================

export type OrgRow = typeof orgs.$inferSelect;
export type OrgInsert = typeof orgs.$inferInsert;

export type LocationRow = typeof locations.$inferSelect;
export type LocationInsert = typeof locations.$inferInsert;

export type PersonRow = typeof persons.$inferSelect;
export type PersonInsert = typeof persons.$inferInsert;

export type PaxRow = typeof pax.$inferSelect;
export type PaxInsert = typeof pax.$inferInsert;

export type EventSeriesRow = typeof eventSeries.$inferSelect;
export type EventSeriesInsert = typeof eventSeries.$inferInsert;

export type EventInstanceRow = typeof eventInstances.$inferSelect;
export type EventInstanceInsert = typeof eventInstances.$inferInsert;

export type AttendanceRow = typeof attendance.$inferSelect;
export type AttendanceInsert = typeof attendance.$inferInsert;

export type TaxonomyTermRow = typeof taxonomyTerms.$inferSelect;
export type TaxonomyTermInsert = typeof taxonomyTerms.$inferInsert;
