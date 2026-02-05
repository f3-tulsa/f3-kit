import type { ID, Attendance, EventInstance } from "f3-model";
import type { AttendanceRepo, EventInstanceRepo } from "f3-repo";
import type { Result } from "../result";
import { success, Errors } from "../result";

/**
 * Platform-neutral domain service for event instances and attendance.
 * Your Cloudflare/Node/etc app wires concrete repo implementations into this service.
 */
export class EventService {
  private readonly events: EventInstanceRepo;
  private readonly attendanceRepo: AttendanceRepo;

  constructor(events: EventInstanceRepo, attendanceRepo: AttendanceRepo) {
    this.events = events;
    this.attendanceRepo = attendanceRepo;
  }

  async getById(id: ID): Promise<Result<EventInstance>> {
    const event = await this.events.getById(id);
    if (!event) {
      return Errors.eventNotFound(id);
    }
    return success(event);
  }

  async listByOrg(
    orgId: ID,
    opts?: { fromDate?: string; toDate?: string }
  ): Promise<Result<EventInstance[]>> {
    if (!orgId) {
      return Errors.missingField("orgId");
    }
    const events = await this.events.listByOrg(orgId, opts);
    return success(events);
  }

  async createEventInstance(
    instance: EventInstance,
    attendanceRows?: Attendance[]
  ): Promise<Result<EventInstance>> {
    // Validate required fields
    if (!instance.id) {
      return Errors.missingField("id");
    }
    if (!instance.orgId) {
      return Errors.missingField("orgId");
    }
    if (!instance.startDate) {
      return Errors.missingField("startDate");
    }

    // Create the event instance
    await this.events.create(instance);

    // Create attendance records if provided
    if (attendanceRows?.length) {
      const rows = attendanceRows.map((r) => ({
        ...r,
        eventInstanceId: instance.id,
      }));
      await this.attendanceRepo.addMany(rows);
    }

    return success(instance);
  }

  async getAttendance(eventInstanceId: ID): Promise<Result<Attendance[]>> {
    if (!eventInstanceId) {
      return Errors.missingField("eventInstanceId");
    }
    const attendance = await this.attendanceRepo.listByEventInstance(eventInstanceId);
    return success(attendance);
  }
}
