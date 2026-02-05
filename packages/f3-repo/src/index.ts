import type {
  Attendance,
  EventInstance,
  EventSeries,
  ID,
  Location,
  Org,
  Pax,
  TaxonomyTerm,
} from "f3-model";

/**
 * Repository (port) interfaces. Platform-specific adapters implement these.
 * Keep these interfaces small and stable to support portability.
 */

export interface OrgRepo {
  getById(id: ID): Promise<Org | null>;
  getBySlug(slug: string): Promise<Org | null>;
  listByType(orgType: Org["orgType"], opts?: { parentId?: ID | null }): Promise<Org[]>;
  upsert(org: Org): Promise<void>;
}

export interface LocationRepo {
  getById(id: ID): Promise<Location | null>;
  listByOrg(orgId: ID): Promise<Location[]>;
  upsert(location: Location): Promise<void>;
}


export interface TaxonomyRepo {
  list(orgId: ID, kind: string, opts?: { isActive?: boolean }): Promise<TaxonomyTerm[]>;
  getByKey(orgId: ID, kind: string, key: string): Promise<TaxonomyTerm | null>;
  upsert(term: TaxonomyTerm): Promise<void>;
}

export interface PaxRepo {
  getById(id: ID): Promise<Pax | null>;
  listByOrg(orgId: ID): Promise<Pax[]>;
  upsert(pax: Pax): Promise<void>;
}

export interface EventSeriesRepo {
  getById(id: ID): Promise<EventSeries | null>;
  listByOrg(orgId: ID, opts?: { isActive?: boolean }): Promise<EventSeries[]>;
  upsert(series: EventSeries): Promise<void>;
}

export interface EventInstanceRepo {
  getById(id: ID): Promise<EventInstance | null>;
  listByOrg(orgId: ID, opts?: { fromDate?: string; toDate?: string }): Promise<EventInstance[]>;
  create(instance: EventInstance): Promise<void>;
}

export interface AttendanceRepo {
  listByEventInstance(eventInstanceId: ID): Promise<Attendance[]>;
  addMany(rows: Attendance[]): Promise<void>;
}
