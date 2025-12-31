// ============================================================
// DOMAINS/ALLDOM - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../services/api';
import type { AllDomPack, AllDomServiceInfo, AllDomEntry, AllDomDomain } from '../../domains.types';

// ============ API CALLS ============

export async function listAllDomPacks(): Promise<string[]> {
  return ovhApi.get<string[]>('/allDom');
}

export async function getAllDomResource(serviceName: string): Promise<{ currentState: AllDomPack }> {
  return ovh2Api.get<{ currentState: AllDomPack }>(`/domain/alldom/${serviceName}`);
}

export async function getServiceInfo(serviceName: string): Promise<AllDomServiceInfo> {
  const infos = await ovhApi.get<any>(`/allDom/${serviceName}/serviceInfos`);
  return {
    serviceId: infos.serviceId || 0,
    serviceName,
    creation: infos.creation,
    expiration: infos.expiration,
    renewMode: infos.renew?.automatic ? 'automatic' : 'manual',
    contactAdmin: infos.contactAdmin,
    contactTech: infos.contactTech,
    contactBilling: infos.contactBilling,
    isTerminating: infos.renew?.deleteAtExpiration || false,
  };
}

export async function getAllDomEntry(serviceName: string): Promise<AllDomEntry> {
  const [resource, serviceInfo] = await Promise.all([
    getAllDomResource(serviceName).catch(() => null),
    getServiceInfo(serviceName).catch(() => null),
  ]);
  return {
    serviceName,
    pack: resource?.currentState || { name: serviceName, type: 'FRENCH', domains: [], extensions: [] },
    serviceInfo,
  };
}

export async function listAllDomWithDetails(): Promise<AllDomEntry[]> {
  const names = await listAllDomPacks();
  return Promise.all(names.map(getAllDomEntry));
}

export async function terminateAllDom(serviceName: string): Promise<void> {
  const serviceIds = await ovhApi.get<number[]>(`/services?resourceName=${serviceName}&routes=/allDom`);
  if (serviceIds.length > 0) {
    await ovhApi.put(`/services/${serviceIds[0]}`, { terminationPolicy: 'terminateAtExpirationDate' });
  }
}

export async function cancelTermination(serviceName: string): Promise<void> {
  const serviceIds = await ovhApi.get<number[]>(`/services?resourceName=${serviceName}&routes=/allDom`);
  if (serviceIds.length > 0) {
    await ovhApi.put(`/services/${serviceIds[0]}`, { terminationPolicy: 'empty' });
  }
}

// ============ HELPERS ============

export function getTypeLabel(type: string): string {
  switch (type) {
    case 'FRENCH': return 'FR';
    case 'FRENCH+INTERNATIONAL': return 'FR + International';
    case 'INTERNATIONAL': return 'International';
    default: return type;
  }
}

export function getRegisteredCount(domains: AllDomDomain[]): number {
  return domains.filter(d => d.registrationStatus === 'REGISTERED').length;
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ============ ALLDOM SERVICE CLASS (for modals) ============

class AlldomService {
  // -------- BATCH LOCK --------
  async getLockStatus(domain: string): Promise<{ locked: boolean; supported: boolean }> {
    try {
      const info = await ovhApi.get<any>(`/domain/${domain}`);
      return {
        locked: info.transferLockStatus === "locked",
        supported: info.transferLockStatus !== "notSupported",
      };
    } catch {
      return { locked: false, supported: false };
    }
  }

  async batchLock(domains: string[], action: "lock" | "unlock"): Promise<void> {
    await Promise.all(
      domains.map((domain) =>
        action === "lock"
          ? ovhApi.post(`/domain/${domain}/lock`, {})
          : ovhApi.delete(`/domain/${domain}/lock`)
      )
    );
  }

  // -------- BATCH DNS --------
  async batchDns(domains: string[], servers: { host: string; ip: string }[]): Promise<void> {
    const nameServers = servers.map((s) => ({ host: s.host, ip: s.ip || undefined }));
    await Promise.all(
      domains.map((domain) =>
        ovhApi.post(`/domain/${domain}/nameServers/update`, { nameServers })
      )
    );
  }

  // -------- BATCH DNSSEC --------
  async getDnssecStatus(domain: string): Promise<{ enabled: boolean; supported: boolean }> {
    try {
      const records = await ovhApi.get<number[]>(`/domain/${domain}/dsRecord`);
      return { enabled: records.length > 0, supported: true };
    } catch {
      return { enabled: false, supported: false };
    }
  }

  async batchDnssec(domains: string[], action: "enable" | "disable"): Promise<void> {
    await Promise.all(
      domains.map((domain) =>
        action === "enable"
          ? ovhApi.post(`/domain/${domain}/activateDnssec`, {})
          : ovhApi.post(`/domain/${domain}/deactivateDnssec`, {})
      )
    );
  }

  // -------- BATCH RENEW --------
  async getRenewInfo(domain: string): Promise<{ expiration: string; price: string; renewable: boolean }> {
    try {
      const info = await ovhApi.get<any>(`/domain/${domain}/serviceInfos`);
      return {
        expiration: formatDate(info.expiration),
        price: "9,99 € HT",
        renewable: !info.renew?.deleteAtExpiration,
      };
    } catch {
      return { expiration: "-", price: "-", renewable: false };
    }
  }

  async batchRenew(domains: string[], duration: number): Promise<void> {
    await Promise.all(
      domains.map((domain) =>
        ovhApi.post(`/domain/${domain}/renew`, { duration })
      )
    );
  }

  // -------- EXPORT CSV --------
  async exportCsv(domains: string[], fields: string[]): Promise<string> {
    const header = fields.join(";");
    const rows: string[] = [header];

    for (const domain of domains) {
      const values: string[] = [];
      for (const field of fields) {
        switch (field) {
          case "domain":
            values.push(domain);
            break;
          case "expiration":
            try {
              const info = await ovhApi.get<any>(`/domain/${domain}/serviceInfos`);
              values.push(formatDate(info.expiration));
            } catch {
              values.push("-");
            }
            break;
          case "status":
            values.push("active");
            break;
          default:
            values.push("-");
        }
      }
      rows.push(values.join(";"));
    }

    return rows.join("\n");
  }
}

export const alldomService = new AlldomService();
