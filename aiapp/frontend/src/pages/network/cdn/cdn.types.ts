// ============================================================
// CDN - Types partagés (SEUL fichier partagé entre tabs)
// ============================================================

export interface CdnInfo {
  serviceName: string;
  offer: string;
  anycast: string;
  status: string;
}

export interface CdnDomain {
  domain: string;
  status: string;
  cname: string;
}

export interface CdnStats {
  requests: number;
  bandwidth: number;
  cacheHitRate: number;
}

export interface CdnTask {
  id: number;
  function: string;
  status: string;
  startDate: string;
  doneDate?: string;
}
