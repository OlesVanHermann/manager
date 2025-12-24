// ============================================================
// TYPES PACK XDSL - Partagés entre tous les tabs (SEUL partage autorisé)
// ============================================================

export interface Pack {
  packName: string;
  description?: string;
  offerDescription: string;
  capabilities: { isLegacyOffer: boolean; canMoveAddress: boolean };
}

export interface XdslAccess {
  accessName: string;
  accessType: string;
  status: string;
  address: { city: string; street: string; zipCode: string };
  connectionStatus: string;
  ipv4?: string;
  ipv6?: string;
}

export interface VoipLine {
  serviceName: string;
  number: string;
  description?: string;
  status: string;
}

export interface PackService {
  name: string;
  type: string;
  domain?: string;
  used: number;
  total: number;
}

export interface Task {
  id: number;
  function: string;
  status: string;
  todoDate: string;
  doneDate?: string;
}
