// ============================================================
// GENERAL TAB SERVICE - API calls for GeneralTab
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete, ovh2apiGet } from "../../../../../services/api";
import type { Hosting, AttachedDomain, FtpUser, SslCertificate } from "../../hosting.types";

const BASE = "/hosting/web";

// ============ 2API TYPES ============
export interface HostingDashboard2API {
  offer: string;
  primaryLogin: string;
  state: string;
  cluster: string;
  clusterIp: string;
  clusterIpv6: string;
  filer: string;
  datacenter: string;
  trafficQuotaSize: { value: number; unit: string };
  trafficQuotaUsed: { value: number; unit: string };
  quotaSize: { value: number; unit: string };
  quotaUsed: { value: number; unit: string };
  databaseCount: number;
  databaseQuota: number;
  userCount: number;
  userQuota: number;
  cronCount: number;
  cronQuota: number;
  moduleCount: number;
  moduleQuota: number;
  isCloudWeb: boolean;
}

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

  // --- OvhConfig (from old_manager hosting-ovhconfig.service.js) ---

  // Get current config
  getOvhConfig: async (sn: string) => {
    const ids = await ovhGet<number[]>(`${BASE}/${sn}/ovhConfig`, {
      params: { historical: false },
    } as any);
    return ids.length > 0 ? ovhGet<any>(`${BASE}/${sn}/ovhConfig/${ids[0]}`) : null;
  },

  // Get config by ID
  getOvhConfigById: (sn: string, configId: number) =>
    ovhGet<any>(`${BASE}/${sn}/ovhConfig/${configId}`),

  // Get config IDs (with optional historical and path params)
  getOvhConfigIds: (sn: string, historical?: boolean, path = "") =>
    ovhGet<number[]>(`${BASE}/${sn}/ovhConfig`, {
      params: {
        ...(historical !== undefined && { historical }),
        ...(path && { path }),
      },
    } as any),

  // Get all configs
  getAllOvhConfigs: async (sn: string) => {
    const ids = await ovhGet<number[]>(`${BASE}/${sn}/ovhConfig`, {
      params: { historical: false },
    } as any);
    return Promise.all(ids.map((id: number) => ovhGet<any>(`${BASE}/${sn}/ovhConfig/${id}`)));
  },

  // Get config history
  getOvhConfigHistory: async (sn: string) => {
    const ids = await ovhGet<number[]>(`${BASE}/${sn}/ovhConfig`, {
      params: { historical: true },
    } as any);
    return Promise.all(ids.map((id: number) => ovhGet<any>(`${BASE}/${sn}/ovhConfig/${id}`)));
  },

  // Get OvhConfig capabilities
  getOvhConfigCapabilities: (sn: string) =>
    ovhGet<any>(`${BASE}/${sn}/ovhConfigCapabilities`),

  // Sync API with host (manual modification via FTP)
  ovhConfigRefresh: (sn: string) =>
    ovhPost<void>(`${BASE}/${sn}/ovhConfigRefresh`, {}),

  // Change configuration
  changeOvhConfiguration: (sn: string, configId: number, data: {
    container?: string;
    engineName?: string;
    engineVersion?: string;
    environment?: string;
    fileUpload?: number;
    http2?: boolean;
    httpFirewall?: string;
    sendMail?: string;
  }) =>
    ovhPost<void>(`${BASE}/${sn}/ovhConfig/${configId}/changeConfiguration`, data),

  // Rollback to previous config
  rollbackOvhConfig: (sn: string, configId: number, rollbackId: number) =>
    ovhPost<void>(`${BASE}/${sn}/ovhConfig/${configId}/rollback`, { rollbackId }),

  // Available PHP versions
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

  orderUpgradeCart: (sn: string, offer: string) =>
    ovhPost<any>(`/order/cartServiceOption/webHosting/${sn}`, { planCode: offer, quantity: 1 }),

  // --- Migration (from old_manager - param is destinationServiceName) ---
  migrateOvhOrg: (sn: string, destinationServiceName: string) =>
    ovhPost<void>(`${BASE}/${sn}/migrateMyOvhOrg`, { destinationServiceName }),

  // ============ 2API ENDPOINTS (from old_manager) ============

  // Dashboard agrégé - GET /sws/hosting/web/${sn}
  getDashboard2API: (sn: string) =>
    ovh2apiGet<HostingDashboard2API>(`/sws/hosting/web/${sn}`),

  // Liste domaines paginée - GET /sws/hosting/web/${sn}/domains
  getTabDomains2API: (sn: string, count = 25, offset = 0, search?: string) =>
    ovh2apiGet<{ list: any[]; count: number }>(`/sws/hosting/web/${sn}/domains`, {
      count,
      offset,
      ...(search && { search }),
    }),

  // Liste FTP paginée - GET /sws/hosting/web/${sn}/ftp
  getTabFTP2API: (sn: string, count = 25, offset = 0, needUsers = true, search?: string) =>
    ovh2apiGet<{ list: any[]; count: number; ftpUrl: string; sftpUrl: string }>(`/sws/hosting/web/${sn}/ftp`, {
      count,
      offset,
      needUsers: needUsers ? 1 : 0,
      ...(search && { search }),
    }),

  // ============ APIv6 MANQUANTS (from old_manager) ============

  // Models API
  getModels: () =>
    ovhGet<any>(`${BASE}.json`),

  // Own Logs
  getOwnLogs: (sn: string, fqdn?: string) =>
    ovhGet<number[]>(`${BASE}/${sn}/ownLogs`, { params: fqdn ? { fqdn } : undefined } as any).catch(() => []),

  getUserLogs: (sn: string, ownLogId: number) =>
    ovhGet<string[]>(`${BASE}/${sn}/ownLogs/${ownLogId}/userLogs`),

  getUserLogsEntry: (sn: string, ownLogId: number, login: string) =>
    ovhGet<any>(`${BASE}/${sn}/ownLogs/${ownLogId}/userLogs/${login}`),

  getUserLogsToken: (sn: string, params?: { remoteCheck?: boolean; ttl?: number }) =>
    ovhGet<string>(`${BASE}/${sn}/userLogsToken`),

  createUserLogs: (sn: string, ownLogId: number, data: { description: string; login: string; password: string }) =>
    ovhPost<void>(`${BASE}/${sn}/ownLogs/${ownLogId}/userLogs`, data),

  deleteUserLogs: (sn: string, ownLogId: number, login: string) =>
    ovhDelete<void>(`${BASE}/${sn}/ownLogs/${ownLogId}/userLogs/${login}`),

  // Update user logs entry (from old_manager - MANQUANT)
  updateUserLogs: (sn: string, ownLogId: number, login: string, data: { description?: string }) =>
    ovhPut<void>(`${BASE}/${sn}/ownLogs/${ownLogId}/userLogs/${login}`, data),

  changeUserLogsPassword: (sn: string, ownLogId: number, login: string, password: string) =>
    ovhPost<void>(`${BASE}/${sn}/ownLogs/${ownLogId}/userLogs/${login}/changePassword`, { password }),

  // Abuse state
  getAbuseState: (sn: string) =>
    ovhGet<{ state: string; ticket?: number }>(`${BASE}/${sn}/abuseState`).catch(() => null),

  // Email options
  getEmailOptions: async (sn: string) => {
    const ids = await ovhGet<number[]>(`${BASE}/${sn}/emailOption`).catch(() => []);
    return Promise.all(ids.map(id => ovhGet<any>(`${BASE}/${sn}/emailOption/${id}`)));
  },

  terminateEmailOption: (sn: string, id: number) =>
    ovhPost<void>(`${BASE}/${sn}/emailOption/${id}/terminate`, {}),

  // Offer capabilities
  getOfferCapabilities: (offer: string) =>
    ovhGet<any>(`/hosting/web/offerCapabilities`, { params: { offer } } as any),

  getAvailableOffer: (sn: string) =>
    ovhGet<string[]>(`/hosting/web/availableOffer`, { params: { domain: sn } } as any).catch(() => []),

  // Terminate
  terminate: (sn: string) =>
    ovhPost<void>(`${BASE}/${sn}/terminate`, {}),

  // Catalog
  getCatalog: (ovhSubsidiary: string) =>
    ovhGet<any>(`/order/catalog/public/webHosting`, { params: { ovhSubsidiary } } as any),

  // ============ UPGRADE APIs (from old_manager) ============

  // Get upgrade prices for a plan
  getUpgradePrices: (sn: string, planCode: string) =>
    ovhGet<{
      order: { price: { value: number; text: string } };
      contracts: Array<{ name: string; url: string }>;
    }>(`/order/upgrade/webHosting/${sn}/${planCode}`),

  // Order upgrade
  orderUpgrade: (sn: string, planCode: string, autoPayWithPreferredPaymentMethod = false) =>
    ovhPost<{ orderId: number; url: string }>(`/order/upgrade/webHosting/${sn}/${planCode}`, {
      autoPayWithPreferredPaymentMethod,
    }),

  // Get available upgrade plans
  getAvailableUpgrades: (sn: string) =>
    ovhGet<string[]>(`/order/upgrade/webHosting/${sn}`).catch(() => []),

  // ============ DOMAIN SERVICE INFO (for START_10_M) ============

  // Get domain service info (needed for START_10_M offers linked to domain)
  getDomainServiceInfos: (domain: string) =>
    ovhGet<{
      serviceId: number;
      domain: string;
      status: string;
      expiration: string;
      renew: { automatic: boolean; forced: boolean; period?: string };
    }>(`/domain/${domain}/serviceInfos`).catch(() => null),

  // ============ FLUSH CACHE ============

  // Request action: FLUSH_CACHE (from old_manager)
  flushCache: (sn: string) =>
    ovhPost<void>(`${BASE}/${sn}/request`, { action: "FLUSH_CACHE" }),
};

export default generalService;
