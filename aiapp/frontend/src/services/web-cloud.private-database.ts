// ============================================================
// SERVICE PRIVATE DATABASE - Cloud Databases OVHcloud
// ============================================================

import { ovhApi } from './api';

// ============================================================
// TYPES
// ============================================================

export interface PrivateDatabase {
  serviceName: string;
  displayName: string;
  state: 'detached' | 'restartPending' | 'started' | 'startPending' | 'stopped' | 'stopPending';
  type: 'mysql' | 'postgresql' | 'redis' | 'mongodb';
  version: string;
  versionNumber: number;
  offer: string;
  hostname: string;
  hostnameFtp: string | null;
  port: number;
  portFtp: number | null;
  datacenter: string;
  ram: { unit: string; value: number };
  quotaSize: { unit: string; value: number };
  quotaUsed: { unit: string; value: number };
  cpu: number;
  tlsCa: string | null;
  infrastructure: string;
}

export interface PrivateDatabaseServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew: { automatic: boolean; deleteAtExpiration: boolean; period: number | null };
}

export interface PrivateDatabaseDb {
  databaseName: string;
  quotaUsed: { unit: string; value: number };
  creationDate: string;
  users: { userName: string; grantType: string }[];
}

export interface PrivateDatabaseUser {
  userName: string;
  creationDate: string;
  databases: { databaseName: string; grantType: string }[];
}

export interface PrivateDatabaseWhitelist {
  ip: string;
  name: string;
  sftp: boolean;
  service: boolean;
  creationDate: string;
  lastUpdate: string;
  status: 'created' | 'creating' | 'deleting';
}

export interface PrivateDatabaseTask {
  id: number;
  function: string;
  status: 'cancelled' | 'doing' | 'done' | 'error' | 'init' | 'todo';
  startDate: string;
  doneDate: string | null;
  lastUpdate: string;
  progress: number;
}

export interface PrivateDatabaseLog {
  filename: string;
  size: number;
  creationDate: string;
  url: string;
}

export interface PrivateDatabaseMetrics {
  cpu: { timestamp: string; value: number }[];
  ram: { timestamp: string; value: number }[];
  connections: { timestamp: string; value: number }[];
}

// ============================================================
// SERVICE
// ============================================================

class PrivateDatabaseService {
  /** Liste toutes les bases privees du compte. */
  async listDatabases(): Promise<string[]> {
    return ovhApi.get<string[]>('/hosting/privateDatabase');
  }

  /** Recupere les details d'une base privee. */
  async getDatabase(serviceName: string): Promise<PrivateDatabase> {
    return ovhApi.get<PrivateDatabase>(`/hosting/privateDatabase/${serviceName}`);
  }

  /** Recupere les infos de service. */
  async getServiceInfos(serviceName: string): Promise<PrivateDatabaseServiceInfos> {
    return ovhApi.get<PrivateDatabaseServiceInfos>(`/hosting/privateDatabase/${serviceName}/serviceInfos`);
  }

  // ---------- Databases ----------

  /** Liste les bases de donnees. */
  async listDbs(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/hosting/privateDatabase/${serviceName}/database`);
  }

  /** Recupere une base de donnees. */
  async getDb(serviceName: string, databaseName: string): Promise<PrivateDatabaseDb> {
    return ovhApi.get<PrivateDatabaseDb>(`/hosting/privateDatabase/${serviceName}/database/${databaseName}`);
  }

  /** Cree une base de donnees. */
  async createDb(serviceName: string, databaseName: string): Promise<void> {
    return ovhApi.post<void>(`/hosting/privateDatabase/${serviceName}/database`, { databaseName });
  }

  /** Supprime une base de donnees. */
  async deleteDb(serviceName: string, databaseName: string): Promise<void> {
    return ovhApi.delete<void>(`/hosting/privateDatabase/${serviceName}/database/${databaseName}`);
  }

  // ---------- Users ----------

  /** Liste les utilisateurs. */
  async listUsers(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/hosting/privateDatabase/${serviceName}/user`);
  }

  /** Recupere un utilisateur. */
  async getUser(serviceName: string, userName: string): Promise<PrivateDatabaseUser> {
    return ovhApi.get<PrivateDatabaseUser>(`/hosting/privateDatabase/${serviceName}/user/${userName}`);
  }

  /** Cree un utilisateur. */
  async createUser(serviceName: string, userName: string, password: string): Promise<void> {
    return ovhApi.post<void>(`/hosting/privateDatabase/${serviceName}/user`, { userName, password });
  }

  /** Supprime un utilisateur. */
  async deleteUser(serviceName: string, userName: string): Promise<void> {
    return ovhApi.delete<void>(`/hosting/privateDatabase/${serviceName}/user/${userName}`);
  }

  // ---------- Whitelist ----------

  /** Liste les IPs autorisees. */
  async listWhitelist(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/hosting/privateDatabase/${serviceName}/whitelist`);
  }

  /** Recupere une IP autorisee. */
  async getWhitelist(serviceName: string, ip: string): Promise<PrivateDatabaseWhitelist> {
    return ovhApi.get<PrivateDatabaseWhitelist>(`/hosting/privateDatabase/${serviceName}/whitelist/${ip}`);
  }

  /** Ajoute une IP a la whitelist. */
  async addWhitelist(serviceName: string, ip: string, name: string, service: boolean, sftp: boolean): Promise<void> {
    return ovhApi.post<void>(`/hosting/privateDatabase/${serviceName}/whitelist`, { ip, name, service, sftp });
  }

  /** Supprime une IP de la whitelist. */
  async removeWhitelist(serviceName: string, ip: string): Promise<void> {
    return ovhApi.delete<void>(`/hosting/privateDatabase/${serviceName}/whitelist/${ip}`);
  }

  // ---------- Tasks ----------

  /** Liste les taches. */
  async listTasks(serviceName: string, status?: string): Promise<number[]> {
    let path = `/hosting/privateDatabase/${serviceName}/tasks`;
    if (status) path += `?status=${status}`;
    return ovhApi.get<number[]>(path);
  }

  /** Recupere une tache. */
  async getTask(serviceName: string, id: number): Promise<PrivateDatabaseTask> {
    return ovhApi.get<PrivateDatabaseTask>(`/hosting/privateDatabase/${serviceName}/tasks/${id}`);
  }

  // ---------- Actions ----------

  /** Redemarre le service. */
  async restart(serviceName: string): Promise<void> {
    return ovhApi.post<void>(`/hosting/privateDatabase/${serviceName}/restart`, {});
  }

  /** Demarre le service. */
  async start(serviceName: string): Promise<void> {
    return ovhApi.post<void>(`/hosting/privateDatabase/${serviceName}/start`, {});
  }

  /** Arrete le service. */
  async stop(serviceName: string): Promise<void> {
    return ovhApi.post<void>(`/hosting/privateDatabase/${serviceName}/stop`, {});
  }
}

export const privateDatabaseService = new PrivateDatabaseService();
