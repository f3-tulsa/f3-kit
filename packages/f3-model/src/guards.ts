import type { ISODateTime } from "./base";

export function isIsoDateTime(value: unknown): value is ISODateTime {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
