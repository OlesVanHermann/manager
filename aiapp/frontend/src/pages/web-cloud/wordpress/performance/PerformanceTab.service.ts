// ============================================================
// WORDPRESS - Performance Tab Service
// ============================================================

import { apiClient } from '../../../../services/api';
import type { CdnStatus, CacheStatus, Optimizations, ApiTaskResponse } from '../wordpress.types';

const BASE_PATH = '/managedCMS/resource';
const API_OPTIONS = { apiVersion: 'v2' as const };

/** Service pour le tab Performances */
export const performanceService = {
  /** Recupere l'etat du CDN */
  async getCdnStatus(serviceName: string): Promise<CdnStatus> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/cdn`, API_OPTIONS);
  },

  /** Active le CDN */
  async enableCdn(serviceName: string): Promise<ApiTaskResponse> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/cdn/enable`, {}, API_OPTIONS);
  },

  /** Desactive le CDN */
  async disableCdn(serviceName: string): Promise<ApiTaskResponse> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/cdn/disable`, {}, API_OPTIONS);
  },

  /** Recupere l'etat du cache */
  async getCacheStatus(serviceName: string): Promise<CacheStatus> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/cache`, API_OPTIONS);
  },

  /** Vide le cache */
  async flushCache(serviceName: string): Promise<ApiTaskResponse> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/cache/flush`, {}, API_OPTIONS);
  },

  /** Recupere les optimisations actives (statique, basé sur l'offre) */
  getOptimizations(offer: string): Optimizations {
    const isProOrBusiness = offer === 'Pro' || offer === 'Business';
    return {
      gzip: true,
      brotli: true,
      http2: true,
      http3: isProOrBusiness,
    };
  },
};

export default performanceService;
