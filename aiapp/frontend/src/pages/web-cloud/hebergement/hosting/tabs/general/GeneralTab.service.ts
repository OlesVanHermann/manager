// ============================================================
// GENERAL TAB SERVICE - API calls for GeneralTab
// ============================================================

import { ovhGet, ovhPost, ovhPut } from "../../../../../../services/api";
import type { Hosting, AttachedDomain, FtpUser, SslCertificate } from "../../hosting.types";

const BASE = "/hosting/web";

export const generalService = {
  // --- Hosting ---
  listHostings: () => 
    ovhGet<string[]>(BASE),

  getHosting: (sn: string) => 
    ovhGet<Hosting>(`${BASE}/${sn}`),

  updateHosting: (sn: string, data: Partial<Hosting>) => 
    ovhPut<void>(`${BASE}/${sn}`, data),

  getServiceInfos: (sn: string) => 
    ovhGet<any>(`${BASE}/${sn}/serviceInfos`),

  // --- Attached Domains ---
  listAttachedDomains: (sn: string) => 
    ovhGet<string[]>(`${BASE}/${sn}/attachedDomain`),

  updateAttachedDomain: (sn: string, domain: string, data: Partial<AttachedDomain>) => 
    ovhPut<void>(`${BASE}/${sn}/attachedDomain/${domain}`, data),

  // --- Users ---
  listUsers: (sn: string) => 
    ovhGet<string[]>(`${BASE}/${sn}/user`),

  getUser: (sn: string, login: string) => 
    ovhGet<FtpUser>(`${BASE}/${sn}/user/${login}`),

  updateUser: (sn: string, login: string, data: Partial<FtpUser>) => 
    ovhPut<void>(`${BASE}/${sn}/user/${login}`, data),

  // --- Databases ---
  listDatabases: (sn: string) => 
    ovhGet<string[]>(`${BASE}/${sn}/database`),

  // --- Crons ---
  listCrons: (sn: string) => 
    ovhGet<number[]>(`${BASE}/${sn}/cron`),

  // --- Modules ---
  listModules: (sn: string) => 
    ovhGet<number[]>(`${BASE}/${sn}/module`),

  // --- SSL ---
  getSsl: (sn: string) => 
    ovhGet<SslCertificate>(`${BASE}/${sn}/ssl`).catch(() => null),

  regenerateSsl: (sn: string) => 
    ovhPost<void>(`${BASE}/${sn}/ssl/regenerate`, {}),

  // --- OvhConfig ---
  getOvhConfig: async (sn: string) => {
    const ids = await ovhGet<number[]>(`${BASE}/${sn}/ovhConfig`);
    return ids.length > 0 ? ovhGet<any>(`${BASE}/${sn}/ovhConfig/${ids[0]}`) : null;
  },

  updateOvhConfig: async (sn: string, config: any) => {
    const ids = await ovhGet<number[]>(`${BASE}/${sn}/ovhConfig`);
    if (ids.length === 0) throw new Error("No ovhConfig found");
    return ovhPut<void>(`${BASE}/${sn}/ovhConfig/${ids[0]}`, config);
  },

  getAvailablePhpVersions: (sn: string) => 
    ovhGet<string[]>(`${BASE}/${sn}/ovhConfig/availableVersions`).catch(() => ["7.4", "8.0", "8.1", "8.2", "8.3"]),

  // --- Statistics ---
  getStatistics: (sn: string) => 
    ovhGet<any>(`${BASE}/${sn}/statistics`).catch(() => null),

  // --- Indys (IP dédiées) ---
  getIndys: (sn: string) => 
    ovhGet<any[]>(`${BASE}/${sn}/indy`).catch(() => []),

  // --- Upgrade ---
  getAvailableOffers: (sn: string) => 
    ovhGet<any[]>(`${BASE}/${sn}/availableOffer`).catch(() => []),

  orderUpgrade: (sn: string, offer: string) => 
    ovhPost<any>(`/order/cartServiceOption/webHosting/${sn}`, { planCode: offer, quantity: 1 }),

  // --- Migration ---
  migrateOvhOrg: (sn: string, destination: string) => 
    ovhPost<void>(`${BASE}/${sn}/migrateMyOvhOrg`, { destination }),
};

export default generalService;
