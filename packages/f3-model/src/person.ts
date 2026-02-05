import type { EntityBase, Extensible, ID, Relatable, Metadatable } from "./base";

/**
 * Base interface for a Person.
 * This represents any individual - could be a PAX, a contact, a family member, etc.
 * Does NOT include F3-specific fields like f3Name.
 *
 * Use Cases:
 * - Base for Pax (F3 participants)
 * - Contacts for a Region (potential sponsors, venue contacts, etc.)
 * - Family members of PAX (for family events, emergency contacts)
 *
 * Relationships (via relationships[]):
 * - "m": Spouse/partner
 * - "member": Member of an Org
 * - Custom roles as needed
 *
 * @example
 * // A contact person for a venue
 * const contact: Person = {
 *   id: "person-123",
 *   firstName: "John",
 *   lastName: "Smith",
 *   email: "john@venue.com",
 *   relationships: [
 *     { targetType: "org", targetId: "region-tulsa", role: "venue_contact" },
 *   ],
 *   // ...
 * };
 */
export interface PersonBase extends EntityBase, Relatable, Metadatable {
  /** Optional primary organization association. */
  orgId?: ID;

  // Identity
  firstName?: string;
  lastName?: string;

  // Contact info
  email?: string;
  phone?: string;

  /** Profile image URL. */
  avatarUrl?: string;

  /** Notes or bio. */
  notes?: string;
}

/**
 * A Person with optional extra fields.
 * Use for contacts, family members, or anyone not yet a PAX.
 */
export type Person<ExtraFields extends object = {}> = Extensible<PersonBase, ExtraFields>;
