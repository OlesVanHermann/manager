// ============================================================
// SERVICE: Private Database (Web Cloud Databases)
// ============================================================

import { apiClient } from "./api";

// ---------- TYPES ----------
export interface PrivateDatabase {
  serviceName: string;
  displayName?: string;
  state: "started" | "stopped" | "starting" | "stopping" | "error";
  type: "mysql" | "mariadb" | "postgresql" | "redis";
  version: string;
  hostname: string;
  hostnameFtp?: string;
  port: number;
  ram: { value: number; unit: string };
  cpu?: number;
  disk?: { value: number; unit: string };
  datacenter?: string;
  offer?: string;
  infrastructure?: string;
  creationDate?: string;
}

export interface PdbDatabase {
  databaseName: string;
  quotaUsed: { value: number; unit: string };
  quotaSize: { value: number; unit: string };
  usersCount?: number;
  backupTime?: string;
}

export interface PdbUser {
  userName: string;
  creationDate: string;
  grants: { databaseName: string; grant: "admin" | "rw" | "ro" | "none" }[];
}

export interface PdbWhitelistEntry {
  ip: string;
  name?: string;
  service: boolean;
  sftp: boolean;
  creationDate: string;
}

export interface PdbTask {
  id: number;
  function: string;
  status: "todo" | "doing" | "done" | "error";
  startDate?: string;
  doneDate?: string;
}

// ---------- SERVICE ----------
class PrivateDatabaseService {
  private basePath = "/hosting/privateDatabase";

  // ---------- SERVICES LIST ----------
  async listPrivateDatabases(): Promise<string[]> {
    return apiClient.get(`${this.basePath}`);
  }

  async getPrivateDatabase(serviceName: string): Promise<PrivateDatabase> {
    return apiClient.get(`${this.basePath}/${serviceName}`);
  }

  async getServiceInfos(serviceName: string): Promise<any> {
    return apiClient.get(`${this.basePath}/${serviceName}/serviceInfos`);
  }

  // ---------- SERVER ACTIONS ----------
  async startServer(serviceName: string): Promise<PdbTask> {
    return apiClient.post(`${this.basePath}/${serviceName}/start`, {});
  }

  async stopServer(serviceName: string): Promise<PdbTask> {
    return apiClient.post(`${this.basePath}/${serviceName}/stop`, {});
  }

  async restartServer(serviceName: string): Promise<PdbTask> {
    return apiClient.post(`${this.basePath}/${serviceName}/restart`, {});
  }

  // ---------- DATABASES ----------
  async listDatabases(serviceName: string): Promise<string[]> {
    return apiClient.get(`${this.basePath}/${serviceName}/database`);
  }

  async getDatabase(serviceName: string, databaseName: string): Promise<PdbDatabase> {
    return apiClient.get(`${this.basePath}/${serviceName}/database/${databaseName}`);
  }

  async createDatabase(serviceName: string, databaseName: string): Promise<PdbTask> {
    return apiClient.post(`${this.basePath}/${serviceName}/database`, { databaseName });
  }

  async deleteDatabase(serviceName: string, databaseName: string): Promise<PdbTask> {
    return apiClient.delete(`${this.basePath}/${serviceName}/database/${databaseName}`);
  }

  async createDump(serviceName: string, databaseName: string, sendEmail?: boolean): Promise<PdbTask> {
    return apiClient.post(`${this.basePath}/${serviceName}/database/${databaseName}/dump`, { sendEmail });
  }

  // ---------- USERS ----------
  async listUsers(serviceName: string): Promise<string[]> {
    return apiClient.get(`${this.basePath}/${serviceName}/user`);
  }

  async getUser(serviceName: string, userName: string): Promise<PdbUser> {
    return apiClient.get(`${this.basePath}/${serviceName}/user/${userName}`);
  }

