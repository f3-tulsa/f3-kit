/**
 * PAX API handlers.
 * These are HTTP-framework agnostic - they just take inputs and return HttpResponse.
 */

import { nowIso, newPaxId } from "f3-model";
import type { Pax, ID } from "f3-model";
import type { ApiResult } from "f3-contracts";
import { PaxService, isSuccess } from "f3-domain";
import type { PaxDeps } from "../deps";
import type { HttpResponse, HttpStatusCode } from "../http";
import { httpOk, httpErr, domainErrorToHttp } from "../http";

// =============================================================================
// Response Types
// =============================================================================

export type GetPaxResponse = HttpResponse<ApiResult<{ pax: Pax }>>;
export type ListPaxResponse = HttpResponse<ApiResult<{ pax: Pax[] }>>;
export type UpsertPaxResponse = HttpResponse<ApiResult<{ pax: Pax }>>;

// =============================================================================
// Handlers
// =============================================================================

/**
 * Get a single PAX by ID.
 */
export async function getPaxById(
  deps: PaxDeps,
  id: ID
): Promise<GetPaxResponse> {
  if (!id) {
    return httpErr("VALIDATION_ERROR", "id is required", 400);
  }

  const service = new PaxService(deps.paxRepo);
  const result = await service.getById(id);

  if (!isSuccess(result)) {
    return domainErrorToHttp(result.error) as GetPaxResponse;
  }

  return httpOk({ pax: result.data });
}

/**
 * List PAX by organization.
 */
export async function listPaxByOrg(
  deps: PaxDeps,
  orgId: ID
): Promise<ListPaxResponse> {
  if (!orgId) {
    return httpErr("VALIDATION_ERROR", "orgId is required", 400);
  }

  const service = new PaxService(deps.paxRepo);
  const result = await service.listByOrg(orgId);

  if (!isSuccess(result)) {
    return domainErrorToHttp(result.error) as ListPaxResponse;
  }

  return httpOk({ pax: result.data });
}

/**
 * Create or update a PAX.
 */
export async function upsertPax(
  deps: PaxDeps,
  input: Partial<Pax> | null | undefined
): Promise<UpsertPaxResponse> {
  if (!input) {
    return httpErr("VALIDATION_ERROR", "pax object is required in request body", 400);
  }

  // Auto-fill timestamps and ID if not provided
  const now = nowIso();
  const pax: Pax = {
    ...input,
    id: input.id || newPaxId(),
    orgId: input.orgId!,
    f3Name: input.f3Name!,
    createdAt: input.createdAt || now,
    updatedAt: now,
  } as Pax;

  const service = new PaxService(deps.paxRepo);
  const result = await service.upsert(pax);

  if (!isSuccess(result)) {
    return domainErrorToHttp(result.error) as UpsertPaxResponse;
  }

  return httpOk({ pax: result.data });
}
