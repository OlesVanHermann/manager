// ============================================================
// NUTANIX TYPES - Types partagés pour tous les tabs Nutanix
// SEUL fichier partagé entre les tabs (types = contrats API)
// ============================================================

export interface NutanixCluster {
  serviceName: string;
  targetSpec?: {
    name: string;
    controlPanelURL: string;
  };
  status: string;
}

export interface NutanixNode {
  nodeId: string;
  name: string;
  status: string;
  ahvIp?: string;
  cvmIp?: string;
  server?: {
    brand: string;
    model: string;
  };
}

export interface NutanixIp {
  ip: string;
  type: string;
  status: string;
  description?: string;
}

export interface NutanixTask {
  taskId: string;
  name: string;
  status: string;
  progress: number;
  startDate: string;
  endDate?: string;
}
