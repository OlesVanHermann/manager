// ============================================================
// GENERAL TAB SERVICE - Isolé pour Private Cloud Dashboard
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { ServiceCount } from "../../general.types";

// ========================================
// SERVICE GENERAL - ISOLÉ
// ========================================

export const generalService = {
  /**
   * Récupère le nombre de services pour chaque type de Private Cloud
   */
  getServiceCounts: async (): Promise<ServiceCount[]> => {
    const [vmware, nutanix, veeam] = await Promise.all([
      ovhGet<string[]>("/dedicatedCloud").catch(() => []),
      ovhGet<string[]>("/nutanix").catch(() => []),
      ovhGet<string[]>("/veeam/veeamEnterprise").catch(() => []),
    ]);

    return [
      { type: "vmware", count: vmware.length, icon: "🖥️" },
      { type: "nutanix", count: nutanix.length, icon: "🔷" },
      { type: "managedBaremetal", count: 0, icon: "🏗️" },
      { type: "sap", count: 0, icon: "💎" },
      { type: "veeam", count: veeam.length, icon: "💾" },
    ];
  },
};
