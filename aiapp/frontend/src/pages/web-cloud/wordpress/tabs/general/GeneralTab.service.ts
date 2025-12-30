// ============================================================
// SERVICE ISOLÉ : GeneralTab - WordPress
// ============================================================

import { apiClient } from '../../../../../services/api';
import type { WordPress, ServiceInfos, ApiTaskResponse } from '../../wordpress.types';

const BASE_PATH = '/managedCMS/resource';
const API_OPTIONS = { apiVersion: 'v2' as const };

export const generalService = {
  /** Recupere les details d'un site WordPress */
  async getService(serviceName: string): Promise<WordPress> {
    return apiClient.get(`${BASE_PATH}/${serviceName}`, API_OPTIONS);
  },

  /** Recupere les infos d'abonnement (creation, expiration) */
  async getServiceInfos(serviceName: string): Promise<ServiceInfos> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/serviceInfos`, API_OPTIONS);
  },

  /** Reinitialise le mot de passe admin WordPress */
  async resetAdminPassword(serviceName: string): Promise<ApiTaskResponse> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/resetAdminPassword`, {}, API_OPTIONS);
  },

  /** Met a jour WordPress vers la derniere version */
  async updateWordPress(serviceName: string): Promise<ApiTaskResponse> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/update`, {}, API_OPTIONS);
  },

  /** Vide le cache du site */
  async flushCache(serviceName: string): Promise<ApiTaskResponse> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/flushCache`, {}, API_OPTIONS);
  },

  /** Supprime le site WordPress */
  async deleteInstance(serviceName: string): Promise<void> {
    return apiClient.delete(`${BASE_PATH}/${serviceName}`, API_OPTIONS);
  },
};
