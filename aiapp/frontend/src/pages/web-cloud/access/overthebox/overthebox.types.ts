// ============================================================
// TYPES OVERTHEBOX - Partagés entre tous les tabs (SEUL partage autorisé)
// ============================================================

export interface OverTheBox {
  serviceName: string;
  customerDescription?: string;
  status: string;
  releaseChannel: string;
  systemVersion?: string;
  tunnelMode: string;
}

// Alias for service response
export type OverTheBoxService = OverTheBox;

export interface Remote {
  remoteId: string;
  publicIp?: string;
  status: string;
  lastSeen?: string;
  exposedPort: number;
}

export interface Task {
  id: string;
  name: string;
  status: string;
  todoDate: string;
  doneDate?: string;
}
