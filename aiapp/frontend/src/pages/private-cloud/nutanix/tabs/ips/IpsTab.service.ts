// ============================================================
// IPS TAB SERVICE - Isolé pour Nutanix IPs
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { NutanixIp } from "../../nutanix.types";

// ========================================
// HELPERS LOCAUX (dupliqués volontairement)
// ========================================

export const getIpStatusBadgeClass = (status: string): string => {
  const classes: Record<string, string> = {
    ACTIVE: "badge-success",
    PENDING: "badge-warning",
    ERROR: "badge-error",
    RESERVED: "badge-info",
  };
  return classes[status] || "";
};

export const getIpTypeBadgeClass = (type: string): string => {
  const classes: Record<string, string> = {
    PUBLIC: "badge-primary",
    PRIVATE: "badge-secondary",
    FAILOVER: "badge-info",
  };
  return classes[type] || "";
};

// ========================================
// SERVICE IPS - ISOLÉ
// ========================================

export const ipsService = {
  /**
   * Liste toutes les IPs d'un cluster Nutanix
   */
  getIps: async (serviceName: string): Promise<NutanixIp[]> => {
    const ips = await ovhGet<string[]>(`/nutanix/${serviceName}/ips`);
    return Promise.all(
      ips.map((ip) =>
        ovhGet<NutanixIp>(`/nutanix/${serviceName}/ips/${encodeURIComponent(ip)}`)
      )
    );
  },

  /**
   * Récupère une IP spécifique
   */
  getIp: (serviceName: string, ip: string): Promise<NutanixIp> =>
    ovhGet<NutanixIp>(`/nutanix/${serviceName}/ips/${encodeURIComponent(ip)}`),
};
