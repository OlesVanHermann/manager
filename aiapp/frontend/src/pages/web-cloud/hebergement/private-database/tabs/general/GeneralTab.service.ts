// ============================================================
// SERVICE ISOLÉ : GeneralTab - Private Database
// ============================================================

import { apiClient } from "../../../../../../services/api";
import type { PrivateDatabase, PrivateDatabaseServiceInfos, PdbTask } from "../../private-database.types";

const BASE_PATH = "/hosting/privateDatabase";

export const generalService = {
  // ---------- GET INFO ----------
  async getPrivateDatabase(serviceName: string): Promise<PrivateDatabase> {
    return apiClient.get(`${BASE_PATH}/${serviceName}`);
  },

  async getServiceInfos(serviceName: string): Promise<PrivateDatabaseServiceInfos> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/serviceInfos`);
  },

  // ---------- SERVER ACTIONS ----------
  async startServer(serviceName: string): Promise<PdbTask> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/start`, {});
  },

  async stopServer(serviceName: string): Promise<PdbTask> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/stop`, {});
  },

  async restartServer(serviceName: string): Promise<PdbTask> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/restart`, {});
  },
};
