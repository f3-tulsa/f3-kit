import type { Org } from "./org";

/**
 * Alias of Org where orgType="region".
 * Org is the primary type (Nation-compatible).
 */
export type Region<ExtraFields extends object = {}> = Org<ExtraFields> & { orgType: "region" };
