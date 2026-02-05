/**
 * Dependency injection types for API handlers.
 * Handlers receive these deps and don't know about specific implementations.
 */

import type { PaxRepo, EventInstanceRepo, AttendanceRepo, OrgRepo } from "f3-repo";

/**
 * All repositories needed by the API handlers.
 */
export interface ApiDeps {
  paxRepo: PaxRepo;
  eventInstanceRepo: EventInstanceRepo;
  attendanceRepo: AttendanceRepo;
  orgRepo?: OrgRepo; // Optional, not all handlers need it
}

/**
 * Subset of deps for PAX operations.
 */
export interface PaxDeps {
  paxRepo: PaxRepo;
}

/**
 * Subset of deps for Event operations.
 */
export interface EventDeps {
  eventInstanceRepo: EventInstanceRepo;
  attendanceRepo: AttendanceRepo;
}
