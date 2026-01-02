// ============================================================
// INDY TAB SERVICE - API calls for Independent Multi-Domains
// NAV3: Expert > NAV4: Indy (Multi-domaines indépendants)
// Ref: old_manager hosting-indy.service.js
// ============================================================

import { ovhGet } from "../../../../../services/api";

const BASE = "/hosting/web";

// ============ TYPES ============

export interface Indy {
  login: string;
  home: string;
  state: "rw" | "off";
  attachedDomains: string[];
}

export interface IndyListParams {
  login?: string; // Filter by login (supports wildcards like '%search%')
}

// ============ SERVICE ============

export const indyService = {
  /**
   * Get list of all Indy login IDs for a hosting service
   * @param serviceName - The hosting service identifier
   * @param params - Optional filter parameters
   * @returns Promise<string[]> - Array of Indy login identifiers
   */
  getIndyList: (serviceName: string, params?: IndyListParams): Promise<string[]> =>
    ovhGet<string[]>(`${BASE}/${serviceName}/indy`, params ? { params } as any : undefined),

  /**
   * Get detailed information for a specific Indy login
   * @param serviceName - The hosting service identifier
   * @param login - The Indy login identifier
   * @returns Promise<Indy> - Full Indy object with state, home, attachedDomains
   */
  getIndy: (serviceName: string, login: string): Promise<Indy> =>
    ovhGet<Indy>(`${BASE}/${serviceName}/indy/${encodeURIComponent(login)}`),

  /**
   * Get all Indys with full details
   * @param serviceName - The hosting service identifier
   * @param params - Optional filter parameters
   * @returns Promise<Indy[]> - Array of full Indy objects
   */
  getAllIndysWithDetails: async (
    serviceName: string,
    params?: IndyListParams
  ): Promise<Indy[]> => {
    const logins = await indyService.getIndyList(serviceName, params);

    // Fetch details for each login (limit concurrent requests)
    const indys: Indy[] = [];
    const batchSize = 5;

    for (let i = 0; i < logins.length; i += batchSize) {
      const batch = logins.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map((login) =>
          indyService.getIndy(serviceName, login).catch((err) => {
            console.warn(`[IndyService] Failed to fetch indy ${login}:`, err);
            return null;
          })
        )
      );
      indys.push(...batchResults.filter((indy): indy is Indy => indy !== null));
    }

    return indys;
  },
};

export default indyService;
