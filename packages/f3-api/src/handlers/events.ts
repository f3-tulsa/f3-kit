/**
 * Event API handlers.
 * These are HTTP-framework agnostic - they just take inputs and return HttpResponse.
 */

import { nowIso, newEventInstanceId, newAttendanceId } from "f3-model";
import type { EventInstance, Attendance, ID } from "f3-model";
import type { ApiResult } from "f3-contracts";
import { EventService, isSuccess } from "f3-domain";
import type { EventDeps } from "../deps";
import type { HttpResponse } from "../http";
import { httpOk, httpErr, domainErrorToHttp } from "../http";

// =============================================================================
// Response Types
// =============================================================================

export type GetEventResponse = HttpResponse<ApiResult<{ eventInstance: EventInstance }>>;
export type ListEventsResponse = HttpResponse<ApiResult<{ eventInstances: EventInstance[] }>>;
export type CreateEventResponse = HttpResponse<ApiResult<{ eventInstance: EventInstance }>>;

// =============================================================================
// Input Types
// =============================================================================

export interface CreateEventInput {
  eventInstance: Partial<EventInstance> | null | undefined;
  attendance?: Partial<Attendance>[];
}

export interface ListEventsInput {
  orgId: ID;
  fromDate?: string;
  toDate?: string;
}

// =============================================================================
// Handlers
// =============================================================================

/**
 * Get a single event instance by ID.
 */
export async function getEventById(
  deps: EventDeps,
  id: ID
): Promise<GetEventResponse> {
  if (!id) {
    return httpErr("VALIDATION_ERROR", "id is required", 400);
  }

  const service = new EventService(deps.eventInstanceRepo, deps.attendanceRepo);
  const result = await service.getById(id);

  if (!isSuccess(result)) {
    return domainErrorToHttp(result.error) as GetEventResponse;
  }

  return httpOk({ eventInstance: result.data });
}

/**
 * List event instances by organization.
 */
export async function listEventsByOrg(
  deps: EventDeps,
  input: ListEventsInput
): Promise<ListEventsResponse> {
  if (!input.orgId) {
    return httpErr("VALIDATION_ERROR", "orgId is required", 400);
  }

  const service = new EventService(deps.eventInstanceRepo, deps.attendanceRepo);
  const result = await service.listByOrg(input.orgId, {
    fromDate: input.fromDate,
    toDate: input.toDate,
  });

  if (!isSuccess(result)) {
    return domainErrorToHttp(result.error) as ListEventsResponse;
  }

  return httpOk({ eventInstances: result.data });
}

/**
 * Create an event instance with optional attendance records.
 */
export async function createEventInstance(
  deps: EventDeps,
  input: CreateEventInput
): Promise<CreateEventResponse> {
  const { eventInstance: eventInput, attendance: attendanceInput } = input;

  if (!eventInput) {
    return httpErr("VALIDATION_ERROR", "eventInstance is required in request body", 400);
  }

  // Auto-fill timestamps and ID
  const now = nowIso();
  const eventInstance: EventInstance = {
    ...eventInput,
    id: eventInput.id || newEventInstanceId(),
    orgId: eventInput.orgId!,
    startDate: eventInput.startDate!,
    createdAt: eventInput.createdAt || now,
    updatedAt: now,
  } as EventInstance;

  // Normalize attendance records
  const attendance = (attendanceInput ?? []).map((a) => ({
    ...a,
    id: a.id || newAttendanceId(),
    eventInstanceId: eventInstance.id,
    paxId: a.paxId!,
    createdAt: a.createdAt || now,
    updatedAt: now,
  })) as Attendance[];

  const service = new EventService(deps.eventInstanceRepo, deps.attendanceRepo);
  const result = await service.createEventInstance(eventInstance, attendance);

  if (!isSuccess(result)) {
    return domainErrorToHttp(result.error) as CreateEventResponse;
  }

  return httpOk({ eventInstance: result.data });
}
