// ============================================================
// SERVICE: Web Cloud Hosting - Complete API
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "./api";

// ============================================================
// TYPES
// ============================================================

export interface Hosting {
  serviceName: string;
  displayName?: string;
  offer: string;
  state: string;
  cluster?: string;
  datacenter?: string;
  primaryLogin?: string;
  quotaSize?: { value: number; unit: string };
  quotaUsed?: { value: number; unit: string };
  boostOffer?: string;
  hasCdn?: boolean;
  hostingIp?: string;
  hostingIpv6?: string;
  phpVersion?: string;
  sslState?: string;
}

export interface HostingInfo extends Hosting {}

export interface Database {
  name: string;
  user: string;
  server: string;
  port: number;
  type: string;
  version: string;
  state: string;
  quotaSize?: { value: number; unit: string };
  quotaUsed?: { value: number; unit: string };
}

export interface FtpUser {
  login: string;
  home: string;
  isPrimaryAccount: boolean;
  state: string;
  sshState?: string;
}

export interface AttachedDomain {
  domain: string;
  path: string;
  ssl: boolean;
  cdn?: string;
  firewall?: string;
  git?: boolean;
  ownLog?: string;
  ipv6?: boolean;
  status?: string;
}

export interface CronJob {
  id: number;
  command: string;
  frequency: string;
  language: string;
  status: string;
  description?: string;
  email?: string;
}

export interface Cron extends CronJob {}

export interface EnvVar {
  key: string;
  value: string;
  type?: string;
}

export interface Runtime {
  id: number;
  name?: string;
  type?: string;
  publicDir?: string;
  appEnv?: string;
  isDefault?: boolean;
}

export interface Module {
  id: number;
  moduleId?: number;
  path?: string;
  version?: string;
  adminName?: string;
  adminFolder?: string;
  targetUrl?: string;
}

export interface SslCertificate {
  domain?: string;
  provider?: string;
  type?: string;
  status?: string;
  creationDate?: string;
  expirationDate?: string;
  subjects?: string[];
}

export interface SslInfo extends SslCertificate {}

export interface HostingTask {
  id: number;
  function: string;
  status: string;
  startDate: string;
  doneDate?: string;
}

export interface UserLogs {
  login: string;
  description?: string;
  state?: string;
  creationDate?: string;
}

export interface OwnLog {
  id: number;
  fqdn: string;
  status: string;
}

// ============================================================
// SERVICE OBJECT
// ============================================================

