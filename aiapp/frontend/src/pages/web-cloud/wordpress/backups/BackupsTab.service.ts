// ============================================================
// SERVICE ISOLÉ : BackupsTab - WordPress
// ============================================================

import { apiClient } from '../../../../services/api';
import type { WordPressBackup, WordPressTask, RestoreOptions, BackupStorage } from '../wordpress.types';

const BASE_PATH = '/managedCMS/resource';
const API_OPTIONS = { apiVersion: 'v2' as const };

export const backupsService = {
  /** Liste les sauvegardes */
  async listBackups(serviceName: string): Promise<WordPressBackup[]> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/backup`, API_OPTIONS);
  },

  /** Cree une nouvelle sauvegarde manuelle */
  async createBackup(serviceName: string, note?: string): Promise<WordPressTask> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/backup`, { note }, API_OPTIONS);
  },

  /** Restaure une sauvegarde */
  async restoreBackup(serviceName: string, backupId: string, options?: RestoreOptions): Promise<WordPressTask> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/backup/${backupId}/restore`, options || {}, API_OPTIONS);
  },

  /** Supprime une sauvegarde manuelle */
  async deleteBackup(serviceName: string, backupId: string): Promise<void> {
    return apiClient.delete(`${BASE_PATH}/${serviceName}/backup/${backupId}`, API_OPTIONS);
  },

  /** Recupere les infos de stockage (statique basé sur l'offre) */
  getStorageInfo(offer: string): BackupStorage {
    const quotaByOffer: Record<string, number> = {
      Start: 10,
      Pro: 50,
      Business: 100,
    };
    return {
      used: 0,
      quota: quotaByOffer[offer] || 10,
      unit: 'Go',
    };
  },
};
