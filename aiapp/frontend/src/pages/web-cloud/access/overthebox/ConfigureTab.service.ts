// ============================================================
// SERVICE CONFIGURE TAB - Isolé pour configuration OverTheBox
// ============================================================

import { ovhApi } from '../../../../services/api';
import type { OtbConfig, OtbNetworkConfig, OtbAggregationConfig, OtbQosConfig } from '../overthebox.types';

// ---------- SERVICE ----------

export const configureService = {
  /** Récupérer la configuration complète. */
  async getConfig(serviceName: string): Promise<OtbConfig> {
    return ovhApi.get<OtbConfig>(`/overTheBox/${serviceName}/configuration`);
  },

  /** Sauvegarder la configuration réseau. */
  async saveNetworkConfig(serviceName: string, config: Partial<OtbNetworkConfig>): Promise<void> {
    await ovhApi.put(`/overTheBox/${serviceName}/configuration/network`, config);
  },

  /** Sauvegarder la configuration d'agrégation. */
  async saveAggregationConfig(serviceName: string, config: Partial<OtbAggregationConfig>): Promise<void> {
    await ovhApi.put(`/overTheBox/${serviceName}/configuration/aggregation`, config);
  },

  /** Sauvegarder la configuration QoS. */
  async saveQosConfig(serviceName: string, config: Partial<OtbQosConfig>): Promise<void> {
    await ovhApi.put(`/overTheBox/${serviceName}/configuration/qos`, config);
  },

  /** Créer une sauvegarde de configuration. */
  async createBackup(serviceName: string): Promise<void> {
    await ovhApi.post(`/overTheBox/${serviceName}/configuration/backup`, {});
  },

  /** Télécharger une sauvegarde. */
  async downloadBackup(serviceName: string): Promise<Blob> {
    return ovhApi.get<Blob>(`/overTheBox/${serviceName}/configuration/backup`, {
      responseType: 'blob',
    });
  },

  /** Restaurer une sauvegarde. */
  async restoreBackup(serviceName: string): Promise<void> {
    await ovhApi.put(`/overTheBox/${serviceName}/configuration/backup`, {});
  },

  /** Réinitialiser aux paramètres usine. */
  async resetToFactory(serviceName: string): Promise<void> {
    await ovhApi.post(`/overTheBox/${serviceName}/configuration/reset`, {});
  },
};
