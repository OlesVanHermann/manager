// ============================================================
// HOUSING - Service NIVEAU PAGE (pas niveau tab)
// Utilisé uniquement par index.tsx pour charger les données
// ============================================================

import { ovhApi } from "../../../services/api";
import type { HousingInfo } from "./housing.types";

class HousingPageService {
  async getHousing(id: string): Promise<HousingInfo> {
    return ovhApi.get<HousingInfo>(`/dedicated/housing/${id}`);
  }
}

export const housingPageService = new HousingPageService();
