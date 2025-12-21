// ============================================================
// SERVICE: Web Hosting - API OVHcloud
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "./api";

// ============================================================
// TYPES
// ============================================================

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
  primaryLogin: string;
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
  status: string;
  renew?: {
    automatic: boolean;
    period?: string;
    forced?: boolean;
  };
}

export interface AttachedDomain {
  domain: string;
  path: string;
  ssl?: boolean;
  cdn?: "active" | "none";
  firewall?: "active" | "none";
  status?: string;
  ownLog?: string;
  runtimeId?: number;
  ipLocation?: string;
}

export interface DigStatus {
  isOk: boolean;
  errors?: string[];
}

export interface FtpUser {
  login: string;
  home: string;
  state: "rw" | "read" | "off";
  isPrimaryAccount?: boolean;
  serviceManagementCredentials?: {
    ftp?: boolean;
    ssh?: boolean;
  };
}

export interface Database {
  name: string;
  type: "mysql" | "postgresql" | "redis";
  version: string;
  server: string;
  user: string;
  port: number;
  status?: string;
  quotaSize?: { value: number; unit: string };
  quotaUsed?: { value: number; unit: string };
}

export interface DatabaseDump {
  id: number;
  creationDate: string;
  deletionDate?: string;
  type: "daily" | "weekly" | "now";
  status: "created" | "creating" | "deleted";
  size?: number;
  url?: string;
}

export interface Cron {
  id: number;
  command: string;
  frequency: string;
  language: string;
  email?: string;
  status: "enabled" | "disabled";
  description?: string;
}

export interface EnvVar {
  key: string;
  value: string;
  type: "string" | "password";
  status?: string;
}

export interface Runtime {
  id: number;
  name: string;
  type: string;
  publicDir?: string;
  appEnv?: string;
  appBootstrap?: string;
  isDefault?: boolean;
  status?: string;
}

export interface Module {
  id: number;
  moduleId: number;
  name?: string;
  adminName?: string;
  adminFolder?: string;
  targetUrl?: string;
  path?: string;
  language?: string;
  creationDate?: string;
  status?: string;
}

export interface SslCertificate {
  provider: "LETSENCRYPT" | "SECTIGO" | "CUSTOM" | "COMODO";
  type: string;
  status: string;
  isReportable?: boolean;
  regenerable?: boolean;
}

export interface CdnStatus {
  active: boolean;
  type?: string;
  status?: string;
}

export interface Task {
  id: number;
  function: string;
  status: "cancelled" | "doing" | "done" | "error" | "init" | "todo";
  startDate?: string;
  doneDate?: string;
  lastUpdate?: string;
  objectId?: string;
  objectType?: string;
}

export interface LocalSeo {
  id: number;
  offer: string;
  country: string;
  status: string;
  creationDate?: string;
}

export interface Email {
  domain: string;
  quota?: { value: number; unit: string };
  bounces?: number;
  state?: string;
}

// ============================================================
// SERVICE
// ============================================================

class HostingService {
  // ---------- HOSTING ----------
  async listHostings(): Promise<string[]> {
    return ovhGet<string[]>("/hosting/web");
  }

  async getHosting(serviceName: string): Promise<Hosting> {
    return ovhGet<Hosting>(`/hosting/web/${serviceName}`);
  }

  async getServiceInfos(serviceName: string): Promise<HostingServiceInfos> {
    return ovhGet<HostingServiceInfos>(`/hosting/web/${serviceName}/serviceInfos`);
  }

  async getAbuseState(serviceName: string): Promise<string> {
    try {
      const data = await ovhGet<{ state: string }>(`/hosting/web/${serviceName}/abuseState`);
      return data.state || "ok";
    } catch {
      return "ok";
    }
  }

  async unblockTcpOut(serviceName: string): Promise<void> {
    await ovhPost(`/hosting/web/${serviceName}/unblockTCPOut`, {});
  }

  // ---------- ATTACHED DOMAINS (MULTISITE) ----------
  async listAttachedDomains(serviceName: string): Promise<string[]> {
    return ovhGet<string[]>(`/hosting/web/${serviceName}/attachedDomain`);
  }

