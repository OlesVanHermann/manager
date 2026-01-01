// ============================================================
// SERVICE ISOLÉ : GeneralTab - Informations générales domaine
// Pattern identique old_manager avec APIv2 resource
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete, ovh2apiGet, ovhDirectFetch } from "../../../../services/api";
import type { Domain, DomainServiceInfos, DnsRecord } from "../domains.types";

// APIv2 prefix (identique old_manager)
const APIV2_PREFIX = "/engine/api/v2";

// ============ TYPES UK TRANSFER ============

export interface UkTransferResult {
  taskId: number;
  function: string;
  status: string;
}

// ============ TYPES OPTIONS ============

export interface DomainOption {
  option: string;
  state: string;
  expirationDate?: string;
}

export interface CartServiceOption {
  planCode: string;
  prices: Array<{ price: { value: number; text: string }; duration: string }>;
}

// ============ HELPERS LOCAUX (DUPLIQUÉS) ============

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateLong = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// ============ SERVICE ============

class GeneralService {
  // -------- DOMAIN BASIC --------
  async getDomain(domain: string): Promise<Domain> {
    return ovhGet<Domain>(`/domain/${domain}`);
  }

  async getServiceInfos(domain: string): Promise<DomainServiceInfos> {
    return ovhGet<DomainServiceInfos>(`/domain/${domain}/serviceInfos`);
  }

  async lockDomain(domain: string): Promise<void> {
    await ovhPut(`/domain/${domain}`, { transferLockStatus: "locked" });
  }

  async unlockDomain(domain: string): Promise<void> {
    await ovhPut(`/domain/${domain}`, { transferLockStatus: "unlocked" });
  }

  async getAuthInfo(domain: string): Promise<string> {
    // GET /domain/{domain}/authInfo - Identique old_manager
    const response = await ovhGet<{ authInfo: string }>(`/domain/${domain}/authInfo`);
    return response.authInfo;
  }

  async hasEmailDomain(domain: string): Promise<boolean> {
    try {
      await ovhGet(`/email/domain/${domain}`);
      return true;
    } catch {
      return false;
    }
  }

  // -------- DNSSEC STATUS --------
  async getDnssecStatus(zone: string): Promise<{ status: string }> {
    return ovhGet<{ status: string }>(`/domain/zone/${zone}/dnssec`);
  }

  // -------- DOMAIN TASKS --------
  // OPTIMISATION: Juste retourner le count - détails dans l'onglet Tasks
  async getPendingTasksCount(domain: string): Promise<number> {
    try {
      const ids = await ovhGet<number[]>(`/domain/${domain}/task`);
      // On retourne juste le count, les détails sont lazy-loadés dans Tasks tab
      return ids.length;
    } catch {
      return 0;
    }
  }

  // -------- NAME SERVERS --------
  // OPTIMISATION: Juste retourner le count - détails chargés dans l'onglet DNS Servers
  async getNameServersCount(domain: string): Promise<number> {
    try {
      const ids = await ovhGet<number[]>(`/domain/${domain}/nameServer`);
      return ids.length;
    } catch {
      return 0;
    }
  }

  // -------- ZONE RECORDS COUNT --------
  async getZoneRecordsCount(zone: string): Promise<number> {
    try {
      const ids = await ovhGet<number[]>(`/domain/zone/${zone}/record`);
      return ids.length;
    } catch {
      return 0;
    }
  }

  // -------- ANYCAST STATUS --------
  async getAnycastStatus(zone: string): Promise<boolean> {
    try {
      const info = await ovhGet<{ hasDnsAnycast?: boolean }>(`/domain/zone/${zone}`);
      return info.hasDnsAnycast || false;
    } catch {
      return false;
    }
  }

  // -------- UK OUTGOING TRANSFER (Identique old_manager) --------
  async postUkOutgoingTransfer(domain: string, tag: string): Promise<UkTransferResult> {
    // POST /domain/{domain}/ukOutgoingTransfer - Identique old_manager
    return ovhPost<UkTransferResult>(`/domain/${domain}/ukOutgoingTransfer`, { tag });
  }

  // -------- DOMAIN OPTIONS --------
  async getDomainOptions(domain: string): Promise<string[]> {
    // GET /domain/{domain}/option - Identique old_manager
    return ovhGet<string[]>(`/domain/${domain}/option`);
  }

  async getDomainOption(domain: string, option: string): Promise<DomainOption> {
    // GET /domain/{domain}/option/{option} - Identique old_manager
    return ovhGet<DomainOption>(`/domain/${domain}/option/${option}`);
  }

  /**
   * Delete a domain option
   * DELETE /domain/{domain}/option/{option} - Identique old_manager
   */
  async deleteDomainOption(domain: string, option: string): Promise<void> {
    await ovhDelete(`/domain/${domain}/option/${option}`);
  }

