export * from "./eventInstance";

/**
 * Back-compat alias: Event maps to EventInstance.
 * Prefer importing EventInstance for Nation portability.
 */
export type Event<ExtraFields extends object = {}> = import("./eventInstance").EventInstance<ExtraFields>;
