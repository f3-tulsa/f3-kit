import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { eq, and, gte, lte, asc, isNull } from "drizzle-orm";
import type { D1Database } from "@cloudflare/workers-types";
import type { AttendanceRepo, EventInstanceRepo, OrgRepo, PaxRepo } from "f3-repo";
import type {
  Attendance as AttendanceModel,
  EventInstance as EventInstanceModel,
  ID,
  Org as OrgModel,
  Pax as PaxModel,
  AttendanceRole,
} from "f3-model";

import * as schema from "./schema";
import { orgs, pax, eventInstances, attendance } from "./schema";

// Re-export schema for external use
export * from "./schema";

// =============================================================================
// Database instance creator
// =============================================================================

export function createDb(d1: D1Database): DrizzleD1Database<typeof schema> {
  return drizzle(d1, { schema });
}

export type Db = ReturnType<typeof createDb>;

// =============================================================================
// Mappers: DB Row <-> Domain Model
// =============================================================================

function now(): string {
  return new Date().toISOString();
}

function toOrgModel(row: schema.OrgRow): OrgModel {
  return {
    id: row.id,
    orgType: row.orgType as OrgModel["orgType"],
    parentId: row.parentId ?? undefined,
    slug: row.slug ?? undefined,
    name: row.name,
    shortName: row.shortName ?? undefined,
    description: row.description ?? undefined,
    defaultLocationId: row.defaultLocationId ?? undefined,
    timezone: row.timezone ?? undefined,
    countryCode: row.countryCode ?? undefined,
    state: row.state ?? undefined,
    websiteUrl: row.websiteUrl ?? undefined,
    logoUrl: row.logoUrl ?? undefined,
    email: row.email ?? undefined,
    twitter: row.twitter ?? undefined,
    facebook: row.facebook ?? undefined,
    instagram: row.instagram ?? undefined,
    isActive: row.isActive ?? true,
    tags: row.tags ?? undefined,
    meta: row.meta ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? undefined,
  };
}

function toOrgInsert(org: OrgModel): schema.OrgInsert {
  return {
    id: org.id,
    orgType: org.orgType,
    parentId: org.parentId ?? null,
    slug: org.slug ?? null,
    name: org.name,
    shortName: org.shortName ?? null,
    description: org.description ?? null,
    defaultLocationId: org.defaultLocationId ?? null,
    timezone: org.timezone ?? null,
    countryCode: org.countryCode ?? null,
    state: org.state ?? null,
    websiteUrl: org.websiteUrl ?? null,
    logoUrl: org.logoUrl ?? null,
    email: org.email ?? null,
    twitter: org.twitter ?? null,
    facebook: org.facebook ?? null,
    instagram: org.instagram ?? null,
    isActive: org.isActive ?? true,
    tags: org.tags ?? null,
    meta: org.meta ?? null,
    createdAt: org.createdAt ?? now(),
    updatedAt: org.updatedAt ?? now(),
    deletedAt: org.deletedAt ?? null,
  };
}

function toPaxModel(row: schema.PaxRow): PaxModel {
  return {
    id: row.id,
    orgId: row.orgId,
    f3Name: row.f3Name,
    firstName: row.firstName ?? undefined,
    lastName: row.lastName ?? undefined,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    avatarUrl: row.avatarUrl ?? undefined,
    homeOrgId: row.homeOrgId ?? undefined,
    status: row.status as PaxModel["status"],
    firstPostDate: row.firstPostDate ?? undefined,
    lastPostDate: row.lastPostDate ?? undefined,
    postCount: row.postCount ?? undefined,
    meta: row.meta ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? undefined,
  };
}

function toPaxInsert(p: PaxModel): schema.PaxInsert {
  return {
    id: p.id,
    orgId: p.orgId,
    f3Name: p.f3Name,
    firstName: p.firstName ?? null,
    lastName: p.lastName ?? null,
    email: p.email ?? null,
    phone: p.phone ?? null,
    avatarUrl: p.avatarUrl ?? null,
    homeOrgId: p.homeOrgId ?? null,
    status: p.status ?? null,
    firstPostDate: p.firstPostDate ?? null,
    lastPostDate: p.lastPostDate ?? null,
    postCount: p.postCount ?? 0,
    meta: p.meta ?? null,
    createdAt: p.createdAt ?? now(),
    updatedAt: p.updatedAt ?? now(),
    deletedAt: p.deletedAt ?? null,
  };
}

