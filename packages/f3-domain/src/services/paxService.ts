import type { ID, Pax } from "f3-model";
import type { PaxRepo } from "f3-repo";
import type { Result } from "../result";
import { success, Errors } from "../result";

export class PaxService {
  private readonly paxRepo: PaxRepo;

  constructor(paxRepo: PaxRepo) {
    this.paxRepo = paxRepo;
  }

  async getById(id: ID): Promise<Result<Pax>> {
    const pax = await this.paxRepo.getById(id);
    if (!pax) {
      return Errors.paxNotFound(id);
    }
    return success(pax);
  }

  async listByOrg(orgId: ID): Promise<Result<Pax[]>> {
    if (!orgId) {
      return Errors.missingField("orgId");
    }
    const paxList = await this.paxRepo.listByOrg(orgId);
    return success(paxList);
  }

  async upsert(pax: Pax): Promise<Result<Pax>> {
    // Validate required fields
    if (!pax.id) {
      return Errors.missingField("id");
    }
    if (!pax.orgId) {
      return Errors.missingField("orgId");
    }
    if (!pax.f3Name) {
      return Errors.missingField("f3Name");
    }

    await this.paxRepo.upsert(pax);
    return success(pax);
  }
}