export const hostingService = {
  // --- HOSTING ---
  listHostings: () => ovhGet<string[]>("/hosting/web"),
  getHosting: (sn: string) => ovhGet<Hosting>(`/hosting/web/${sn}`),
  getHostingInfo: (sn: string) => ovhGet<HostingInfo>(`/hosting/web/${sn}`),
  updateHosting: (sn: string, data: Partial<Hosting>) => ovhPut<void>(`/hosting/web/${sn}`, data),
  updateHostingInfo: (sn: string, data: Partial<HostingInfo>) => ovhPut<void>(`/hosting/web/${sn}`, data),
  getServiceInfos: (sn: string) => ovhGet<any>(`/hosting/web/${sn}/serviceInfos`),

  // --- ATTACHED DOMAINS ---
  listAttachedDomains: (sn: string) => ovhGet<string[]>(`/hosting/web/${sn}/attachedDomain`),
  getAttachedDomain: (sn: string, d: string) => ovhGet<AttachedDomain>(`/hosting/web/${sn}/attachedDomain/${d}`),
  createAttachedDomain: (sn: string, data: Partial<AttachedDomain>) => ovhPost<void>(`/hosting/web/${sn}/attachedDomain`, data),
  updateAttachedDomain: (sn: string, d: string, data: Partial<AttachedDomain>) => ovhPut<void>(`/hosting/web/${sn}/attachedDomain/${d}`, data),
  deleteAttachedDomain: (sn: string, d: string) => ovhDelete<void>(`/hosting/web/${sn}/attachedDomain/${d}`),

  // --- DATABASES ---
  listDatabases: (sn: string) => ovhGet<string[]>(`/hosting/web/${sn}/database`),
  getDatabase: (sn: string, name: string) => ovhGet<Database>(`/hosting/web/${sn}/database/${name}`),
  createDatabase: (sn: string, data: any) => ovhPost<void>(`/hosting/web/${sn}/database`, data),
  deleteDatabase: (sn: string, name: string) => ovhDelete<void>(`/hosting/web/${sn}/database/${name}`),
  dumpDatabase: (sn: string, name: string, date = "now", sendEmail?: boolean) => 
    ovhPost<void>(`/hosting/web/${sn}/database/${name}/dump`, { date, sendEmail }),
  restoreDatabase: (sn: string, name: string, dumpId: string) => 
    ovhPost<void>(`/hosting/web/${sn}/database/${name}/restore`, { dumpId }),
  importDatabase: (sn: string, name: string, url: string, sendEmail?: boolean) => 
    ovhPost<void>(`/hosting/web/${sn}/database/${name}/import`, { documentUrl: url, sendEmail }),
  copyDatabase: (sn: string, src: string, tgt: string, flush: boolean) => 
    ovhPost<void>(`/hosting/web/${sn}/database/${src}/copy`, { flushDestination: flush, destinationDatabaseName: tgt }),
  changeDatabasePassword: (sn: string, name: string, password: string) => 
    ovhPost<void>(`/hosting/web/${sn}/database/${name}/changePassword`, { password }),
  listDatabaseDumps: (sn: string, name: string) => ovhGet<any[]>(`/hosting/web/${sn}/database/${name}/dump`),

  // --- FTP USERS ---
  listFtpUsers: (sn: string) => ovhGet<string[]>(`/hosting/web/${sn}/user`),
  listUsers: (sn: string) => ovhGet<string[]>(`/hosting/web/${sn}/user`),
  getFtpUser: (sn: string, login: string) => ovhGet<FtpUser>(`/hosting/web/${sn}/user/${login}`),
  getUser: (sn: string, login: string) => ovhGet<FtpUser>(`/hosting/web/${sn}/user/${login}`),
  createFtpUser: (sn: string, data: any) => ovhPost<void>(`/hosting/web/${sn}/user`, data),
  updateFtpUser: (sn: string, login: string, data: Partial<FtpUser>) => ovhPut<void>(`/hosting/web/${sn}/user/${login}`, data),
  updateUser: (sn: string, login: string, data: Partial<FtpUser>) => ovhPut<void>(`/hosting/web/${sn}/user/${login}`, data),
  deleteFtpUser: (sn: string, login: string) => ovhDelete<void>(`/hosting/web/${sn}/user/${login}`),
  changeFtpPassword: (sn: string, login: string, password: string) => 
    ovhPost<void>(`/hosting/web/${sn}/user/${login}/changePassword`, { password }),
  changeUserPassword: (sn: string, login: string, password: string) => 
    ovhPost<void>(`/hosting/web/${sn}/user/${login}/changePassword`, { password }),

  // --- SSL ---
  getSsl: (sn: string) => ovhGet<SslCertificate>(`/hosting/web/${sn}/ssl`).catch(() => null),
  getSslInfo: (sn: string) => ovhGet<SslInfo>(`/hosting/web/${sn}/ssl`).catch(() => null),
  // Pour les hébergements avec multiple SSLs
  getSslDomains: (sn: string) => ovhGet<string[]>(`/hosting/web/${sn}/ssl/domains`).catch(() => []),
  // Récupère les infos SSL de manière robuste (gère multiple SSLs)
  getSslSafe: async (sn: string): Promise<SslCertificate | null> => {
    try {
      return await ovhGet<SslCertificate>(`/hosting/web/${sn}/ssl`);
    } catch (err: any) {
      // Si "multiple SSLs", on retourne null et on utilise les infos des domaines
      return null;
    }
  },
  regenerateSsl: (sn: string) => ovhPost<void>(`/hosting/web/${sn}/ssl/regenerate`, {}),
  deleteSsl: (sn: string) => ovhDelete<void>(`/hosting/web/${sn}/ssl`),
  generateLetsEncrypt: (sn: string) => 
    ovhPost<void>(`/hosting/web/${sn}/ssl`, { type: 'letsEncrypt' }),
  disableSslForDomain: (sn: string, domain: string) => 
    ovhDelete<void>(`/hosting/web/${sn}/attachedDomain/${domain}/ssl`),
  importSsl: (sn: string, certificate: string, key: string, chain?: string) => 
    ovhPost<void>(`/hosting/web/${sn}/ssl`, { certificate, key, chain }),
  orderSsl: (sn: string, type: string, certificate?: string, key?: string, chain?: string) => {
    if (type === 'import' && certificate && key) {
      return ovhPost<void>(`/hosting/web/${sn}/ssl`, { certificate, key, chain });
    }
    return ovhPost<any>(`/order/cartServiceOption/webHosting/${sn}`, { planCode: `ssl-${type.toLowerCase()}`, quantity: 1 });
  },
  orderSectigo: (sn: string, type: string) => 
    ovhPost<any>(`/order/cartServiceOption/webHosting/${sn}`, { planCode: `ssl-${type.toLowerCase()}`, quantity: 1 }),
  activateSslForDomain: (sn: string, domain: string) => 
    ovhPut<void>(`/hosting/web/${sn}/attachedDomain/${domain}`, { ssl: true }),
  activateDomainSsl: (sn: string, domain: string) => 
    ovhPost<void>(`/hosting/web/${sn}/attachedDomain/${domain}/ssl`, {}),
  deactivateDomainSsl: (sn: string, domain: string) => 
    ovhDelete<void>(`/hosting/web/${sn}/attachedDomain/${domain}/ssl`),

  // --- CRON ---
  listCrons: (sn: string) => ovhGet<number[]>(`/hosting/web/${sn}/cron`),
  getCron: (sn: string, id: number) => ovhGet<CronJob>(`/hosting/web/${sn}/cron/${id}`),
  createCron: (sn: string, data: Partial<CronJob>) => ovhPost<void>(`/hosting/web/${sn}/cron`, data),
  updateCron: (sn: string, id: number, data: Partial<CronJob>) => ovhPut<void>(`/hosting/web/${sn}/cron/${id}`, data),
  deleteCron: (sn: string, id: number) => ovhDelete<void>(`/hosting/web/${sn}/cron/${id}`),

  // --- ENV VARS ---
  listEnvVars: (sn: string) => ovhGet<string[]>(`/hosting/web/${sn}/envVar`),
  getEnvVar: (sn: string, key: string) => ovhGet<EnvVar>(`/hosting/web/${sn}/envVar/${key}`),
  createEnvVar: (sn: string, key: string, value: string, type?: string) => 
    ovhPost<void>(`/hosting/web/${sn}/envVar`, { key, value, type }),
  updateEnvVar: (sn: string, key: string, value: string) => 
    ovhPut<void>(`/hosting/web/${sn}/envVar/${key}`, { value }),
  deleteEnvVar: (sn: string, key: string) => ovhDelete<void>(`/hosting/web/${sn}/envVar/${key}`),

  // --- RUNTIMES ---
  listRuntimes: (sn: string) => ovhGet<number[]>(`/hosting/web/${sn}/runtime`),
  getRuntime: (sn: string, id: number) => ovhGet<Runtime>(`/hosting/web/${sn}/runtime/${id}`),
  createRuntime: (sn: string, data: Partial<Runtime>) => ovhPost<void>(`/hosting/web/${sn}/runtime`, data),
  updateRuntime: (sn: string, id: number, data: Partial<Runtime>) => ovhPut<void>(`/hosting/web/${sn}/runtime/${id}`, data),
  deleteRuntime: (sn: string, id: number) => ovhDelete<void>(`/hosting/web/${sn}/runtime/${id}`),
  setDefaultRuntime: (sn: string, id: number) => ovhPut<void>(`/hosting/web/${sn}/runtime/${id}`, { isDefault: true }),

  // --- MODULES ---
  listModules: (sn: string) => ovhGet<number[]>(`/hosting/web/${sn}/module`),
  getModule: (sn: string, id: number) => ovhGet<Module>(`/hosting/web/${sn}/module/${id}`),
  installModule: (sn: string, data: any) => ovhPost<void>(`/hosting/web/${sn}/module`, data),
  deleteModule: (sn: string, id: number) => ovhDelete<void>(`/hosting/web/${sn}/module/${id}`),
  changeModulePassword: (sn: string, id: number, password: string) => 
    ovhPost<void>(`/hosting/web/${sn}/module/${id}/changePassword`, { password }),

  // --- CDN ---
  getCdnInfo: (sn: string) => ovhGet<any>(`/hosting/web/${sn}/cdn`).catch(() => null),
  flushCdnCache: (sn: string) => ovhPost<void>(`/hosting/web/${sn}/cdn/flush`, {}),
  flushDomainCdn: (sn: string, domain: string, purgeType = 'all', pattern = '') => {
    const payload: any = { patternType: purgeType };
    if (purgeType !== 'all' && pattern) payload.pattern = pattern;
    if (domain) payload.domain = domain;
    return ovhPost<void>(`/hosting/web/${sn}/cdn/flush`, payload);
  },
  orderCdn: (sn: string, type: string) => 
    ovhPost<any>(`/order/cartServiceOption/webHosting/${sn}`, { planCode: `cdn-${type}`, quantity: 1 }),

  // --- CDN METHODS (for CdnTab) ---
  flushCdn: (sn: string) => ovhPost<void>(`/hosting/web/${sn}/cdn/flush`, {}),
  flushCdnDomain: (sn: string, domain: string) => ovhPost<void>(`/hosting/web/${sn}/cdn/flush`, { domain }),
  getAttachedDomains: (sn: string) => ovhGet<string[]>(`/hosting/web/${sn}/attachedDomain`),
  getAttachedDomainInfo: (sn: string, domain: string) => ovhGet<any>(`/hosting/web/${sn}/attachedDomain/${domain}`),
  activateCdnDomain: (sn: string, domain: string) => ovhPut<void>(`/hosting/web/${sn}/attachedDomain/${domain}`, { cdn: "active" }),
  deactivateCdnDomain: (sn: string, domain: string) => ovhPut<void>(`/hosting/web/${sn}/attachedDomain/${domain}`, { cdn: "none" }),

  // --- BOOST ---
  getBoostInfo: (sn: string) => ovhGet<any>(`/hosting/web/${sn}/boost`).catch(() => null),
  getBoostHistory: (sn: string) => ovhGet<any[]>(`/hosting/web/${sn}/boostHistory`).catch(() => []),
  getAvailableBoostOffers: (sn: string) => ovhGet<any[]>(`/hosting/web/${sn}/boostHistory`).catch(() => []),
  activateBoost: (sn: string, offer: string) => ovhPost<void>(`/hosting/web/${sn}/requestBoost`, { offer }),
  deactivateBoost: (sn: string) => ovhDelete<void>(`/hosting/web/${sn}/requestBoost`),

  // --- LOCAL SEO ---
  listLocalSeo: (sn: string) => ovhGet<string[]>(`/hosting/web/${sn}/localSeo/location`).catch(() => []),
  getLocalSeo: (sn: string, id: string) => ovhGet<any>(`/hosting/web/${sn}/localSeo/location/${id}`),
  terminateLocalSeo: (sn: string, id: string) => ovhPost<void>(`/hosting/web/${sn}/localSeo/location/${id}/terminate`, {}),
  orderLocalSeo: (sn: string, country: string) => 
    ovhPost<any>(`/order/cartServiceOption/webHosting/${sn}`, { planCode: `localSeo-${country}`, quantity: 1 }),
  loginLocalSeo: (sn: string, id: string) => ovhPost<any>(`/hosting/web/${sn}/localSeo/location/${id}/serviceInfosUpdate`, {}),
  getLocalSeoAccount: (sn: string, id: string) => ovhGet<any>(`/hosting/web/${sn}/localSeo/location/${id}/account`),

  // --- AUTOMATED EMAILS ---
  getAutomatedEmails: (sn: string) => ovhGet<any>(`/hosting/web/${sn}/email`),
  getEmailState: (sn: string) => ovhGet<any>(`/hosting/web/${sn}/email`).catch(() => null),
  updateAutomatedEmails: (sn: string, data: any) => ovhPut<void>(`/hosting/web/${sn}/email`, data),

  // --- EMAIL METHODS (for EmailsTab) ---
  getEmailQuota: (sn: string) => ovhGet<any>(`/hosting/web/${sn}/email`).catch(() => null),
  updateEmailBounce: (sn: string, email: string) => ovhPut<void>(`/hosting/web/${sn}/email`, { bounce: email }),
  updateEmailState: (sn: string, state: string) => ovhPut<void>(`/hosting/web/${sn}/email`, { state }),
  purgeEmails: (sn: string) => ovhPost<void>(`/hosting/web/${sn}/email/request`, { action: "PURGE" }),
  getEmailBounces: (sn: string) => ovhGet<string[]>(`/hosting/web/${sn}/email/bounces`).catch(() => []),
  getEmailMetricsToken: (sn: string) => ovhGet<any>(`/hosting/web/${sn}/metricsToken`).catch(() => null),

  // --- SNAPSHOTS ---
  listSnapshots: async (sn: string) => {
    const dates = await ovhGet<string[]>(`/hosting/web/${sn}/dump`);
    return Promise.all(dates.map(d => ovhGet<any>(`/hosting/web/${sn}/dump/${d}`)));
  },
  restoreSnapshot: (sn: string, date: string) => ovhPost<void>(`/hosting/web/${sn}/restoreSnapshot`, { backup: date }),

  // --- OVHCONFIG ---
  getOvhConfig: async (sn: string) => {
    const ids = await ovhGet<number[]>(`/hosting/web/${sn}/ovhConfig`);
    return ids.length > 0 ? ovhGet<any>(`/hosting/web/${sn}/ovhConfig/${ids[0]}`) : null;
  },
  updateOvhConfig: async (sn: string, config: any) => {
    const ids = await ovhGet<number[]>(`/hosting/web/${sn}/ovhConfig`);
    if (ids.length === 0) throw new Error("No ovhConfig found");
    return ovhPut<void>(`/hosting/web/${sn}/ovhConfig/${ids[0]}`, config);
  },
  getAvailablePhpVersions: (sn: string) => 
    ovhGet<string[]>(`/hosting/web/${sn}/ovhConfig/availableVersions`).catch(() => ["7.4", "8.0", "8.1", "8.2", "8.3"]),

  // --- TASKS ---
  listTasks: (sn: string) => ovhGet<number[]>(`/hosting/web/${sn}/tasks`),
  getTask: (sn: string, id: number) => ovhGet<HostingTask>(`/hosting/web/${sn}/tasks/${id}`),

  // --- USER LOGS ---
  listUserLogs: (sn: string) => ovhGet<string[]>(`/hosting/web/${sn}/userLogs`),
  getUserLogs: (sn: string, login: string) => ovhGet<UserLogs>(`/hosting/web/${sn}/userLogs/${login}`),
  createUserLogs: (sn: string, data: { login: string; password: string; description?: string }) => 
    ovhPost<void>(`/hosting/web/${sn}/userLogs`, data),
  deleteUserLogs: (sn: string, login: string) => ovhDelete<void>(`/hosting/web/${sn}/userLogs/${login}`),
  changeUserLogsPassword: (sn: string, login: string, password: string) => 
    ovhPost<void>(`/hosting/web/${sn}/userLogs/${login}/changePassword`, { password }),

  // --- OWN LOGS ---
  listOwnLogs: (sn: string) => ovhGet<number[]>(`/hosting/web/${sn}/ownLogs`).catch(() => []),
  getOwnLog: (sn: string, id: number) => ovhGet<OwnLog>(`/hosting/web/${sn}/ownLogs/${id}`),
};

export default hostingService;
