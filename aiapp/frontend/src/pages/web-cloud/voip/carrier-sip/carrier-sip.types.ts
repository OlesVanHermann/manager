// ============================================================
// CARRIER-SIP TYPES - Types partagés (SEUL partage autorisé)
// ============================================================

export interface CarrierSip {
  serviceName: string;
  description?: string;
  maxCalls: number;
  currentCalls: number;
  status: string;
}

export interface Endpoint {
  id: string;
  ip: string;
  priority: number;
  weight: number;
  status: string;
}

export interface CdrRecord {
  id: string;
  caller: string;
  callee: string;
  startDate: string;
  duration: number;
  status: string;
}
