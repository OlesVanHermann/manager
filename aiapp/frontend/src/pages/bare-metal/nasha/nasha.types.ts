// ============================================================
// NASHA TYPES - Types partagés pour tous les tabs NAS-HA
// ============================================================

export interface NashaInfo {
  serviceName: string;
  customName?: string;
  datacenter: string;
  ip: string;
  zpoolSize: number;
  zpoolCapacity: number;
  monitored: boolean;
  status: string;
}

export interface NashaPartition {
  partitionName: string;
  partitionDescription?: string;
  protocol: string;
  size: number;
  usedBySnapshots: number;
}

export interface NashaSnapshot {
  name: string;
  partitionName: string;
  type: string;
  createdAt: string;
}

export interface NashaAccess {
  ip: string;
  partitionName: string;
  type: string;
  aclDescription?: string;
}

export interface NashaTask {
  taskId: number;
  operation: string;
  status: string;
  partitionName?: string;
  startDate: string;
  doneDate?: string;
}
