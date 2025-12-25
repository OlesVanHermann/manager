// ============================================================
// NUTANIX TYPES - Types partagés pour tous les tabs Nutanix
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
  model: string;
  serialNumber: string;
}

export interface NutanixIp {
  ip: string;
  type: string;
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
