// ============================================================
// SERVICE ISOLÉ : GeneralTab - Informations générales domaine
// ============================================================

import { ovhGet, ovhPost, ovhPut } from "../../../../services/api";
import type { Domain, DomainServiceInfos, DnsRecord } from "../domains.types";

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
}

export const generalService = new GeneralService();
export { formatDate, formatDateLong };