  async getAttachedDomain(serviceName: string, domain: string): Promise<AttachedDomain> {
    return ovhGet<AttachedDomain>(`/hosting/web/${serviceName}/attachedDomain/${domain}`);
  }

  async addAttachedDomain(serviceName: string, data: Partial<AttachedDomain>): Promise<Task> {
    return ovhPost<Task>(`/hosting/web/${serviceName}/attachedDomain`, data);
  }

  async updateAttachedDomain(serviceName: string, domain: string, data: Partial<AttachedDomain>): Promise<void> {
    await ovhPut(`/hosting/web/${serviceName}/attachedDomain/${domain}`, data);
  }

  async deleteAttachedDomain(serviceName: string, domain: string): Promise<Task> {
    return ovhDelete<Task>(`/hosting/web/${serviceName}/attachedDomain/${domain}`);
  }

  async getDigStatus(serviceName: string, domain: string): Promise<DigStatus> {
    try {
      return await ovhGet<DigStatus>(`/hosting/web/${serviceName}/attachedDomain/${domain}/digStatus`);
    } catch {
      return { isOk: true };
    }
  }

  async restartDomain(serviceName: string, domain: string): Promise<Task> {
    return ovhPost<Task>(`/hosting/web/${serviceName}/attachedDomain/${domain}/restart`, {});
  }

  async enableDomainSsl(serviceName: string, domain: string): Promise<Task> {
    return ovhPost<Task>(`/hosting/web/${serviceName}/attachedDomain/${domain}/ssl`, {});
  }

  async disableDomainSsl(serviceName: string, domain: string): Promise<Task> {
    return ovhDelete<Task>(`/hosting/web/${serviceName}/attachedDomain/${domain}/ssl`);
  }

  // ---------- SSL ----------
  async getSsl(serviceName: string): Promise<SslCertificate | null> {
    try {
      return await ovhGet<SslCertificate>(`/hosting/web/${serviceName}/ssl`);
    } catch {
      return null;
    }
  }

  async generateLetsEncrypt(serviceName: string): Promise<Task> {
    return ovhPost<Task>(`/hosting/web/${serviceName}/ssl`, {});
  }

  async importSsl(serviceName: string, data: { certificate: string; key: string; chain?: string }): Promise<Task> {
    return ovhPost<Task>(`/hosting/web/${serviceName}/ssl`, data);
  }

  async regenerateSsl(serviceName: string): Promise<Task> {
    return ovhPost<Task>(`/hosting/web/${serviceName}/ssl/regenerate`, {});
  }

  async deleteSsl(serviceName: string): Promise<Task> {
    return ovhDelete<Task>(`/hosting/web/${serviceName}/ssl`);
  }

  // ---------- FTP USERS ----------
  async listFtpUsers(serviceName: string): Promise<string[]> {
    return ovhGet<string[]>(`/hosting/web/${serviceName}/user`);
  }

  async getFtpUser(serviceName: string, login: string): Promise<FtpUser> {
    return ovhGet<FtpUser>(`/hosting/web/${serviceName}/user/${login}`);
  }

  async createFtpUser(serviceName: string, data: { login: string; password: string; home?: string; sshState?: string }): Promise<Task> {
    return ovhPost<Task>(`/hosting/web/${serviceName}/user`, data);
  }

  async deleteFtpUser(serviceName: string, login: string): Promise<Task> {
    return ovhDelete<Task>(`/hosting/web/${serviceName}/user/${login}`);
  }

  async changeFtpPassword(serviceName: string, login: string, password: string): Promise<Task> {
    return ovhPost<Task>(`/hosting/web/${serviceName}/user/${login}/changePassword`, { password });
  }

  // ---------- DATABASES ----------
  async listDatabases(serviceName: string): Promise<string[]> {
    return ovhGet<string[]>(`/hosting/web/${serviceName}/database`);
  }

  async getDatabase(serviceName: string, name: string): Promise<Database> {
    return ovhGet<Database>(`/hosting/web/${serviceName}/database/${name}`);
  }

