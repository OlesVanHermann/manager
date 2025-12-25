// ============================================================
// NASHA - Service NIVEAU PAGE (pas niveau tab)
// Utilisé uniquement par index.tsx pour charger les données
// ============================================================

import { ovhApi } from "../../../services/api";
import type { NashaInfo } from "./nasha.types";

class NashaPageService {
  async getNasha(serviceName: string): Promise<NashaInfo> {
    return ovhApi.get<NashaInfo>(`/dedicated/nasha/${serviceName}`);
  }
}

export const nashaPageService = new NashaPageService();
