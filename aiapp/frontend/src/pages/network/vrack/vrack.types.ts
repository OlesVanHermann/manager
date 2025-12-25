// ============================================================
// VRACK - Types partagés (extraits de network.ts)
// ============================================================

export interface Vrack {
  name: string;
  description: string;
}

export interface VrackServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew: { automatic: boolean; deleteAtExpiration: boolean; period: number | null };
}

export interface VrackAllowedService {
  cloudProject: string[];
  dedicatedCloud: string[];
  dedicatedServer: string[];
  dedicatedServerInterface: string[];
  ip: string[];
  ipLoadbalancing: string[];
  legacyVrack: string[];
  ovhCloudConnect: string[];
}

export interface VrackTask {
  id: number;
  function: string;
  status: "cancelled" | "doing" | "done" | "init" | "todo";
  targetDomain: string | null;
  serviceName: string | null;
  orderId: number | null;
  lastUpdate: string;
  todoDate: string;
}

export interface VrackWithDetails {
  name: string;
  details?: Vrack;
  serviceInfos?: VrackServiceInfos;
  loading: boolean;
}
