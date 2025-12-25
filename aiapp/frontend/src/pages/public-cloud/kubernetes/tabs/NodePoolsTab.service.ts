// ============================================================
// PUBLIC-CLOUD / KUBERNETES / NODEPOOLS - Service ISOLÉ
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../services/api";
import type { NodePool } from "../kubernetes.types";

// ======================== API ========================

export async function getNodePools(projectId: string, kubeId: string): Promise<NodePool[]> {
  return ovhGet<NodePool[]>(`/cloud/project/${projectId}/kube/${kubeId}/nodepool`);
}

export async function createNodePool(
  projectId: string,
  kubeId: string,
  name: string,
  flavor: string,
  desiredNodes: number
): Promise<NodePool> {
  return ovhPost<NodePool>(`/cloud/project/${projectId}/kube/${kubeId}/nodepool`, {
    name,
    flavorName: flavor,
    desiredNodes,
  });
}

export async function scaleNodePool(
  projectId: string,
  kubeId: string,
  nodePoolId: string,
  desiredNodes: number
): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/kube/${kubeId}/nodepool/${nodePoolId}`, {
    desiredNodes,
  });
}

export async function deleteNodePool(projectId: string, kubeId: string, nodePoolId: string): Promise<void> {
  return ovhDelete(`/cloud/project/${projectId}/kube/${kubeId}/nodepool/${nodePoolId}`);
}

// ======================== Helpers (DUPLIQUÉS) ========================

export function getNodePoolStatusClass(status: string): string {
  const classes: Record<string, string> = {
    READY: "nodepools-badge-success",
    INSTALLING: "nodepools-badge-warning",
    ERROR: "nodepools-badge-error",
    DELETING: "nodepools-badge-secondary",
  };
  return classes[status] || "";
}
