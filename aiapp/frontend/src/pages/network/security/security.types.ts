// ============================================================
// SECURITY - Types partagés (SEUL fichier partagé)
// ============================================================

export interface SecurityIpInfo {
  ip: string;
  routedTo?: { serviceName: string };
  type: string;
  mitigation: string;
  state: string;
}

export interface SecurityAttack {
  id: string;
  ipAttack: string;
  type: string;
  startDate: string;
  endDate?: string;
}

export interface SecurityFirewallRule {
  sequence: number;
  action: string;
  protocol: string;
  source?: string;
  sourcePort?: string;
  destination?: string;
  destinationPort?: string;
}
