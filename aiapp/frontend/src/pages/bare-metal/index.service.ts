// ############################################################
// #  BARE-METAL/DASHBOARD - SERVICE STRICTEMENT ISOLÉ        #
// #  API : /vps, /dedicated/server, /dedicated/nasha,        #
// #        /storage/netapp, /dedicated/housing               #
// #  AUCUN IMPORT CROISÉ AUTORISÉ                            #
// ############################################################

import { ovhGet } from "../../services/api";

// ============================================================
// SERVICE DASHBOARD - ISOLÉ
// ============================================================

export const dashboardService = {
  /**
   * Liste tous les VPS du compte
   */
  listVps: (): Promise<string[]> => ovhGet<string[]>("/vps"),

  /**
   * Liste tous les serveurs dédiés du compte
   */
  listDedicated: (): Promise<string[]> => ovhGet<string[]>("/dedicated/server"),

  /**
   * Liste tous les NAS-HA du compte
   */
  listNasha: (): Promise<string[]> => ovhGet<string[]>("/dedicated/nasha"),

  /**
   * Liste tous les NetApp du compte
   */
  listNetapp: (): Promise<string[]> => ovhGet<string[]>("/storage/netapp"),

  /**
   * Liste tous les Housing du compte
   */
  listHousing: (): Promise<string[]> => ovhGet<string[]>("/dedicated/housing"),
};