function toEventInstanceModel(row: schema.EventInstanceRow): EventInstanceModel {
  return {
    id: row.id,
    orgId: row.orgId,
    locationId: row.locationId ?? undefined,
    seriesId: row.seriesId ?? undefined,
    name: row.name ?? undefined,
    description: row.description ?? undefined,
    type: row.type as EventInstanceModel["type"],
    isActive: row.isActive ?? true,
    highlight: row.highlight ?? false,
    startDate: row.startDate,
    endDate: row.endDate ?? undefined,
    startTime: row.startTime ?? undefined,
    endTime: row.endTime ?? undefined,
    paxCount: row.paxCount ?? undefined,
    fngCount: row.fngCount ?? undefined,
    preblast: row.preblast ?? undefined,
    backblast: row.backblast ?? undefined,
    preblastRich: row.preblastRich ?? undefined,
    backblastRich: row.backblastRich ?? undefined,
    preblastTs: row.preblastTs ?? undefined,
    backblastTs: row.backblastTs ?? undefined,
    qPaxIds: row.qPaxIds ?? undefined,
    coQPaxIds: row.coQPaxIds ?? undefined,
    paxIds: row.paxIds ?? undefined,
    tags: row.tags ?? undefined,
    meta: row.meta ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? undefined,
  };
}

function toEventInstanceInsert(e: EventInstanceModel): schema.EventInstanceInsert {
  return {
    id: e.id,
    orgId: e.orgId,
    locationId: e.locationId ?? null,
    seriesId: e.seriesId ?? null,
    name: e.name ?? null,
    description: e.description ?? null,
    type: e.type ?? null,
    isActive: e.isActive ?? true,
    highlight: e.highlight ?? false,
    startDate: e.startDate,
    endDate: e.endDate ?? null,
    startTime: e.startTime ?? null,
    endTime: e.endTime ?? null,
    paxCount: e.paxCount ?? 0,
    fngCount: e.fngCount ?? 0,
    preblast: e.preblast ?? null,
    backblast: e.backblast ?? null,
    preblastRich: e.preblastRich ?? null,
    backblastRich: e.backblastRich ?? null,
    preblastTs: e.preblastTs ?? null,
    backblastTs: e.backblastTs ?? null,
    qPaxIds: e.qPaxIds ?? null,
    coQPaxIds: e.coQPaxIds ?? null,
    paxIds: e.paxIds ?? null,
    tags: e.tags ?? null,
    meta: e.meta ?? null,
    createdAt: e.createdAt ?? now(),
    updatedAt: e.updatedAt ?? now(),
    deletedAt: e.deletedAt ?? null,
  };
}