  async createDatabase(serviceName: string, data: { type: string; version: string; user: string; password: string }): Promise<Task> {
    return ovhPost<Task>(`/hosting/web/${serviceName}/database`, data);
  }

  async deleteDatabase(serviceName: string, name: string): Promise<Task> {
    return ovhDelete<Task>(`/hosting/web/${serviceName}/database/${name}`);
  }

  async changeDatabasePassword(serviceName: string, name: string, password: string): Promise<Task> {
    return ovhPost<Task>(`/hosting/web/${serviceName}/database/${name}/changePassword`, { password });
  }

  // ---------- DATABASE DUMPS ----------
  async listDatabaseDumps(serviceName: string, databaseName: string): Promise<number[]> {
    try {
      return await ovhGet<number[]>(`/hosting/web/${serviceName}/database/${databaseName}/dump`);
    } catch {
      return [];
    }
  }

  async getDatabaseDump(serviceName: string, databaseName: string, dumpId: number): Promise<DatabaseDump> {
    return ovhGet<DatabaseDump>(`/hosting/web/${serviceName}/database/${databaseName}/dump/${dumpId}`);
  }

  async createDatabaseDump(serviceName: string, databaseName: string): Promise<Task> {
    return ovhPost<Task>(`/hosting/web/${serviceName}/database/${databaseName}/dump`, { type: "now" });
  }

  async restoreDatabaseDump(serviceName: string, databaseName: string, dumpId: number): Promise<Task> {
    return ovhPost<Task>(`/hosting/web/${serviceName}/database/${databaseName}/dump/${dumpId}/restore`, {});
  }

  async deleteDatabaseDump(serviceName: string, databaseName: string, dumpId: number): Promise<void> {
    await ovhDelete(`/hosting/web/${serviceName}/database/${databaseName}/dump/${dumpId}`);
  }

  // ---------- CRONS ----------
  async listCrons(serviceName: string): Promise<number[]> {
    try {
      return await ovhGet<number[]>(`/hosting/web/${serviceName}/cron`);
    } catch {
      return [];
    }
  }

  async getCron(serviceName: string, cronId: number): Promise<Cron> {
    return ovhGet<Cron>(`/hosting/web/${serviceName}/cron/${cronId}`);
  }

  async createCron(serviceName: string, data: { command: string; frequency: string; language: string; email?: string }): Promise<Task> {
    return ovhPost<Task>(`/hosting/web/${serviceName}/cron`, data);
  }

  async updateCron(serviceName: string, cronId: number, data: Partial<Cron>): Promise<void> {
    await ovhPut(`/hosting/web/${serviceName}/cron/${cronId}`, data);
  }

  async deleteCron(serviceName: string, cronId: number): Promise<Task> {
    return ovhDelete<Task>(`/hosting/web/${serviceName}/cron/${cronId}`);
  }

  // ---------- ENV VARS ----------
  async listEnvVars(serviceName: string): Promise<string[]> {
    try {
      return await ovhGet<string[]>(`/hosting/web/${serviceName}/envVar`);
    } catch {
      return [];
    }
  }

  async getEnvVar(serviceName: string, key: string): Promise<EnvVar> {
    return ovhGet<EnvVar>(`/hosting/web/${serviceName}/envVar/${key}`);
  }

  async createEnvVar(serviceName: string, data: { key: string; value: string; type?: string }): Promise<Task> {
    return ovhPost<Task>(`/hosting/web/${serviceName}/envVar`, data);
  }

  async deleteEnvVar(serviceName: string, key: string): Promise<Task> {
    return ovhDelete<Task>(`/hosting/web/${serviceName}/envVar/${key}`);
  }

  // ---------- RUNTIMES ----------
  async listRuntimes(serviceName: string): Promise<number[]> {
    try {
      return await ovhGet<number[]>(`/hosting/web/${serviceName}/runtime`);
    } catch {
      return [];
    }
  }

  async getRuntime(serviceName: string, runtimeId: number): Promise<Runtime> {
    return ovhGet<Runtime>(`/hosting/web/${serviceName}/runtime/${runtimeId}`);
  }