  async createUser(serviceName: string, userName: string, password: string): Promise<PdbTask> {
    return apiClient.post(`${this.basePath}/${serviceName}/user`, { userName, password });
  }

  async deleteUser(serviceName: string, userName: string): Promise<PdbTask> {
    return apiClient.delete(`${this.basePath}/${serviceName}/user/${userName}`);
  }

  async changeUserPassword(serviceName: string, userName: string, password: string): Promise<PdbTask> {
    return apiClient.post(`${this.basePath}/${serviceName}/user/${userName}/changePassword`, { password });
  }

  async setUserGrant(serviceName: string, userName: string, databaseName: string, grant: string): Promise<PdbTask> {
    return apiClient.post(`${this.basePath}/${serviceName}/user/${userName}/grant/${databaseName}`, { grant });
  }

  // ---------- WHITELIST ----------
  async listWhitelist(serviceName: string): Promise<string[]> {
    return apiClient.get(`${this.basePath}/${serviceName}/whitelist`);
  }

  async getWhitelistEntry(serviceName: string, ip: string): Promise<PdbWhitelistEntry> {
    return apiClient.get(`${this.basePath}/${serviceName}/whitelist/${encodeURIComponent(ip)}`);
  }

  async addWhitelistEntry(serviceName: string, ip: string, name?: string, service?: boolean, sftp?: boolean): Promise<PdbTask> {
    return apiClient.post(`${this.basePath}/${serviceName}/whitelist`, { ip, name, service, sftp });
  }

  async deleteWhitelistEntry(serviceName: string, ip: string): Promise<PdbTask> {
    return apiClient.delete(`${this.basePath}/${serviceName}/whitelist/${encodeURIComponent(ip)}`);
  }

  // ---------- TASKS ----------
  async listTasks(serviceName: string): Promise<number[]> {
    return apiClient.get(`${this.basePath}/${serviceName}/tasks`);
  }

  async getTask(serviceName: string, taskId: number): Promise<PdbTask> {
    return apiClient.get(`${this.basePath}/${serviceName}/tasks/${taskId}`);
  }

  // ---------- METRICS ----------
  async getMetrics(serviceName: string, period?: string): Promise<any> {
    const query = period ? `?period=${period}` : "";
    return apiClient.get(`${this.basePath}/${serviceName}/metrics${query}`);
  }

  // ---------- LOGS ----------
  async getLogs(serviceName: string): Promise<any[]> {
    return apiClient.get(`${this.basePath}/${serviceName}/log`);
  }

  // ---------- CONFIGURATION ----------
  async getConfiguration(serviceName: string): Promise<any[]> {
    return apiClient.get(`${this.basePath}/${serviceName}/config`);
  }

  async updateConfiguration(serviceName: string, parameters: Record<string, string>): Promise<PdbTask> {
    return apiClient.put(`${this.basePath}/${serviceName}/config`, { parameters });
  }

  // ---------- OOM & CPU THROTTLE ----------
  async getOomEvents(serviceName: string): Promise<any[]> {
    return apiClient.get(`${this.basePath}/${serviceName}/oom`);
  }

  async getCpuThrottleEvents(serviceName: string): Promise<any[]> {
    return apiClient.get(`${this.basePath}/${serviceName}/cpuThrottle`);
  }

  // ---------- EXTENSIONS (PostgreSQL) ----------
  async getExtensions(serviceName: string, databaseName: string): Promise<string[]> {
    return apiClient.get(`${this.basePath}/${serviceName}/database/${databaseName}/extension`);
  }

  async setExtensions(serviceName: string, databaseName: string, extensions: string[]): Promise<void> {
    return apiClient.post(`${this.basePath}/${serviceName}/database/${databaseName}/extension`, { extensions });
  }

  // ---------- ORDER ----------
  async getAvailableOffers(): Promise<any[]> {
    return apiClient.get(`/order/catalog/public/webCloudDatabases`);
  }
}

export const privateDatabaseService = new PrivateDatabaseService();
