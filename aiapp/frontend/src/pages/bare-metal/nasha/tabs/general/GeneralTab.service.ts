// ############################################################
// #  NASHA/GENERAL - SERVICE STRICTEMENT ISOLÉ               #
// #  AUCUN IMPORT DEPUIS UN AUTRE TAB                        #
// #  AUCUN IMPORT DEPUIS LE NIVEAU PAGE                      #
// ############################################################

import { ovhApi } from "../../../../../services/api";
import type { NashaInfo } from "../../nasha.types";

// ============================================================
// Service LOCAL - Usage INTERNE au tab general uniquement
// ============================================================

class GeneralService {
  async getNasha(serviceName: string): Promise<NashaInfo> {
    return ovhApi.get<NashaInfo>(`/dedicated/nasha/${serviceName}`);
  }
}

export const generalService = new GeneralService();
