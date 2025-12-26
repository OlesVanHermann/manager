// ============================================================
// GENERAL TYPES - Types partagés pour le dashboard Private Cloud
// SEUL fichier partagé entre les tabs (types = contrats API)
// ============================================================

export interface ServiceCount {
  type: string;
  count: number;
  icon: string;
}

export interface ServiceInfo {
  type: string;
  name: string;
  description: string;
  route: string;
  icon: string;
}
