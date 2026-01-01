// ============================================================
// SERVICE ISOLÉ : GeneralTab - WordPress
// Aligné sur OLD MANAGER API v2 (managedWordpress.ts)
// ============================================================

import { apiClient } from '../../../services/api';
import type { WordPress } from './wordpress.types';

const BASE_PATH = '/managedCMS/resource';
const API_OPTIONS = { apiVersion: 'v2' as const };

export const generalService = {
  /**
   * R2: GET /managedCMS/resource/{serviceName}
   * Récupère les détails d'une ressource WordPress
   */
  async getService(serviceName: string): Promise<WordPress> {
    return apiClient.get(`${BASE_PATH}/${serviceName}`, API_OPTIONS);
  },

  // ============================================================
  // ENDPOINTS NON DISPONIBLES DANS L'API OLD MANAGER
  // Ces fonctions sont désactivées car les endpoints n'existent pas
  // ============================================================

  /** @deprecated Endpoint /serviceInfos non disponible dans l'API */
  async getServiceInfos(_serviceName: string): Promise<null> {
    console.warn('[generalService] getServiceInfos: endpoint non disponible dans l\'API');
    return null;
  },

  /** @deprecated Endpoint /resetAdminPassword non disponible dans l'API */
  async resetAdminPassword(_serviceName: string): Promise<null> {
    console.warn('[generalService] resetAdminPassword: endpoint non disponible dans l\'API');
    return null;
  },

  /** @deprecated Endpoint /update non disponible dans l'API */
  async updateWordPress(_serviceName: string): Promise<null> {
    console.warn('[generalService] updateWordPress: endpoint non disponible dans l\'API');
    return null;
  },

  /** @deprecated Endpoint /flushCache non disponible dans l'API */
  async flushCache(_serviceName: string): Promise<null> {
    console.warn('[generalService] flushCache: endpoint non disponible dans l\'API');
    return null;
  },

  /**
   * Pour supprimer, utiliser l'endpoint website:
   * R6: DELETE /managedCMS/resource/{serviceName}/website/{websiteId}
   * @deprecated Utiliser DeleteWebsiteModal avec le bon endpoint
   */
  async deleteInstance(_serviceName: string): Promise<null> {
    console.warn('[generalService] deleteInstance: utiliser DELETE /website/{websiteId} à la place');
    return null;
  },
};
