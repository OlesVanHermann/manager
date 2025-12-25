import { apiClient } from "../../../../../../services/api";
import type { ManagedWordPressTheme, ManagedWordPressPlugin, ManagedWordPressTask } from "../../managed-wordpress.types";

const BASE_PATH = "/managedCMS/resource";
const API_OPTIONS = { apiVersion: "v2" };

export const themesPluginsService = {
  async listThemes(serviceName: string): Promise<ManagedWordPressTheme[]> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/theme`, API_OPTIONS);
  },

  async listPlugins(serviceName: string): Promise<ManagedWordPressPlugin[]> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/plugin`, API_OPTIONS);
  },

  async updateTheme(serviceName: string, themeName: string): Promise<ManagedWordPressTask> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/theme/${themeName}/update`, {}, API_OPTIONS);
  },

  async updatePlugin(serviceName: string, pluginName: string): Promise<ManagedWordPressTask> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/plugin/${pluginName}/update`, {}, API_OPTIONS);
  },

  async activatePlugin(serviceName: string, pluginName: string): Promise<void> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/plugin/${pluginName}/activate`, {}, API_OPTIONS);
  },

  async deactivatePlugin(serviceName: string, pluginName: string): Promise<void> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/plugin/${pluginName}/deactivate`, {}, API_OPTIONS);
  },

  async updateAllPlugins(serviceName: string): Promise<ManagedWordPressTask> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/plugin/updateAll`, {}, API_OPTIONS);
  },
};
