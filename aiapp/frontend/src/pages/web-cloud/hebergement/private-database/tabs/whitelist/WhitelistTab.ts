// ============================================================
// SERVICE ISOLÉ : WhitelistTab - Private Database
// ============================================================

import { apiClient } from "../../../../../../services/api";
import type { PdbWhitelist, PdbTask } from "../../private-database.types";

const BASE_PATH = "/hosting/privateDatabase";

export const whitelistService = {
  // ---------- LIST / GET ----------
  async listWhitelist(serviceName: string): Promise<string[]> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/whitelist`);
  },

  async getWhitelistEntry(serviceName: string, ip: string): Promise<PdbWhitelist> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/whitelist/${encodeURIComponent(ip)}`);
  },

  // ---------- ADD / DELETE ----------
  async addWhitelistEntry(serviceName: string, ip: string, name?: string, service?: boolean, sftp?: boolean): Promise<PdbTask> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/whitelist`, { ip, name, service, sftp });
  },

  async deleteWhitelistEntry(serviceName: string, ip: string): Promise<PdbTask> {
    return apiClient.delete(`${BASE_PATH}/${serviceName}/whitelist/${encodeURIComponent(ip)}`);
  },
};
