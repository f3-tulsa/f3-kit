-- 0001_init.sql
-- Drizzle-compatible schema matching f3-model types

-- Orgs (Region, AO, Area, Sector, Nation)
CREATE TABLE IF NOT EXISTS orgs (
  id TEXT PRIMARY KEY,
  org_type TEXT NOT NULL,
  parent_id TEXT,
  slug TEXT,
  name TEXT NOT NULL,
  short_name TEXT,
  description TEXT,
  default_location_id TEXT,
  timezone TEXT,
  country_code TEXT,
  state TEXT,
  website_url TEXT,
  logo_url TEXT,
  email TEXT,
  twitter TEXT,
  facebook TEXT,
  instagram TEXT,
  is_active INTEGER DEFAULT 1,
  tags TEXT,
  meta TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_orgs_org_type ON orgs(org_type);
CREATE INDEX IF NOT EXISTS idx_orgs_parent_id ON orgs(parent_id);
CREATE INDEX IF NOT EXISTS idx_orgs_slug ON orgs(slug);

-- Locations
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  lat TEXT,
  lng TEXT,
  meta TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_locations_org_id ON locations(org_id);

-- Persons (base contact/person - not necessarily a PAX)
CREATE TABLE IF NOT EXISTS persons (
  id TEXT PRIMARY KEY,
  org_id TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  notes TEXT,
  meta TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_persons_org_id ON persons(org_id);
CREATE INDEX IF NOT EXISTS idx_persons_email ON persons(email);

-- PAX (F3 participants)
CREATE TABLE IF NOT EXISTS pax (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  f3_name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  home_org_id TEXT,
  status TEXT,
  first_post_date TEXT,
  last_post_date TEXT,
  post_count INTEGER DEFAULT 0,
  meta TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_pax_org_id ON pax(org_id);
CREATE INDEX IF NOT EXISTS idx_pax_f3_name ON pax(f3_name);
CREATE INDEX IF NOT EXISTS idx_pax_home_org_id ON pax(home_org_id);
CREATE INDEX IF NOT EXISTS idx_pax_email ON pax(email);

-- Event Series (recurring schedule definitions)
CREATE TABLE IF NOT EXISTS event_series (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  location_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  day_of_week TEXT,
  start_time TEXT,
  duration_minutes INTEGER,
  is_active INTEGER DEFAULT 1,
  tags TEXT,
  meta TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_event_series_org_id ON event_series(org_id);
CREATE INDEX IF NOT EXISTS idx_event_series_location_id ON event_series(location_id);

-- Event Instances (single occurrences)
CREATE TABLE IF NOT EXISTS event_instances (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  location_id TEXT,
  series_id TEXT,
  name TEXT,
  description TEXT,
  type TEXT,
  is_active INTEGER DEFAULT 1,
  highlight INTEGER DEFAULT 0,
  start_date TEXT NOT NULL,
  end_date TEXT,
  start_time TEXT,
  end_time TEXT,
  pax_count INTEGER DEFAULT 0,
  fng_count INTEGER DEFAULT 0,
  preblast TEXT,
  backblast TEXT,
  preblast_rich TEXT,
  backblast_rich TEXT,
  preblast_ts TEXT,
  backblast_ts TEXT,
  q_pax_ids TEXT,
  co_q_pax_ids TEXT,
  pax_ids TEXT,
  tags TEXT,
  meta TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_event_instances_org_id ON event_instances(org_id);
CREATE INDEX IF NOT EXISTS idx_event_instances_start_date ON event_instances(start_date);
CREATE INDEX IF NOT EXISTS idx_event_instances_series_id ON event_instances(series_id);

-- Attendance (PAX at EventInstance)
CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY,
  event_instance_id TEXT NOT NULL,
  pax_id TEXT NOT NULL,
  role TEXT,
  is_planned INTEGER DEFAULT 0,
  meta TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_attendance_event_instance_id ON attendance(event_instance_id);
CREATE INDEX IF NOT EXISTS idx_attendance_pax_id ON attendance(pax_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_unique ON attendance(event_instance_id, pax_id);

-- Taxonomy Terms (data-driven classifications)
CREATE TABLE IF NOT EXISTS taxonomy_terms (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  meta TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_taxonomy_terms_org_kind ON taxonomy_terms(org_id, kind);
CREATE UNIQUE INDEX IF NOT EXISTS idx_taxonomy_terms_unique ON taxonomy_terms(org_id, kind, key);
