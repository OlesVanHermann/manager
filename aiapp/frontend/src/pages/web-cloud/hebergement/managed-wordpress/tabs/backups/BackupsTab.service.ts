import { apiClient } from "../../../../../../services/api";
import type { ManagedWordPressBackup, ManagedWordPressTask } from "../../managed-wordpress.types";

const BASE_PATH = "/managedCMS/resource";
const API_OPTIONS = { apiVersion: "v2" };

export const backupsService = {
  async listBackups(serviceName: string): Promise<ManagedWordPressBackup[]> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/backup`, API_OPTIONS);
  },

  async createBackup(serviceName: string): Promise<ManagedWordPressTask> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/backup`, {}, API_OPTIONS);
  },

  async restoreBackup(serviceName: string, backupId: string): Promise<ManagedWordPressTask> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/backup/${backupId}/restore`, {}, API_OPTIONS);
  },

  async deleteBackup(serviceName: string, backupId: string): Promise<void> {
    return apiClient.delete(`${BASE_PATH}/${serviceName}/backup/${backupId}`, API_OPTIONS);
  },
};
