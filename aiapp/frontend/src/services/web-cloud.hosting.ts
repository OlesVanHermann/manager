// ============================================================
// WEB-CLOUD HOSTING SERVICE - API hébergements web
// ============================================================

import { apiClient } from "./api";

// ============ TYPES ============

export interface Hosting {
  serviceName: string;
  displayName?: string;
  offer: string;
  state: "active" | "bloqued" | "maintenance";
  cluster: string;
  hostingIp: string;
  hostingIpv6?: string;
  operatingSystem: string;
  home: string;
  primaryLogin?: string;
  quotaSize?: { value: number; unit: string };
  quotaUsed?: { value: number; unit: string };
  hasCdn?: boolean;
  hasHostedSsl?: boolean;
  boostOffer?: string;
  serviceManagementAccess?: {
    ftp?: { url: string; port: number };
    ssh?: { url: string; port: number };
    http?: { url: string; port: number };
  };
}

export interface HostingServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  renew?: { automatic: boolean; period?: string };
}

export interface AttachedDomain {
  domain: string;
  path: string;
  ssl?: boolean;
  cdn?: string;
  firewall?: string;
  status?: string;
  ownLog?: string;
  ipv4?: string;
  ipv6?: string;
  git?: { status?: string; url?: string };
  runtimeId?: number;
}

export interface FtpUser {
  login: string;
  home: string;
  state: string;
  isPrimaryAccount?: boolean;
  serviceManagementCredentials?: {
    ftp?: boolean;
    ssh?: boolean;
  };
}

export interface Database {
  name: string;
  user: string;
  server?: string;
  type?: string;
  version?: string;
  state?: string;
  status?: string;
  quotaSize?: { value: number; unit: string };
  quotaUsed?: { value: number; unit: string };
  dumpCount?: number;
  port?: number;
  guiURL?: string;
}

export interface Module {
  id: number;
  moduleId: string;
  path: string;
  targetUrl?: string;
  adminName?: string;
  adminFolder?: string;
  language?: string;
  version?: string;
  status?: string;
  creationDate?: string;
}

export interface Cron {
  id: number;
  command: string;
  frequency: string;
  language: string;
  email?: string;
  status: string;
  description?: string;
}

export interface EnvVar {
  key: string;
  value: string;
  type: string;
  status?: string;
}

export interface Runtime {
  id: number;
  name?: string;
  type: string;
  version?: string;
  publicDir?: string;
  status?: string;
  isDefault?: boolean;
  appBootstrap?: string;
  appEnv?: string;
}

export interface SslCertificate {
  status: string;
  provider?: string;
  type?: string;
  isReportable?: boolean;
  regenerable?: boolean;
  creationDate?: string;
  expirationDate?: string;
}

export interface HostingTask {
  id: number;
  function: string;
  status: string;
  startDate: string;
  doneDate?: string;
  lastUpdate?: string;
  objectId?: string;
  objectType?: string;
}

export interface LocalSeoAccount {
  id: number;
  name: string;
  offer?: string;
  status?: string;
  country?: string;
  creationDate?: string;
}

// ============ SERVICE ============

class HostingService {
  private basePath = "/hosting/web";

  // ---------- HOSTINGS ----------
  async listHostings(): Promise<string[]> {
    return apiClient.get<string[]>(this.basePath);
  }

  async getHosting(serviceName: string): Promise<Hosting> {
    return apiClient.get<Hosting>(`${this.basePath}/${serviceName}`);
  }

  async getServiceInfos(serviceName: string): Promise<HostingServiceInfos> {
    return apiClient.get<HostingServiceInfos>(`${this.basePath}/${serviceName}/serviceInfos`);
  }

  // ---------- ATTACHED DOMAINS (MULTISITE) ----------
  async listAttachedDomains(serviceName: string): Promise<string[]> {
    return apiClient.get<string[]>(`${this.basePath}/${serviceName}/attachedDomain`);
  }

