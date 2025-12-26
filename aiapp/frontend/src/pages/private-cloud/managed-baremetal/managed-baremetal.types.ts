// ============================================================
// MANAGED-BAREMETAL TYPES - Types partagés
// ============================================================

export interface ManagedBaremetalService {
  serviceName: string;
  status: string;
  description?: string;
}
