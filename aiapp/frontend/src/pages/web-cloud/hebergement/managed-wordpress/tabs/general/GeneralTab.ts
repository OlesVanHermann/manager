// ============================================================
// SERVICE ISOLÉ : GeneralTab - Managed WordPress
// ============================================================

import { apiClient } from "../../../../../../services/api";

const BASE_PATH = "/managedCMS/resource";
const API_OPTIONS = { apiVersion: "v2" };

export const generalService = {
  async getService(serviceName: string): Promise<any> {
    return apiClient.get(`${BASE_PATH}/${serviceName}`, API_OPTIONS);
  },

  async getServiceInfos(serviceName: string): Promise<any> {
    return apiClient.get(`/services/${encodeURIComponent(serviceName)}`);
  },

  async resetAdminPassword(serviceName: string): Promise<string> {
    const result = await apiClient.post(`${BASE_PATH}/${serviceName}/resetPassword`, {}, API_OPTIONS);
    return result.password || result;
  },

  async updateWordPress(serviceName: string): Promise<any> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/update`, {}, API_OPTIONS);
  },

  async flushCache(serviceName: string): Promise<void> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/cache/flush`, {}, API_OPTIONS);
  },

  async deleteInstance(serviceName: string): Promise<void> {
    return apiClient.delete(`${BASE_PATH}/${serviceName}`, API_OPTIONS);
  },
};
