// ============================================================
// NODES TAB SERVICE - Isolé pour Nutanix Nodes
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { NutanixNode } from "../../nutanix.types";

// ========================================
// HELPERS LOCAUX (dupliqués volontairement)
// ========================================

export const getNodeStatusBadgeClass = (status: string): string => {
  const classes: Record<string, string> = {
    DEPLOYED: "badge-success",
    DEPLOYING: "badge-warning",
    ERROR: "badge-error",
    REMOVING: "badge-warning",
  };
  return classes[status] || "";
};

// ========================================
// SERVICE NODES - ISOLÉ
// ========================================

export const nodesService = {
  /**
   * Liste tous les nodes d'un cluster Nutanix
   */
  getNodes: async (serviceName: string): Promise<NutanixNode[]> => {
    const nodeIds = await ovhGet<string[]>(`/nutanix/${serviceName}/nodes`);
    return Promise.all(
      nodeIds.map((nodeId) =>
        ovhGet<NutanixNode>(`/nutanix/${serviceName}/nodes/${nodeId}`)
      )
    );
  },

  /**
   * Récupère un node spécifique
   */
  getNode: (serviceName: string, nodeId: string): Promise<NutanixNode> =>
    ovhGet<NutanixNode>(`/nutanix/${serviceName}/nodes/${nodeId}`),
};
