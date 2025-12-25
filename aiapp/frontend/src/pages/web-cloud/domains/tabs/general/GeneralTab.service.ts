// ============================================================
// SERVICE ISOLÉ : GeneralTab - Informations générales domaine
// ============================================================

import { ovhGet, ovhPost, ovhPut } from "../../../../../services/api";
import type { Domain, DomainServiceInfos, DnssecStatus, DnsRecord } from "../../domains.types";

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
    const response = await ovhPost<{ authInfo: string }>(`/domain/${domain}/authInfo`, {});
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

  // -------- DNS RECORDS (pour subdomains) --------
  async listRecordsDetailed(zone: string): Promise<DnsRecord[]> {
    try {
      const ids = await ovhGet<number[]>(`/domain/zone/${zone}/record`);
      if (ids.length === 0) return [];
      const records = await Promise.all(
        ids.slice(0, 100).map((id) => ovhGet<DnsRecord>(`/domain/zone/${zone}/record/${id}`))
      );
      return records;
    } catch {
      return [];
    }
  }

  // -------- DOMAIN TASKS --------
  async listDomainTasks(domain: string): Promise<number[]> {
    return ovhGet<number[]>(`/domain/${domain}/task`);
  }

  async getDomainTask(domain: string, id: number): Promise<{ id: number; function: string; status: string; comment?: string }> {
    return ovhGet(`/domain/${domain}/task/${id}`);
  }

  // -------- HOSTING LINKED --------
  async getLinkedHosting(domain: string): Promise<string | null> {
    try {
      const hostings = await ovhGet<string[]>(`/hosting/web`);
      for (const h of hostings) {
        const info = await ovhGet<{ serviceName: string; hostingIp?: string }>(`/hosting/web/${h}`);
        if (info.serviceName === domain || h === domain) return h;
      }
      return null;
    } catch {
      return null;
    }
  }
}

export const generalService = new GeneralService();
export { formatDate, formatDateLong };
