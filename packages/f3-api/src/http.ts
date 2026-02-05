/**
 * Generic HTTP types and error mapping.
 * This is HTTP-framework agnostic (works with Hono, Express, Lambda, etc.)
 */

import type { DomainError, DomainErrorCode } from "f3-domain";
import type { ApiErrorCode, ApiErr, ApiResult } from "f3-contracts";
import { err, ok } from "f3-contracts";

// =============================================================================
// HTTP Status Codes
// =============================================================================

export type HttpStatusCode =
  | 200 | 201 | 204
  | 400 | 401 | 403 | 404 | 409 | 422
  | 500;

export interface HttpResponse<T> {
  body: T;
  status: HttpStatusCode;
}

// =============================================================================
// Domain Error → HTTP Mapping
// =============================================================================

interface HttpErrorMapping {
  status: HttpStatusCode;
  code: ApiErrorCode;
}

/**
 * Maps domain error codes to HTTP status codes and API error codes.
 * This mapping is platform-agnostic - applies to any HTTP API.
 */
const DOMAIN_TO_HTTP: Record<DomainErrorCode, HttpErrorMapping> = {
  // Validation errors → 400 Bad Request
  MISSING_REQUIRED_FIELD: { status: 400, code: "VALIDATION_ERROR" },
  INVALID_FIELD_VALUE: { status: 400, code: "VALIDATION_ERROR" },
  VALIDATION_FAILED: { status: 400, code: "VALIDATION_ERROR" },

  // Not found → 404 Not Found
  PAX_NOT_FOUND: { status: 404, code: "NOT_FOUND" },
  ORG_NOT_FOUND: { status: 404, code: "NOT_FOUND" },
  EVENT_NOT_FOUND: { status: 404, code: "NOT_FOUND" },
  LOCATION_NOT_FOUND: { status: 404, code: "NOT_FOUND" },
  RESOURCE_NOT_FOUND: { status: 404, code: "NOT_FOUND" },

  // Conflict → 409 Conflict
  DUPLICATE_ENTRY: { status: 409, code: "CONFLICT" },
  ALREADY_EXISTS: { status: 409, code: "CONFLICT" },

  // Business rule violation → 422 Unprocessable Entity
  BUSINESS_RULE_VIOLATION: { status: 422, code: "VALIDATION_ERROR" },

  // Auth errors
  NOT_AUTHORIZED: { status: 401, code: "UNAUTHORIZED" },
  FORBIDDEN_ACTION: { status: 403, code: "FORBIDDEN" },
};

/**
 * Map a domain error to HTTP status and API error code.
 */
export function mapDomainError(error: DomainError): HttpErrorMapping {
  return DOMAIN_TO_HTTP[error.code] ?? { status: 500, code: "INTERNAL_ERROR" };
}

/**
 * Convert a domain error to an HTTP response.
 */
export function domainErrorToHttp(error: DomainError): HttpResponse<ApiErr> {
  const { status, code } = mapDomainError(error);
  return {
    body: err(code, error.message, error.details),
    status,
  };
}

/**
 * Create a success HTTP response.
 */
export function httpOk<T>(data: T, status: HttpStatusCode = 200): HttpResponse<ApiResult<T>> {
  return { body: ok(data), status };
}

/**
 * Create an error HTTP response.
 */
export function httpErr(
  code: ApiErrorCode,
  message: string,
  status: HttpStatusCode = 400
): HttpResponse<ApiErr> {
  return { body: err(code, message), status };
}
