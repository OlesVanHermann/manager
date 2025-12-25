// ============================================================
// VRACK SERVICES - Types partagés (SEUL fichier partagé)
// ============================================================

export interface VrackServicesInfo {
  id: string;
  displayName?: string;
  productStatus: string;
  region: string;
  createdAt: string;
}

export interface VrackServicesSubnet {
  id: string;
  displayName?: string;
  cidr: string;
  serviceRange?: { cidr: string };
  vlan?: number;
}

export interface VrackServicesEndpoint {
  id: string;
  displayName?: string;
  managedServiceUrn: string;
}
