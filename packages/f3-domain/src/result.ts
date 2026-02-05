/**
 * Domain-level error codes.
 * These are business/domain errors, NOT HTTP status codes.
 * The app layer maps these to appropriate HTTP responses.
 */
export type DomainErrorCode =
  // Validation errors
  | "MISSING_REQUIRED_FIELD"
  | "INVALID_FIELD_VALUE"
  | "VALIDATION_FAILED"
  // Not found
  | "PAX_NOT_FOUND"
  | "ORG_NOT_FOUND"
  | "EVENT_NOT_FOUND"
  | "LOCATION_NOT_FOUND"
  | "RESOURCE_NOT_FOUND"
  // Conflict / business rule violations
  | "DUPLICATE_ENTRY"
  | "ALREADY_EXISTS"
  | "BUSINESS_RULE_VIOLATION"
  // Auth (domain-level, not HTTP-level)
  | "NOT_AUTHORIZED"
  | "FORBIDDEN_ACTION";

/**
 * Domain error with code, message, and optional details.
 */
export interface DomainError {
  code: DomainErrorCode;
  message: string;
  field?: string; // For validation errors, which field failed
  details?: unknown;
}

/**
 * Result type for domain operations.
 * Either success with data, or failure with a domain error.
 */
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: DomainError };

/**
 * Create a successful result.
 */
export function success<T>(data: T): Result<T> {
  return { success: true, data };
}

/**
 * Create a failed result.
 */
export function failure<T = never>(
  code: DomainErrorCode,
  message: string,
  opts?: { field?: string; details?: unknown }
): Result<T> {
  return {
    success: false,
    error: {
      code,
      message,
      field: opts?.field,
      details: opts?.details,
    },
  };
}

/**
 * Helper to create common validation errors.
 */
export const Errors = {
  missingField: (field: string) =>
    failure("MISSING_REQUIRED_FIELD", `${field} is required`, { field }),

  invalidField: (field: string, reason: string) =>
    failure("INVALID_FIELD_VALUE", `${field}: ${reason}`, { field }),

  notFound: (resource: string, id?: string) =>
    failure(
      "RESOURCE_NOT_FOUND",
      id ? `${resource} not found: ${id}` : `${resource} not found`
    ),

  paxNotFound: (id: string) =>
    failure("PAX_NOT_FOUND", `PAX not found: ${id}`),

  orgNotFound: (id: string) =>
    failure("ORG_NOT_FOUND", `Org not found: ${id}`),

  eventNotFound: (id: string) =>
    failure("EVENT_NOT_FOUND", `Event not found: ${id}`),

  alreadyExists: (resource: string, identifier?: string) =>
    failure(
      "ALREADY_EXISTS",
      identifier
        ? `${resource} already exists: ${identifier}`
        : `${resource} already exists`
    ),

  businessRule: (message: string) =>
    failure("BUSINESS_RULE_VIOLATION", message),
};

/**
 * Type guard to check if result is successful.
 */
export function isSuccess<T>(result: Result<T>): result is { success: true; data: T } {
  return result.success === true;
}

/**
 * Type guard to check if result is a failure.
 */
export function isFailure<T>(result: Result<T>): result is { success: false; error: DomainError } {
  return result.success === false;
}

/**
 * Unwrap a result, throwing if it's a failure.
 * Use sparingly - prefer pattern matching on the result.
 */
export function unwrap<T>(result: Result<T>): T {
  if (result.success) {
    return result.data;
  }
  throw new Error(`Domain error: ${result.error.code} - ${result.error.message}`);
}