function toAttendanceModel(row: schema.AttendanceRow): AttendanceModel {
  return {
    id: row.id,
    eventInstanceId: row.eventInstanceId,
    paxId: row.paxId,
    role: row.role as AttendanceRole | undefined,
    isPlanned: row.isPlanned ?? false,
    meta: row.meta ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function toAttendanceInsert(a: AttendanceModel): schema.AttendanceInsert {
  return {
    id: a.id,
    eventInstanceId: a.eventInstanceId,
    paxId: a.paxId,
    role: a.role ?? null,
    isPlanned: a.isPlanned ?? false,
    meta: a.meta ?? null,
    createdAt: a.createdAt ?? now(),
    updatedAt: a.updatedAt ?? now(),
  };
}

// =============================================================================
// Repository Implementations
// =============================================================================

export class D1PaxRepo implements PaxRepo {
  private readonly db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async getById(id: ID): Promise<PaxModel | null> {
    const row = await this.db.select().from(pax).where(eq(pax.id, id)).get();
    return row ? toPaxModel(row) : null;
  }

  async listByOrg(orgId: ID): Promise<PaxModel[]> {
    const rows = await this.db.select().from(pax).where(eq(pax.orgId, orgId)).all();
    return rows.map(toPaxModel);
  }

  async upsert(p: PaxModel): Promise<void> {
    const insert = toPaxInsert(p);
    insert.updatedAt = now();
    await this.db
      .insert(pax)
      .values(insert)
      .onConflictDoUpdate({
        target: pax.id,
        set: { ...insert, createdAt: undefined }, // Don't update createdAt
      })
      .run();
  }
}

export class D1OrgRepo implements OrgRepo {
  private readonly db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async getById(id: ID): Promise<OrgModel | null> {
    const row = await this.db.select().from(orgs).where(eq(orgs.id, id)).get();
    return row ? toOrgModel(row) : null;
  }

  async getBySlug(slug: string): Promise<OrgModel | null> {
    const row = await this.db.select().from(orgs).where(eq(orgs.slug, slug)).get();
    return row ? toOrgModel(row) : null;
  }

  async listByType(
    orgType: OrgModel["orgType"],
    opts?: { parentId?: ID | null }
  ): Promise<OrgModel[]> {
    if (opts?.parentId !== undefined) {
      const parentIdVal = opts.parentId;
      // Handle null case explicitly
      const parentCondition = parentIdVal === null
        ? isNull(orgs.parentId)
        : eq(orgs.parentId, parentIdVal);
      const rows = await this.db
        .select()
        .from(orgs)
        .where(and(eq(orgs.orgType, orgType), parentCondition))
        .all();
      return rows.map(toOrgModel);
    }
    const rows = await this.db.select().from(orgs).where(eq(orgs.orgType, orgType)).all();
    return rows.map(toOrgModel);
  }

  async upsert(org: OrgModel): Promise<void> {
    const insert = toOrgInsert(org);
    insert.updatedAt = now();
    await this.db
      .insert(orgs)
      .values(insert)
      .onConflictDoUpdate({
        target: orgs.id,
        set: { ...insert, createdAt: undefined },
      })
      .run();
  }
}

export class D1EventInstanceRepo implements EventInstanceRepo {
  private readonly db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async getById(id: ID): Promise<EventInstanceModel | null> {
    const row = await this.db.select().from(eventInstances).where(eq(eventInstances.id, id)).get();
    return row ? toEventInstanceModel(row) : null;
  }

  async listByOrg(
    orgId: ID,
    opts?: { fromDate?: string; toDate?: string }
  ): Promise<EventInstanceModel[]> {
    const fromDate = opts?.fromDate ?? "0000-01-01";
    const toDate = opts?.toDate ?? "9999-12-31";
    const rows = await this.db
      .select()
      .from(eventInstances)
      .where(
        and(
          eq(eventInstances.orgId, orgId),
          gte(eventInstances.startDate, fromDate),
          lte(eventInstances.startDate, toDate)
        )
      )
      .orderBy(asc(eventInstances.startDate))
      .all();
    return rows.map(toEventInstanceModel);
  }

  async create(instance: EventInstanceModel): Promise<void> {
    const insert = toEventInstanceInsert(instance);
    await this.db
      .insert(eventInstances)
      .values(insert)
      .onConflictDoUpdate({
        target: eventInstances.id,
        set: { ...insert, createdAt: undefined },
      })
      .run();
  }
}

export class D1AttendanceRepo implements AttendanceRepo {
  private readonly db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async listByEventInstance(eventInstanceId: ID): Promise<AttendanceModel[]> {
    const rows = await this.db
      .select()
      .from(attendance)
      .where(eq(attendance.eventInstanceId, eventInstanceId))
      .all();
    return rows.map(toAttendanceModel);
  }

  async addMany(rows: AttendanceModel[]): Promise<void> {
    if (rows.length === 0) return;

    const inserts = rows.map(toAttendanceInsert);
    // D1/SQLite doesn't support batch upsert well, so we do individual inserts
    for (const insert of inserts) {
      await this.db
        .insert(attendance)
        .values(insert)
        .onConflictDoUpdate({
          target: attendance.id,
          set: { ...insert, createdAt: undefined },
        })
        .run();
    }
  }
}
