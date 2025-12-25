// ============================================================
// DEDICATED SERVICE ISOLÉ : InterventionsTab
// ============================================================

import { ovhApi } from "../../../../../services/api";
import type { DedicatedServerIntervention } from "../../dedicated.types";

class InterventionsService {
  async listInterventions(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/dedicated/server/${serviceName}/intervention`);
  }

  async getIntervention(serviceName: string, interventionId: number): Promise<DedicatedServerIntervention> {
    return ovhApi.get<DedicatedServerIntervention>(`/dedicated/server/${serviceName}/intervention/${interventionId}`);
  }
}

export const interventionsService = new InterventionsService();
