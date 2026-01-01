// ============================================================
// REDIRECTIONS SERVICE - Gestion des redirections web
// Pattern identique old_manager avec 2API batch
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete, ovh2apiGet, ovh2apiPost } from "../../../../../services/api";

// ============ TYPES REDIRECTION ============

export interface Redirection {
  id: number;
  zone: string;
  subDomain: string;
  target: string;
  type: "visible" | "invisible" | "visiblePermanent";
  title?: string;
  keywords?: string;
  description?: string;
}

export interface RedirectionListResult {
  redirections: Redirection[];
  count: number;
}

export interface RedirectionAddParams {
  subDomain: string;
  target: string;
  type: "visible" | "invisible" | "visiblePermanent";
  title?: string;
  keywords?: string;
  description?: string;
}

export interface RedirectionCheckResult {
  canBeAdded: boolean;
  conflictingRecords?: Array<{
    id: number;
    type: string;
    subDomain: string;
  }>;
  listA?: number[];
  listAAAA?: number[];
  listCNAME?: number[];
}

// ============ SERVICE ============

class RedirectionsService {
  // -------- LIST REDIRECTIONS (2API - Identique old_manager) --------
  /**
   * Get redirections for a domain
   * GET /sws/domain/{domain}/redirections - Identique old_manager
   */
  async getRedirections(
    serviceName: string,
    params: {
      count?: number;
      offset?: number;
      search?: string;
    } = {}
  ): Promise<RedirectionListResult> {
    const queryParams = new URLSearchParams();
    if (params.count) queryParams.append("count", String(params.count));
    if (params.offset) queryParams.append("offset", String(params.offset));
    if (params.search) queryParams.append("search", params.search);

    const query = queryParams.toString();
    const path = `/sws/domain/${serviceName}/redirections${query ? `?${query}` : ""}`;

    return ovh2apiGet<RedirectionListResult>(path);
  }

  // -------- CHECK REDIRECTION ADD (2API - Identique old_manager) --------
  /**
   * Check if a redirection can be added
   * POST /sws/domain/{domain}/redirections/true/{considerWww} - Identique old_manager
   */
  async checkRedirectionAdd(
    serviceName: string,
    params: RedirectionAddParams,
    considerWww: boolean = true
  ): Promise<RedirectionCheckResult> {
    const path = `/sws/domain/${serviceName}/redirections/true/${considerWww}`;
    return ovh2apiPost<RedirectionCheckResult>(path, params);
  }

  // -------- ADD REDIRECTION (2API - Identique old_manager) --------
  /**
   * Add a redirection
   * POST /sws/domain/{domain}/redirections/false/{considerWww} - Identique old_manager
   */
  async addRedirection(
    serviceName: string,
    params: RedirectionAddParams,
    considerWww: boolean = true
  ): Promise<void> {
    // Default visibility type if not set
    const data = {
      ...params,
      visibilityType: params.type || "invisible",
    };
    const path = `/sws/domain/${serviceName}/redirections/false/${considerWww}`;
    await ovh2apiPost(path, data);
  }

  // -------- UPDATE ORT REDIRECTION (APIv6 - Identique old_manager) --------
  /**
   * Update ORT redirection (OVH redirection type)
   * PUT /domain/zone/{zone}/redirection/{id} - Identique old_manager
   */
  async updateOrtRedirection(
    zoneName: string,
    redirectionId: number,
    data: {
      target?: string;
      description?: string;
      keywords?: string;
      title?: string;
    }
  ): Promise<void> {
    await ovhPut(`/domain/zone/${zoneName}/redirection/${redirectionId}`, data);
    await this.refreshZone(zoneName);
  }

  // -------- UPDATE RECORD REDIRECTION (APIv6 - Identique old_manager) --------
  /**
   * Update redirection record (non-ORT)
   * PUT /domain/zone/{zone}/record/{id} - Identique old_manager
   */
  async updateRecordRedirection(
    zoneName: string,
    recordId: number,
    target: string
  ): Promise<void> {
    await ovhPut(`/domain/zone/${zoneName}/record/${recordId}`, { target });
    await this.refreshZone(zoneName);
  }

  // -------- DELETE REDIRECTION (APIv6 - Identique old_manager) --------
  /**
   * Delete a redirection
   * DELETE /domain/zone/{zone}/redirection/{id} - Identique old_manager
   */
  async deleteRedirection(zoneName: string, redirectionId: number): Promise<void> {
    await ovhDelete(`/domain/zone/${zoneName}/redirection/${redirectionId}`);
    await this.refreshZone(zoneName);
  }

  // -------- OVERWRITE REDIRECTION (Identique old_manager) --------
  /**
   * Overwrite existing redirections
   * Delete conflicting records then add new redirection
   */
  async overwriteRedirection(
    serviceName: string,
    params: RedirectionAddParams,
    conflictingRecords: RedirectionCheckResult,
    considerWww: boolean = true
  ): Promise<void> {
    // Collect all record IDs to delete
    const recordIds: number[] = [
      ...(conflictingRecords.listA || []),
      ...(conflictingRecords.listAAAA || []),
      ...(conflictingRecords.listCNAME || []),
    ];

    // Delete all conflicting records
    if (recordIds.length > 0) {
      await Promise.allSettled(
        recordIds.map((id) => this.deleteRecord(serviceName, id))
      );
    }

    // Add the new redirection
    await this.addRedirection(serviceName, params, considerWww);
  }

  // -------- HELPER: DELETE RECORD --------
  private async deleteRecord(zoneName: string, recordId: number): Promise<void> {
    await ovhDelete(`/domain/zone/${zoneName}/record/${recordId}`);
  }

  // -------- HELPER: REFRESH ZONE --------
  private async refreshZone(zoneName: string): Promise<void> {
    await ovhPost(`/domain/zone/${zoneName}/refresh`, {});
  }

  // -------- GET REDIRECTION DETAILS (APIv6) --------
  /**
   * Get redirection details
   * GET /domain/zone/{zone}/redirection/{id} - Identique old_manager
   */
  async getRedirection(zoneName: string, redirectionId: number): Promise<Redirection> {
    return ovhGet<Redirection>(`/domain/zone/${zoneName}/redirection/${redirectionId}`);
  }

  // -------- LIST REDIRECTION IDS (APIv6 - Pattern N+1) --------
  /**
   * List redirection IDs
   * GET /domain/zone/{zone}/redirection - Identique old_manager
   */
  async listRedirectionIds(zoneName: string, subDomain?: string): Promise<number[]> {
    let path = `/domain/zone/${zoneName}/redirection`;
    if (subDomain !== undefined) {
      path += `?subDomain=${encodeURIComponent(subDomain)}`;
    }
    return ovhGet<number[]>(path);
  }

  // -------- LIST REDIRECTIONS WITH DETAILS (Pattern N+1) --------
  /**
   * List redirections with full details
   * Pattern N+1 identique old_manager
   */
  async listRedirectionsDetailed(zoneName: string): Promise<Redirection[]> {
    const ids = await this.listRedirectionIds(zoneName);
    if (ids.length === 0) return [];

    const redirections = await Promise.all(
      ids.map((id) => this.getRedirection(zoneName, id))
    );
    return redirections;
  }
}

export const redirectionsService = new RedirectionsService();