  // -------- ASSOCIATED HOSTING (Identique old_manager) --------
  /**
   * Get hosting web attached to this domain
   * Uses OvhApiHostingWeb.v6().getAttachedDomain() - Identique old_manager
   */
  async getAssociatedHosting(domain: string): Promise<string | null> {
    try {
      // GET /hosting/web/{serviceName}/attachedDomain where domain matches
      // First get all hosting services, then check which one has this domain attached
      const hostings = await ovhGet<string[]>("/hosting/web");
      for (const hosting of hostings) {
        try {
          const attachedDomains = await ovhGet<string[]>(`/hosting/web/${hosting}/attachedDomain`);
          if (attachedDomains.includes(domain)) {
            return hosting;
          }
        } catch {
          // Skip this hosting if we can't read attached domains
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  // -------- ORDER SERVICE OPTIONS --------
  async getOrderServiceOptions(domain: string): Promise<CartServiceOption[]> {
    // GET /order/cartServiceOption/domain/{domain} - Identique old_manager
    return ovhGet<CartServiceOption[]>(`/order/cartServiceOption/domain/${domain}`);
  }

  // -------- 2API AGGREGATED DOMAIN (Identique old_manager) --------
  async getDomainAggregated(domain: string): Promise<Domain & { zone?: unknown; serviceInfos?: DomainServiceInfos }> {
    // GET /sws/domain/{domain} - Identique old_manager (2API)
    // Retourne domain + zone + serviceInfos en un seul appel
    try {
      return await ovh2apiGet<Domain & { zone?: unknown; serviceInfos?: DomainServiceInfos }>(
        `/sws/domain/${domain}`
      );
    } catch {
      // Fallback vers appel simple si 2API non disponible
      return this.getDomain(domain);
    }
  }

  // -------- 2API OPTIONS DETAILS (Identique old_manager) --------
  async getOptionDetails(domain: string, option: string): Promise<unknown> {
    // GET /sws/domain/{domain}/options/{option} - Identique old_manager (2API)
    return ovh2apiGet(`/sws/domain/${domain}/options/${option}`);
  }

  // -------- UPDATE NAMESERVER TYPE --------
  async updateNameServerType(domain: string, nameServerType: "hosted" | "external"): Promise<void> {
    // PUT /domain/{domain} - Identique old_manager
    await ovhPut(`/domain/${domain}`, { nameServerType });
  }

  // -------- APIV2 RESOURCE (Identique old_manager) --------
  /**
   * Get the APIv2 domain resource
   * GET /engine/api/v2/domain/name/{serviceName} - Identique old_manager
   */
  async getResource(serviceName: string): Promise<Domain> {
    // APIv2 direct call - identique old_manager Apiv2Service.httpApiv2
    return ovhDirectFetch<Domain>("GET", `${APIV2_PREFIX}/domain/name/${serviceName}`);
  }

  /**
   * Update the APIv2 domain resource
   * PUT /engine/api/v2/domain/name/{serviceName} - Identique old_manager
   */
  async updateResource(serviceName: string, payload: Partial<Domain>): Promise<Domain> {
    // APIv2 direct call - identique old_manager Apiv2Service.httpApiv2
    return ovhDirectFetch<Domain>("PUT", `${APIV2_PREFIX}/domain/name/${serviceName}`, { body: payload });
  }

  // -------- DOMAIN MODELS (Identique old_manager) --------
  /**
   * Get domain models (enum values, etc.)
   * GET /domain.json - Identique old_manager
   */
  async getDomainModels(): Promise<unknown> {
    return ovhGet("/domain.json");
  }

  /**
   * Get me models (account/operation enum values, etc.)
   * GET /me.json - Identique old_manager getDomainOperationModels()
   */
  async getMeModels(): Promise<unknown> {
    return ovhGet("/me.json");
  }

  // -------- CHECK EMAIL DOMAIN EXISTS (Identique old_manager) --------
  /**
   * Check if email domain service exists for this domain
   * GET /email/domain/{domain} - Identique old_manager
   */
  async hasEmailDomainService(domain: string): Promise<boolean> {
    try {
      await ovhGet(`/email/domain/${encodeURIComponent(domain)}`);
      return true;
    } catch {
      return false;
    }
  }

  // -------- AUTHINFO (correction format retour) --------
  /**
   * Get auth info for domain transfer
   * GET /domain/{domain}/authInfo - Identique old_manager
   * Note: L'API peut retourner directement une string ou un objet { authInfo: string }
   */
  async getAuthInfoRaw(domain: string): Promise<string> {
    const response = await ovhGet<string | { authInfo: string }>(`/domain/${domain}/authInfo`);
    // Handle both formats
    if (typeof response === "string") {
      return response;
    }
    return response.authInfo;
  }
}

export const generalService = new GeneralService();
export { formatDate, formatDateLong };
