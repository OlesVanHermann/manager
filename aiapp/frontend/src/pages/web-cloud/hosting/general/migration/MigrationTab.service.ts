// ============================================================
// MIGRATION TAB SERVICE - API calls for hosting migration
// Ref: old_manager hosting-migration.controller.js
// ============================================================

import { ovhGet, ovhPost } from "../../../../../services/api";

const BASE = "/hosting/web";

// ============ TYPES ============

export interface HostingInfo {
  serviceName: string;
  displayName?: string;
  offer?: string;
  state: string;
}

// ============ SERVICE ============

export const migrationService = {
  // List all hosting services (for destination selection)
  listHostings: (): Promise<string[]> =>
    ovhGet<string[]>(BASE),

  // Get hosting details
  getHosting: (serviceName: string): Promise<HostingInfo> =>
    ovhGet<HostingInfo>(`${BASE}/${serviceName}`),

  // Migrate .ovh.org domain to another hosting
  // This is specifically for migrating the .ovh.org subdomain
  migrateOvhOrg: (serviceName: string, destinationServiceName: string): Promise<void> =>
    ovhPost<void>(`${BASE}/${serviceName}/migrateMyOvhOrg`, {
      destinationServiceName,
    }),
};

export default migrationService;
