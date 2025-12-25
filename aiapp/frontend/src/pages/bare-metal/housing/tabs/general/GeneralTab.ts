// ############################################################
// #  HOUSING/GENERAL - SERVICE STRICTEMENT ISOLÉ             #
// #  AUCUN IMPORT DEPUIS UN AUTRE TAB                        #
// #  AUCUN IMPORT DEPUIS LE NIVEAU PAGE                      #
// ############################################################

import { ovhApi } from "../../../../../services/api";
import type { HousingInfo } from "../../housing.types";

// ============================================================
// Service LOCAL - Usage INTERNE au tab general uniquement
// NE JAMAIS exporter vers un autre tab ou vers index.tsx
// ============================================================

class GeneralService {
  // Récupère les informations du housing
  async getHousing(id: string): Promise<HousingInfo> {
    return ovhApi.get<HousingInfo>(`/dedicated/housing/${id}`);
  }
}

// Export UNIQUEMENT pour usage dans GeneralTab.tsx
export const generalService = new GeneralService();