  async getAttachedDomain(serviceName: string, domain: string): Promise<AttachedDomain> {
    return apiClient.get<AttachedDomain>(`${this.basePath}/${serviceName}/attachedDomain/${encodeURIComponent(domain)}`);
  }

  async createAttachedDomain(serviceName: string, data: Partial<AttachedDomain>): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/attachedDomain`, data);
  }

  async updateAttachedDomain(serviceName: string, domain: string, data: Partial<AttachedDomain>): Promise<void> {
    return apiClient.put(`${this.basePath}/${serviceName}/attachedDomain/${encodeURIComponent(domain)}`, data);
  }

  async deleteAttachedDomain(serviceName: string, domain: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${serviceName}/attachedDomain/${encodeURIComponent(domain)}`);
  }

  // ---------- FTP USERS ----------
  async listFtpUsers(serviceName: string): Promise<string[]> {
    return apiClient.get<string[]>(`${this.basePath}/${serviceName}/user`);
  }

  async getFtpUser(serviceName: string, login: string): Promise<FtpUser> {
    return apiClient.get<FtpUser>(`${this.basePath}/${serviceName}/user/${encodeURIComponent(login)}`);
  }

  async createFtpUser(serviceName: string, data: { login: string; password: string; home?: string; sshState?: string }): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/user`, data);
  }

  async deleteFtpUser(serviceName: string, login: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${serviceName}/user/${encodeURIComponent(login)}`);
  }

  async changeFtpUserPassword(serviceName: string, login: string, password: string): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/user/${encodeURIComponent(login)}/changePassword`, { password });
  }

  // ---------- DATABASES ----------
  async listDatabases(serviceName: string): Promise<string[]> {
    return apiClient.get<string[]>(`${this.basePath}/${serviceName}/database`);
  }

  async getDatabase(serviceName: string, name: string): Promise<Database> {
    return apiClient.get<Database>(`${this.basePath}/${serviceName}/database/${encodeURIComponent(name)}`);
  }

  async createDatabase(serviceName: string, data: { type: string; user: string; password: string; version?: string }): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/database`, data);
  }

  async deleteDatabase(serviceName: string, name: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${serviceName}/database/${encodeURIComponent(name)}`);
  }

  async getDatabaseDumps(serviceName: string, name: string): Promise<number[]> {
    return apiClient.get<number[]>(`${this.basePath}/${serviceName}/database/${encodeURIComponent(name)}/dump`);
  }

  async createDatabaseDump(serviceName: string, name: string, data?: { date?: string; sendEmail?: boolean }): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/database/${encodeURIComponent(name)}/dump`, data || {});
  }

  async restoreDatabaseDump(serviceName: string, name: string, dumpId: number): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/database/${encodeURIComponent(name)}/dump/${dumpId}/restore`, {});
  }

  // ---------- MODULES ----------
  async listModules(serviceName: string): Promise<number[]> {
    return apiClient.get<number[]>(`${this.basePath}/${serviceName}/module`);
  }

  async getModule(serviceName: string, id: number): Promise<Module> {
    return apiClient.get<Module>(`${this.basePath}/${serviceName}/module/${id}`);
  }

  async installModule(serviceName: string, data: { moduleId: number; domain: string; path: string; adminName?: string; adminPassword?: string; language?: string }): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/module`, data);
  }

  async deleteModule(serviceName: string, id: number): Promise<void> {
    return apiClient.delete(`${this.basePath}/${serviceName}/module/${id}`);
  }

  // ---------- CRON ----------
  async listCrons(serviceName: string): Promise<number[]> {
    return apiClient.get<number[]>(`${this.basePath}/${serviceName}/cron`);
  }

  async getCron(serviceName: string, id: number): Promise<Cron> {
    return apiClient.get<Cron>(`${this.basePath}/${serviceName}/cron/${id}`);
  }

  async createCron(serviceName: string, data: Partial<Cron>): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/cron`, data);
  }

  async updateCron(serviceName: string, id: number, data: Partial<Cron>): Promise<void> {
    return apiClient.put(`${this.basePath}/${serviceName}/cron/${id}`, data);
  }

  async deleteCron(serviceName: string, id: number): Promise<void> {
    return apiClient.delete(`${this.basePath}/${serviceName}/cron/${id}`);
  }

  // ---------- ENVVARS ----------
  async listEnvVars(serviceName: string): Promise<string[]> {
    return apiClient.get<string[]>(`${this.basePath}/${serviceName}/envVar`);
  }

  async getEnvVar(serviceName: string, key: string): Promise<EnvVar> {
    return apiClient.get<EnvVar>(`${this.basePath}/${serviceName}/envVar/${encodeURIComponent(key)}`);
  }

  async createEnvVar(serviceName: string, data: { key: string; value: string; type: string }): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/envVar`, data);
  }

  async deleteEnvVar(serviceName: string, key: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${serviceName}/envVar/${encodeURIComponent(key)}`);
  }

  // ---------- RUNTIMES ----------
  async listRuntimes(serviceName: string): Promise<number[]> {
    return apiClient.get<number[]>(`${this.basePath}/${serviceName}/runtime`);
  }

  async getRuntime(serviceName: string, id: number): Promise<Runtime> {
    return apiClient.get<Runtime>(`${this.basePath}/${serviceName}/runtime/${id}`);
  }

  async createRuntime(serviceName: string, data: Partial<Runtime>): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/runtime`, data);
  }

  async deleteRuntime(serviceName: string, id: number): Promise<void> {
    return apiClient.delete(`${this.basePath}/${serviceName}/runtime/${id}`);
  }

  async setDefaultRuntime(serviceName: string, id: number): Promise<void> {
    return apiClient.put(`${this.basePath}/${serviceName}/runtime/${id}`, { isDefault: true });
  }

  // ---------- SSL ----------
  async getSsl(serviceName: string): Promise<SslCertificate | null> {
    try {
      return await apiClient.get<SslCertificate>(`${this.basePath}/${serviceName}/ssl`);
    } catch {
      return null;
    }
  }

  async deleteSsl(serviceName: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${serviceName}/ssl`);
  }

  async regenerateSsl(serviceName: string): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/ssl/regenerate`, {});
  }

  async enableSsl(serviceName: string, domain: string): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/attachedDomain/${encodeURIComponent(domain)}/ssl`, {});
  }

  async disableSsl(serviceName: string, domain: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${serviceName}/attachedDomain/${encodeURIComponent(domain)}/ssl`);
  }

  async importSsl(serviceName: string, data: { certificate: string; key: string; chain?: string }): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/ssl`, data);
  }

  // ---------- CDN ----------
  async flushCdn(serviceName: string): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/cdn/flush`, {});
  }

  // ---------- TASKS ----------
  async listTasks(serviceName: string): Promise<number[]> {
    return apiClient.get<number[]>(`${this.basePath}/${serviceName}/tasks`);
  }

  async getTask(serviceName: string, id: number): Promise<HostingTask> {
    return apiClient.get<HostingTask>(`${this.basePath}/${serviceName}/tasks/${id}`);
  }

  // ---------- LOCAL SEO ----------
  async listLocalSeoAccounts(serviceName: string): Promise<number[]> {
    return apiClient.get<number[]>(`${this.basePath}/${serviceName}/localSeo/account`);
  }

  async getLocalSeoAccount(serviceName: string, id: number): Promise<LocalSeoAccount> {
    return apiClient.get<LocalSeoAccount>(`${this.basePath}/${serviceName}/localSeo/account/${id}`);
  }

  async terminateLocalSeo(serviceName: string, id: number): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/localSeo/account/${id}/terminate`, {});
  }

  // ---------- AUTOMATED EMAILS ----------
  async getAutomatedEmails(serviceName: string): Promise<{ state: string; email?: string }> {
    return apiClient.get(`${this.basePath}/${serviceName}/automatedEmails`);
  }

  async updateAutomatedEmails(serviceName: string, data: { email: string }): Promise<void> {
    return apiClient.put(`${this.basePath}/${serviceName}/automatedEmails`, data);
  }
}

export const hostingService = new HostingService();

// ============================================================
// ADDITIONAL API METHODS - Phase A Complete
// ============================================================

// SSL Methods
export const sslMethods = {
  regenerateSsl: (serviceName: string) => 
    apiFetch<void>(`/hosting/web/${serviceName}/ssl/regenerate`, { method: 'POST' }),
  deleteSsl: (serviceName: string) => 
    apiFetch<void>(`/hosting/web/${serviceName}/ssl`, { method: 'DELETE' }),
  activateSslForDomain: (serviceName: string, domain: string) => 
    apiFetch<void>(`/hosting/web/${serviceName}/attachedDomain/${encodeURIComponent(domain)}/ssl`, { method: 'POST' }),
};

// Attached Domain Methods
export const attachedDomainMethods = {
  updateAttachedDomain: (serviceName: string, domain: string, data: any) => 
    apiFetch<void>(`/hosting/web/${serviceName}/attachedDomain/${encodeURIComponent(domain)}`, { method: 'PUT', body: JSON.stringify(data) }),
  getDomainDigStatus: (serviceName: string, domain: string) => 
    apiFetch<{ ipv4: boolean; ipv6: boolean; cname: boolean }>(`/hosting/web/${serviceName}/attachedDomain/${encodeURIComponent(domain)}/digStatus`),
  restartAttachedDomain: (serviceName: string, domain: string) => 
    apiFetch<void>(`/hosting/web/${serviceName}/attachedDomain/${encodeURIComponent(domain)}/restart`, { method: 'POST' }),
};

// Cron Methods
export const cronMethods = {
  updateCron: (serviceName: string, cronId: number, data: any) => 
    apiFetch<void>(`/hosting/web/${serviceName}/cron/${cronId}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// EnvVar Methods
