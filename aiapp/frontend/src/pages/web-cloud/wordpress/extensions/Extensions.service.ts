// ============================================================
// SERVICE ISOLÉ : Extensions - WordPress
// ============================================================

import { apiClient } from '../../../../services/api';
import type { WordPressTheme, WordPressPlugin, ApiTaskResponse } from '../wordpress.types';

const BASE_PATH = '/managedCMS/resource';
const API_OPTIONS = { apiVersion: 'v2' as const };

export const extensionsService = {
  // ---------- THEMES ----------

  /** Liste les themes installes */
  async listThemes(serviceName: string): Promise<WordPressTheme[]> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/theme`, API_OPTIONS);
  },

  /** Met a jour un theme */
  async updateTheme(serviceName: string, themeName: string): Promise<ApiTaskResponse> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/theme/${encodeURIComponent(themeName)}/update`, {}, API_OPTIONS);
  },

  // ---------- PLUGINS ----------

  /** Liste les plugins installes */
  async listPlugins(serviceName: string): Promise<WordPressPlugin[]> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/plugin`, API_OPTIONS);
  },

  /** Met a jour un plugin */
  async updatePlugin(serviceName: string, pluginName: string): Promise<ApiTaskResponse> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/plugin/${encodeURIComponent(pluginName)}/update`, {}, API_OPTIONS);
  },

  /** Met a jour tous les plugins */
  async updateAllPlugins(serviceName: string): Promise<ApiTaskResponse> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/plugin/updateAll`, {}, API_OPTIONS);
  },

  /** Active un plugin */
  async activatePlugin(serviceName: string, pluginName: string): Promise<ApiTaskResponse> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/plugin/${encodeURIComponent(pluginName)}/activate`, {}, API_OPTIONS);
  },

  /** Desactive un plugin */
  async deactivatePlugin(serviceName: string, pluginName: string): Promise<ApiTaskResponse> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/plugin/${encodeURIComponent(pluginName)}/deactivate`, {}, API_OPTIONS);
  },
};
