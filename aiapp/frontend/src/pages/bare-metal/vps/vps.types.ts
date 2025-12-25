// ============================================================
// VPS TYPES - Types partagés pour tous les tabs VPS
// ============================================================

export interface Vps {
  name: string;
  displayName: string;
  cluster: string;
  model: { name: string; offer: string; version: string; disk: number; memory: number; vcore: number };
  netbootMode: 'local' | 'rescue';
  offerType: string;
  slaMonitoring: boolean;
  state: 'backuping' | 'installing' | 'maintenance' | 'rebooting' | 'rescued' | 'running' | 'stopped' | 'stopping' | 'upgrading';
  vcore: number;
  zone: string;
  keymap: string | null;
  memoryLimit: number;
  monitoringIpBlocks: string[];
}

export interface VpsServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew: { automatic: boolean; deleteAtExpiration: boolean; period: number | null };
}

export interface VpsIp {
  ipAddress: string;
  gateway: string | null;
  type: 'primary' | 'additional';
  version: 'v4' | 'v6';
  reverse: string | null;
  macAddress: string | null;
}

export interface VpsDisk {
  id: number;
  size: number;
  state: 'connected' | 'disconnected' | 'pending';
  type: 'additional' | 'primary';
  bandwidthLimit: number;
  fileSystem: string | null;
  isReadOnly: boolean;
  name: string | null;
  monitored: boolean;
}

export interface VpsSnapshot {
  creationDate: string;
  description: string;
}

export interface VpsBackup {
  id: number;
  creationDate: string;
  description: string | null;
  state: 'created' | 'creating' | 'deleted' | 'deleting' | 'error' | 'restoring';
}

export interface VpsTask {
  id: number;
  type: string;
  state: 'blocked' | 'cancelled' | 'doing' | 'done' | 'error' | 'paused' | 'todo' | 'waitingAck';
  progress: number;
  startDate: string | null;
  doneDate: string | null;
}
