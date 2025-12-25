// ============================================================
// PUBLIC-CLOUD / LOAD-BALANCER - Types partagés (SEUL fichier mutualisé)
// ============================================================

export interface LoadBalancer {
  id: string;
  name: string;
  region: string;
  status: string;
  vipAddress: string;
  flavor: string;
}

export interface Listener {
  id: string;
  name: string;
  protocol: string;
  port: number;
  status: string;
}

export interface Pool {
  id: string;
  name: string;
  protocol: string;
  algorithm: string;
  membersCount: number;
  status: string;
}
