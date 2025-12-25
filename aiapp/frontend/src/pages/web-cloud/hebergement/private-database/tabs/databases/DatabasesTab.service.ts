// ============================================================
// SERVICE ISOLÉ : DatabasesTab - Private Database
// ============================================================

import { apiClient } from "../../../../../../services/api";
import type { PdbDatabase, PdbTask } from "../../private-database.types";

const BASE_PATH = "/hosting/privateDatabase";

export const databasesService = {
  // ---------- LIST / GET ----------
  async listDatabases(serviceName: string): Promise<string[]> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/database`);
  },

  async getDatabase(serviceName: string, databaseName: string): Promise<PdbDatabase> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/database/${databaseName}`);
  },

  // ---------- CREATE / DELETE ----------
  async createDatabase(serviceName: string, databaseName: string): Promise<PdbTask> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/database`, { databaseName });
  },

  async deleteDatabase(serviceName: string, databaseName: string): Promise<PdbTask> {
    return apiClient.delete(`${BASE_PATH}/${serviceName}/database/${databaseName}`);
  },

  // ---------- DUMP ----------
  async createDump(serviceName: string, databaseName: string, sendEmail?: boolean): Promise<PdbTask> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/database/${databaseName}/dump`, { sendEmail });
  },

  // ---------- EXTENSIONS (PostgreSQL) ----------
  async getExtensions(serviceName: string, databaseName: string): Promise<string[]> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/database/${databaseName}/extension`);
  },

  async setExtensions(serviceName: string, databaseName: string, extensions: string[]): Promise<void> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/database/${databaseName}/extension`, { extensions });
  },
};
