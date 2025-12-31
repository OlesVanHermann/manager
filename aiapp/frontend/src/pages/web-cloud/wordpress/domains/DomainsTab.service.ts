// ============================================================
// WORDPRESS - Domains Tab Service
// ============================================================

import { apiClient } from '../../../../services/api';
import type { WordPressDomain, SslConfig, ApiTaskResponse } from '../wordpress.types';

const BASE_PATH = '/managedCMS/resource';
const API_OPTIONS = { apiVersion: 'v2' as const };

/** Service pour le tab Domaines */
export const domainsService = {
  /** Liste les domaines d'un site WordPress */
  async listDomains(serviceName: string): Promise<WordPressDomain[]> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/domains`, API_OPTIONS);
  },

  /** Ajoute un domaine alias ou multisite */
  async addDomain(serviceName: string, params: { domain: string; type: 'alias' | 'multisite'; enableSsl?: boolean }): Promise<ApiTaskResponse> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/domains`, params, API_OPTIONS);
  },

  /** Supprime un domaine alias */
  async deleteDomain(serviceName: string, domain: string): Promise<void> {
    return apiClient.delete(`${BASE_PATH}/${serviceName}/domains/${encodeURIComponent(domain)}`, API_OPTIONS);
  },

  /** Recupere l'etat SSL d'un domaine */
  async getSslStatus(serviceName: string, domain: string): Promise<SslConfig> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/domains/${encodeURIComponent(domain)}/ssl`, API_OPTIONS);
  },

  /** Configure SSL pour un domaine */
  async configureSsl(serviceName: string, domain: string, config: SslConfig): Promise<ApiTaskResponse> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/domains/${encodeURIComponent(domain)}/ssl`, config, API_OPTIONS);
  },
};

export default domainsService;
