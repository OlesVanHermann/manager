// ============================================================
// GENERAL TAB SERVICE - Isolé pour Nutanix General
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { NutanixCluster } from "../../nutanix.types";

// ========================================
// SERVICE GENERAL - ISOLÉ
// ========================================

export const generalService = {
  /**
   * Récupère les informations d'un cluster Nutanix
   */
  getCluster: (serviceName: string): Promise<NutanixCluster> =>
    ovhGet<NutanixCluster>(`/nutanix/${serviceName}`),

  /**
   * Liste tous les clusters Nutanix
   */
  getClusters: (): Promise<string[]> =>
    ovhGet<string[]>("/nutanix"),
};
