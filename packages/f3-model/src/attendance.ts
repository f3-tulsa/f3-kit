import type { EntityBase, Extensible, ID, Metadatable } from "./base";
import type { AttendanceRole } from "./enums";

export interface AttendanceBase extends EntityBase, Metadatable {
  eventInstanceId: ID;
  paxId: ID;
  role?: AttendanceRole;
  isPlanned?: boolean;
}

export type Attendance<ExtraFields extends object = {}> = Extensible<AttendanceBase, ExtraFields>;
