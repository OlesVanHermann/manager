// ============================================================
// SERVICE HOSTING - Gestion des hebergements web OVHcloud
// ============================================================

import { ovhApi } from './api.service';

// ============================================================
// TYPES
// ============================================================

export interface Hosting {
  serviceName: string;
  displayName: string;
  hostingIp: string;
  hostingIpv6: string;
  offer: string;
  operatingSystem: string;
  state: 'active' | 'bloqued' | 'maintenance';
  cluster: string;
  clusterIp: string;
  clusterIpv6: string;
  boostOffer: string | null;
  hasCdn: boolean;
  hasHostedSsl: boolean;
  home: string;
  primaryLogin: string;
  quotaSize: { unit: string; value: number };
  quotaUsed: { unit: string; value: number };
  trafficQuotaSize: { unit: string; value: number } | null;
  trafficQuotaUsed: { unit: string; value: number } | null;
  resourceType: string;
  serviceManagementAccess: { ssh: { state: string; port: number }; ftp: { state: string; port: number } };
}

export interface HostingServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew: { automatic: boolean; deleteAtExpiration: boolean; forced: boolean; period: number | null };
}

export interface AttachedDomain {
  domain: string;
  path: string;
  cdn: 'active' | 'none' | 'to_configure';
  firewall: 'active' | 'none';
  ssl: boolean;
  status: 'created' | 'creating' | 'deleting';
  ipLocation: string | null;
  ownLog: string | null;
}

export interface FtpUser {
  login: string;
  home: string;
  state: 'off' | 'rw' | 'read';
  isPrimaryAccount: boolean;
  serviceManagementCredentials: { ftp: boolean; ssh: boolean };
}

export interface Database {
  name: string;
  server: string;
  port: number;
  type: 'mysql' | 'postgresql' | 'redis';
  version: string;
  state: 'activated' | 'suspended' | 'toBeDeleted';
  quotaSize: { unit: string; value: number };
  quotaUsed: { unit: string; value: number };
  user: string;
  creationDate: string;
}

export interface CronJob {
  id: number;
  command: string;
  description: string;
  email: string;
  frequency: string;
  language: string;
  status: 'enabled' | 'disabled' | 'suspended';
}

export interface SslCertificate {
  provider: string;
  type: 'DV' | 'EV' | 'OV';
  status: 'created' | 'creating' | 'deleting' | 'regenerating';
  isReportable: boolean;
  regenerable: boolean;
}

export interface Runtime {
  id: number;
  name: string;
  type: 'phpfpm' | 'nodejs';
  publicDir: string;
  appEnv: string;
  appBootstrap: string;
  isDefault: boolean;
  status: 'active' | 'inactive';
}

export interface EnvVar {
  key: string;
  value: string;
  type: 'string' | 'password';
  status: 'active' | 'error';
}

export interface HostingTask {
  id: number;
  function: string;
  status: 'cancelled' | 'doing' | 'done' | 'error' | 'init' | 'todo';
  objectId: string | null;
  objectType: string | null;
  startDate: string;
  doneDate: string | null;
}

export interface EmailOption {
  domain: string;
  status: 'none' | 'bounce' | 'force' | 'normal' | 'spam' | 'suspend';
  quota: { value: number; unit: string } | null;
}

export interface Module {
  id: number;
  moduleId: number;
  adminName: string;
  adminFolder: string;
  targetUrl: string;
  language: string;
  status: 'created' | 'creating' | 'deleting' | 'error';
  creationDate: string;
}

// ============================================================
// SERVICE
// ============================================================

class HostingService {
  /** Liste tous les hebergements du compte. */
  async listHostings(): Promise<string[]> {
    return ovhApi.get<string[]>('/hosting/web');
  }

  /** Recupere les details d'un hebergement. */
  async getHosting(serviceName: string): Promise<Hosting> {
    return ovhApi.get<Hosting>(`/hosting/web/${serviceName}`);
  }

  /** Recupere les infos de service d'un hebergement. */
  async getServiceInfos(serviceName: string): Promise<HostingServiceInfos> {
    return ovhApi.get<HostingServiceInfos>(`/hosting/web/${serviceName}/serviceInfos`);
  }

  // ---------- Multisite (Attached Domains) ----------

  async listAttachedDomains(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/hosting/web/${serviceName}/attachedDomain`);
  }

  async getAttachedDomain(serviceName: string, domain: string): Promise<AttachedDomain> {
    return ovhApi.get<AttachedDomain>(`/hosting/web/${serviceName}/attachedDomain/${domain}`);
  }

  // ---------- FTP Users ----------

  async listFtpUsers(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/hosting/web/${serviceName}/user`);
  }

  async getFtpUser(serviceName: string, login: string): Promise<FtpUser> {
    return ovhApi.get<FtpUser>(`/hosting/web/${serviceName}/user/${login}`);
  }

  // ---------- Databases ----------

  async listDatabases(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/hosting/web/${serviceName}/database`);
  }

  async getDatabase(serviceName: string, name: string): Promise<Database> {
    return ovhApi.get<Database>(`/hosting/web/${serviceName}/database/${name}`);
  }

  // ---------- Cron Jobs ----------

  async listCronJobs(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/hosting/web/${serviceName}/cron`);
  }

  async getCronJob(serviceName: string, id: number): Promise<CronJob> {
    return ovhApi.get<CronJob>(`/hosting/web/${serviceName}/cron/${id}`);
  }

  // ---------- SSL ----------

  async getSslCertificate(serviceName: string): Promise<SslCertificate | null> {
    try {
      return await ovhApi.get<SslCertificate>(`/hosting/web/${serviceName}/ssl`);
    } catch {
      return null;
    }
  }

  // ---------- Runtimes ----------

  async listRuntimes(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/hosting/web/${serviceName}/runtime`);
  }

  async getRuntime(serviceName: string, id: number): Promise<Runtime> {
    return ovhApi.get<Runtime>(`/hosting/web/${serviceName}/runtime/${id}`);
  }

  // ---------- Environment Variables ----------

  async listEnvVars(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/hosting/web/${serviceName}/envVar`);
  }

  async getEnvVar(serviceName: string, key: string): Promise<EnvVar> {
    return ovhApi.get<EnvVar>(`/hosting/web/${serviceName}/envVar/${key}`);
  }

  // ---------- Email Option ----------

  async getEmailOption(serviceName: string): Promise<EmailOption | null> {
    try {
      return await ovhApi.get<EmailOption>(`/hosting/web/${serviceName}/email`);
    } catch {
      return null;
    }
  }

  // ---------- Modules (1-click) ----------

  async listModules(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/hosting/web/${serviceName}/module`);
  }

  async getModule(serviceName: string, id: number): Promise<Module> {
    return ovhApi.get<Module>(`/hosting/web/${serviceName}/module/${id}`);
  }

  // ---------- Tasks ----------

  async listTasks(serviceName: string, status?: string): Promise<number[]> {
    let path = `/hosting/web/${serviceName}/tasks`;
    if (status) path += `?status=${status}`;
    return ovhApi.get<number[]>(path);
  }

  async getTask(serviceName: string, id: number): Promise<HostingTask> {
    return ovhApi.get<HostingTask>(`/hosting/web/${serviceName}/tasks/${id}`);
  }
}

export const hostingService = new HostingService();
