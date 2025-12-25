// ============================================================
// PUBLIC-CLOUD / KUBERNETES - Types partagés (SEUL fichier mutualisé)
// ============================================================

export interface Cluster {
  id: string;
  name: string;
  region: string;
  version: string;
  status: string;
  url?: string;
  nodesCount: number;
}

export interface NodePool {
  id: string;
  name: string;
  flavor: string;
  desiredNodes: number;
  currentNodes: number;
  minNodes: number;
  maxNodes: number;
  autoscale: boolean;
  status: string;
}
