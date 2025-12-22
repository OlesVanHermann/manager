// ============================================================
// WEB-CLOUD PRIVATE DATABASE SERVICE - API CloudDB
// ============================================================

import { apiClient } from "./api";

// ============ TYPES ============

export interface PrivateDatabase {
  serviceName: string;
  displayName?: string;
  offer: string;
  state: "started" | "stopped" | "starting" | "stopping" | "error";
  type: "mysql" | "postgresql" | "mariadb" | "redis";
  version: string;
  hostname: string;
  hostnameFtp?: string;
  port: number;
  portFtp?: number;
  ram?: { value: number; unit: string };
  cpu?: number;
  quotaSize?: { value: number; unit: string };
  quotaUsed?: { value: number; unit: string };
  datacenter?: string;
  infrastructure?: "legacy" | "docker";
  lastCheck?: string;
}

export interface PrivateDatabaseServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  renew?: { automatic: boolean; period?: string };
}

export interface PdbDatabase {
  databaseName: string;
  quotaUsed?: { value: number; unit: string };
  creationDate?: string;
  users?: string[];
  backupTime?: string;
}

export interface PdbUser {
  userName: string;
  creationDate?: string;
  databases?: Array<{ databaseName: string; grantType: "admin" | "rw" | "ro" | "none" }>;
}

export interface PdbWhitelist {
  ip: string;
  name?: string;
  service?: boolean;
  sftp?: boolean;
  creationDate?: string;
  lastUpdate?: string;
  status?: string;
}

export interface PdbTask {
  id: number;
  function: string;
  status: string;
  startDate: string;
  doneDate?: string;
  lastUpdate?: string;
}

export interface PdbDump {
  id: number;
  databaseName: string;
  creationDate: string;
  deletionDate?: string;
  url?: string;
}

export interface PdbConfig {
  key: string;
  value: string;
  defaultValue: string;
  description?: string;
  type?: string;
  availableValues?: string[];
  unit?: string;
  min?: number;
  max?: number;
}

// ============ SERVICE ============

class PrivateDatabaseService {
  private basePath = "/hosting/privateDatabase";

  // ---------- PRIVATE DATABASES ----------
  async listPrivateDatabases(): Promise<string[]> {
    return apiClient.get<string[]>(this.basePath);
  }

  async getPrivateDatabase(serviceName: string): Promise<PrivateDatabase> {
    return apiClient.get<PrivateDatabase>(`${this.basePath}/${serviceName}`);
  }

  async getServiceInfos(serviceName: string): Promise<PrivateDatabaseServiceInfos> {
    return apiClient.get<PrivateDatabaseServiceInfos>(`${this.basePath}/${serviceName}/serviceInfos`);
  }

  // ---------- SERVER ACTIONS ----------
  async startServer(serviceName: string): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/start`, {});
  }

  async stopServer(serviceName: string): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/stop`, {});
  }

  async restartServer(serviceName: string): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/restart`, {});
  }

  // ---------- DATABASES ----------
  async listDatabases(serviceName: string): Promise<string[]> {
    return apiClient.get<string[]>(`${this.basePath}/${serviceName}/database`);
  }

  async getDatabase(serviceName: string, databaseName: string): Promise<PdbDatabase> {
    return apiClient.get<PdbDatabase>(`${this.basePath}/${serviceName}/database/${encodeURIComponent(databaseName)}`);
  }

  async createDatabase(serviceName: string, databaseName: string): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/database`, { databaseName });
  }

  async deleteDatabase(serviceName: string, databaseName: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${serviceName}/database/${encodeURIComponent(databaseName)}`);
  }

  // ---------- USERS ----------
  async listUsers(serviceName: string): Promise<string[]> {
    return apiClient.get<string[]>(`${this.basePath}/${serviceName}/user`);
  }

  async getUser(serviceName: string, userName: string): Promise<PdbUser> {
    return apiClient.get<PdbUser>(`${this.basePath}/${serviceName}/user/${encodeURIComponent(userName)}`);
  }

  async createUser(serviceName: string, userName: string, password: string): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/user`, { userName, password });
  }

  async deleteUser(serviceName: string, userName: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${serviceName}/user/${encodeURIComponent(userName)}`);
  }

  async changeUserPassword(serviceName: string, userName: string, password: string): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/user/${encodeURIComponent(userName)}/changePassword`, { password });
  }

  async setUserGrant(serviceName: string, userName: string, databaseName: string, grant: "admin" | "rw" | "ro" | "none"): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/user/${encodeURIComponent(userName)}/grant/${encodeURIComponent(databaseName)}`, { grant });
  }

  // ---------- WHITELIST ----------
  async listWhitelist(serviceName: string): Promise<string[]> {
    return apiClient.get<string[]>(`${this.basePath}/${serviceName}/whitelist`);
  }

  async getWhitelistEntry(serviceName: string, ip: string): Promise<PdbWhitelist> {
    return apiClient.get<PdbWhitelist>(`${this.basePath}/${serviceName}/whitelist/${encodeURIComponent(ip)}`);
  }

  async addWhitelistEntry(serviceName: string, ip: string, name?: string, service?: boolean, sftp?: boolean): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/whitelist`, { ip, name, service, sftp });
  }

  async deleteWhitelistEntry(serviceName: string, ip: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${serviceName}/whitelist/${encodeURIComponent(ip)}`);
  }

  // ---------- TASKS ----------
  async listTasks(serviceName: string): Promise<number[]> {
    return apiClient.get<number[]>(`${this.basePath}/${serviceName}/tasks`);
  }

  async getTask(serviceName: string, id: number): Promise<PdbTask> {
    return apiClient.get<PdbTask>(`${this.basePath}/${serviceName}/tasks/${id}`);
  }

  // ---------- DUMPS ----------
  async listDumps(serviceName: string, databaseName: string): Promise<number[]> {
    return apiClient.get<number[]>(`${this.basePath}/${serviceName}/database/${encodeURIComponent(databaseName)}/dump`);
  }

  async getDump(serviceName: string, databaseName: string, id: number): Promise<PdbDump> {
    return apiClient.get<PdbDump>(`${this.basePath}/${serviceName}/database/${encodeURIComponent(databaseName)}/dump/${id}`);
  }

  async createDump(serviceName: string, databaseName: string): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/database/${encodeURIComponent(databaseName)}/dump`, {});
  }

  async restoreDump(serviceName: string, databaseName: string, dumpId: number): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/database/${encodeURIComponent(databaseName)}/dump/${dumpId}/restore`, {});
  }

  async deleteDump(serviceName: string, databaseName: string, dumpId: number): Promise<void> {
    return apiClient.delete(`${this.basePath}/${serviceName}/database/${encodeURIComponent(databaseName)}/dump/${dumpId}`);
  }

  // ---------- CONFIGURATION ----------
  async listConfigurations(serviceName: string): Promise<string[]> {
    return apiClient.get<string[]>(`${this.basePath}/${serviceName}/config`);
  }

  async getConfiguration(serviceName: string, key: string): Promise<PdbConfig> {
    return apiClient.get<PdbConfig>(`${this.basePath}/${serviceName}/config/${encodeURIComponent(key)}`);
  }

  async updateConfiguration(serviceName: string, key: string, value: string): Promise<void> {
    return apiClient.put(`${this.basePath}/${serviceName}/config/${encodeURIComponent(key)}`, { value });
  }

  // ---------- ROOT PASSWORD ----------
  async changeRootPassword(serviceName: string, password: string): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/changePassword`, { password });
  }
}

export const privateDatabaseService = new PrivateDatabaseService();
