/**
 * API Contracts - Request/Response DTOs and API result types.
 * This package defines the shapes of API requests and responses.
 * It does NOT contain HTTP-specific logic (that's in f3-api).
 */

import type { Attendance, EventInstance, Pax } from "f3-model";

// =============================================================================
// API Result Types
// =============================================================================

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = { ok: false; error: { code: ApiErrorCode; message: string; details?: unknown } };
export type ApiResult<T> = ApiOk<T> | ApiErr;

// =============================================================================
// Result Builders
// =============================================================================

export const ok = <T>(data: T): ApiOk<T> => ({ ok: true, data });

export const err = (code: ApiErrorCode, message: string, details?: unknown): ApiErr => ({
  ok: false,
  error: { code, message, details },
});

// =============================================================================
// PAX DTOs
// =============================================================================

export interface UpsertPaxRequest {
  pax: Pax<any>;
}

export type UpsertPaxResponse = ApiResult<{ pax: Pax<any> }>;

export type GetPaxResponse = ApiResult<{ pax: Pax<any> }>;

export type ListPaxResponse = ApiResult<{ pax: Pax<any>[] }>;

// =============================================================================
// Event Instance DTOs
// =============================================================================

export interface CreateEventInstanceRequest {
  eventInstance: EventInstance<any>;
  attendance?: Attendance<any>[];
}

export type CreateEventInstanceResponse = ApiResult<{ eventInstance: EventInstance<any> }>;

export type GetEventInstanceResponse = ApiResult<{ eventInstance: EventInstance<any> }>;

export type ListEventInstancesResponse = ApiResult<{ eventInstances: EventInstance<any>[] }>;
