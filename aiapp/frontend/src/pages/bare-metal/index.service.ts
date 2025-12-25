// ############################################################
// #  BARE-METAL/DASHBOARD - SERVICE ISOLÉ                    #
// #  Aucune dépendance vers les autres modules               #
// ############################################################

import { ovhApi } from "../../services/api";

// ============================================================
// SERVICE DASHBOARD - ISOLÉ
// ============================================================

export const dashboardService = {
  // VPS
  listVps: (): Promise<string[]> =>
    ovhApi.get("/vps"),

  // Dedicated
  listDedicated: (): Promise<string[]> =>
    ovhApi.get("/dedicated/server"),

  // NAS-HA
  listNasha: (): Promise<string[]> =>
    ovhApi.get("/dedicated/nasha"),

  // NetApp
  listNetapp: (): Promise<string[]> =>
    ovhApi.get("/storage/netapp"),

  // Housing
  listHousing: (): Promise<string[]> =>
    ovhApi.get("/dedicated/housing"),
};
