// ============================================================
// GENERAL TAB SERVICE - Service isolé pour l'onglet General
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { NutanixCluster } from "../../nutanix.types";

export const generalService = {
  /**
   * Récupère les informations du cluster Nutanix
   */
  getCluster: (serviceName: string): Promise<NutanixCluster> =>
    ovhGet<NutanixCluster>(
