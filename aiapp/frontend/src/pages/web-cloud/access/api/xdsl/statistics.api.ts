// ============================================================
// API XDSL STATISTICS - Statistiques de ligne
// Aligné avec old_manager: OvhApiXdsl (statistics)
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export type StatisticsPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type StatisticsType = 'ping' | 'traffic:download' | 'traffic:upload' | 'synchronization:download' | 'synchronization:upload';

export interface XdslStatistics {
  period: StatisticsPeriod;
  type: StatisticsType;
  values: Array<{
    timestamp: number;
    value: number;
  }>;
}

// ---------- API ----------

export const xdslStatisticsApi = {
  /** Récupère les statistiques. */
  async get(accessName: string, period: StatisticsPeriod, type: StatisticsType): Promise<XdslStatistics> {
    return ovhApi.get<XdslStatistics>(`/xdsl/${accessName}/statistics?period=${period}&type=${type}`);
  },

  /** Récupère toutes les statistiques pour une période. */
  async getAll(accessName: string, period: StatisticsPeriod): Promise<{
    ping: XdslStatistics;
    downloadTraffic: XdslStatistics;
    uploadTraffic: XdslStatistics;
    downloadSync: XdslStatistics;
    uploadSync: XdslStatistics;
  }> {
    const [ping, downloadTraffic, uploadTraffic, downloadSync, uploadSync] = await Promise.all([
      this.get(accessName, period, 'ping'),
      this.get(accessName, period, 'traffic:download'),
      this.get(accessName, period, 'traffic:upload'),
      this.get(accessName, period, 'synchronization:download'),
      this.get(accessName, period, 'synchronization:upload'),
    ]);
    return { ping, downloadTraffic, uploadTraffic, downloadSync, uploadSync };
  },

  /** Réinitialise les statistiques DSL. */
  async reset(accessName: string): Promise<{ taskId: number }> {
    return ovhApi.post<{ taskId: number }>(`/xdsl/${accessName}/resetDslStats`, {});
  },
};