  async createRuntime(serviceName: string, data: { name: string; type: string; publicDir?: string; appEnv?: string; appBootstrap?: string }): Promise<Task> {
    return ovhPost<Task>(`/hosting/web/${serviceName}/runtime`, data);
  }

  async deleteRuntime(serviceName: string, runtimeId: number): Promise<Task> {
    return ovhDelete<Task>(`/hosting/web/${serviceName}/runtime/${runtimeId}`);
  }

  // ---------- MODULES ----------
  async listModules(serviceName: string): Promise<number[]> {
    try {
      return await ovhGet<number[]>(`/hosting/web/${serviceName}/module`);
    } catch {
      return [];
    }
  }

  async getModule(serviceName: string, moduleId: number): Promise<Module> {
    return ovhGet<Module>(`/hosting/web/${serviceName}/module/${moduleId}`);
  }

  async installModule(serviceName: string, data: { moduleId: number; domain: string; path?: string; adminName?: string; adminPassword?: string; adminEmail?: string; language?: string }): Promise<Task> {
    return ovhPost<Task>(`/hosting/web/${serviceName}/module`, data);
  }

  async deleteModule(serviceName: string, moduleId: number): Promise<Task> {
    return ovhDelete<Task>(`/hosting/web/${serviceName}/module/${moduleId}`);
  }

  async getAvailableModules(): Promise<{ id: number; name: string; version?: string }[]> {
    try {
      return await ovhGet<{ id: number; name: string; version?: string }[]>("/hosting/web/moduleList");
    } catch {
      return [];
    }
  }

  // ---------- CDN ----------
  async getCdnStatus(serviceName: string): Promise<CdnStatus> {
    try {
      const data = await ovhGet<{ type: string; status: string }>(`/hosting/web/${serviceName}/cdn`);
      return { active: true, type: data.type, status: data.status };
    } catch {
      return { active: false };
    }
  }

  async flushCdnCache(serviceName: string): Promise<Task> {
    return ovhPost<Task>(`/hosting/web/${serviceName}/cdn/flush`, {});
  }

  // ---------- TASKS ----------
  async listTasks(serviceName: string): Promise<number[]> {
    try {
      return await ovhGet<number[]>(`/hosting/web/${serviceName}/tasks`);
    } catch {
      return [];
    }
  }

  async getTask(serviceName: string, taskId: number): Promise<Task> {
    return ovhGet<Task>(`/hosting/web/${serviceName}/tasks/${taskId}`);
  }

  async getRecentTasks(serviceName: string, limit = 20): Promise<Task[]> {
    const ids = await this.listTasks(serviceName);
    const recentIds = ids.slice(0, limit);
    return Promise.all(recentIds.map(id => this.getTask(serviceName, id)));
  }

  // ---------- LOCAL SEO ----------
  async listLocalSeo(serviceName: string): Promise<number[]> {
    try {
      return await ovhGet<number[]>(`/hosting/web/${serviceName}/localSeo/account`);
    } catch {
      return [];
    }
  }

  async getLocalSeo(serviceName: string, accountId: number): Promise<LocalSeo> {
    return ovhGet<LocalSeo>(`/hosting/web/${serviceName}/localSeo/account/${accountId}`);
  }

  async terminateLocalSeo(serviceName: string, accountId: number): Promise<void> {
    await ovhPost(`/hosting/web/${serviceName}/localSeo/account/${accountId}/terminate`, {});
  }

  // ---------- EMAIL ----------
  async getEmail(serviceName: string): Promise<Email | null> {
    try {
      return await ovhGet<Email>(`/hosting/web/${serviceName}/email`);
    } catch {
      return null;
    }
  }

  // ---------- BOOST ----------
  async getBoostHistory(serviceName: string): Promise<{ offer: string; startDate: string; endDate: string }[]> {
    try {
      return await ovhGet<{ offer: string; startDate: string; endDate: string }[]>(`/hosting/web/${serviceName}/boostHistory`);
    } catch {
      return [];
    }
  }

  async requestBoost(serviceName: string, offer: string): Promise<Task> {
    return ovhPost<Task>(`/hosting/web/${serviceName}/requestBoost`, { offer });
  }
}

export const hostingService = new HostingService();
export default hostingService;
