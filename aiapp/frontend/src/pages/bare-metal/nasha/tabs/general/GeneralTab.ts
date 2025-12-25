// ============================================================
// NASHA SERVICE ISOLÉ : GeneralTab
// ============================================================

import { ovhApi } from "../../../../../services/api";
import type { NashaInfo } from "../../nasha.types";

class GeneralService {
  async getNasha(serviceName: string): Promise<NashaInfo> {
    return ovhApi.get<NashaInfo>(`/dedicated/nasha/${serviceName}`);
  }
}

export const generalService = new GeneralService();