export const envvarMethods = {
  updateEnvVar: (serviceName: string, key: string, data: { value: string }) => 
    apiFetch<void>(`/hosting/web/${serviceName}/envVar/${encodeURIComponent(key)}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Runtime Methods
export const runtimeMethods = {
  updateRuntime: (serviceName: string, runtimeId: number, data: any) => 
    apiFetch<void>(`/hosting/web/${serviceName}/runtime/${runtimeId}`, { method: 'PUT', body: JSON.stringify(data) }),
  setDefaultRuntime: (serviceName: string, runtimeId: number) => 
    apiFetch<void>(`/hosting/web/${serviceName}/runtime/${runtimeId}/setDefault`, { method: 'POST' }),
};

// CDN Methods
export const cdnMethods = {
  getCdnInfo: (serviceName: string) => 
    apiFetch<any>(`/hosting/web/${serviceName}/cdn`),
  flushCdnCache: (serviceName: string) => 
    apiFetch<void>(`/hosting/web/${serviceName}/cdn/flush`, { method: 'POST' }),
};

// Boost Methods
export const boostMethods = {
  getBoostInfo: (serviceName: string) => 
    apiFetch<any>(`/hosting/web/${serviceName}/boostInfo`),
  deactivateBoost: (serviceName: string) => 
    apiFetch<void>(`/hosting/web/${serviceName}/boost/deactivate`, { method: 'POST' }),
};

// LocalSeo Methods
export const localSeoMethods = {
  listLocalSeo: (serviceName: string) => 
    apiFetch<string[]>(`/hosting/web/${serviceName}/localSeo`),
  getLocalSeo: (serviceName: string, id: string) => 
    apiFetch<any>(`/hosting/web/${serviceName}/localSeo/${id}`),
  terminateLocalSeo: (serviceName: string, id: string) => 
    apiFetch<void>(`/hosting/web/${serviceName}/localSeo/${id}/terminate`, { method: 'POST' }),
};

// Merge all methods into hostingService
Object.assign(hostingService, sslMethods, attachedDomainMethods, cronMethods, envvarMethods, runtimeMethods, cdnMethods, boostMethods, localSeoMethods);
