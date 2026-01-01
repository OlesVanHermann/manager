// ============================================================
// API OVERTHEBOX STATISTICS - Statistiques
// Aligné avec old_manager: OverTheBoxDetailsService
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export type OtbStatisticsPeriod = 'hourly' | 'daily' | 'weekly' | 'monthly';
export type OtbMetricsType = 'traffic' | 'bandwidth' | 'device';

export interface OtbStatisticsPoint {
  timestamp: string;
  value: number;
}

export interface OtbStatistics {
  period: OtbStatisticsPeriod;
  metricsType: OtbMetricsType;
  values: OtbStatisticsPoint[];
}

export interface OtbIp {
  ip: string;
  version: 4 | 6;
  enabled: boolean;
}

// ---------- API ----------

export const otbStatisticsApi = {
  /** Récupère les statistiques. */
  async get(serviceName: string, period: OtbStatisticsPeriod, metricsType: OtbMetricsType): Promise<OtbStatistics[]> {
    return ovhApi.get<OtbStatistics[]>(`/overTheBox/${serviceName}/statistics`, {
      params: { period, metricsType },
    });
  },

  /** Récupère les IPs. */
  async getIps(serviceName: string): Promise<OtbIp[]> {
    return ovhApi.get<OtbIp[]>(`/overTheBox/${serviceName}/ips`);
  },

  /** Active/désactive IPv6. */
  async setIpv6(serviceName: string, enabled: boolean): Promise<{ taskId: string }> {
    return ovhApi.put<{ taskId: string }>(`/overTheBox/${serviceName}/ipv6`, { enabled });
  },
};
