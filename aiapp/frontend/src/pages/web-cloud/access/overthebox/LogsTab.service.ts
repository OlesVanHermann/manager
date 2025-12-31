// ============================================================
// SERVICE LOGS TAB - Isolé pour logs OverTheBox
// ============================================================

import { ovhApi } from '../../../../services/api';
import type { OtbLogEntry, LogLevel, LogPeriod } from '../overthebox.types';

// ---------- SERVICE ----------

export const logsService = {
  /** Récupérer les logs. */
  async getLogs(serviceName: string, options?: {
    level?: LogLevel;
    period?: LogPeriod;
    search?: string;
    limit?: number;
  }): Promise<OtbLogEntry[]> {
    const params = new URLSearchParams();
    if (options?.level) params.append('level', options.level);
    if (options?.period) params.append('period', options.period);
    if (options?.search) params.append('search', options.search);
    if (options?.limit) params.append('limit', String(options.limit));

    const query = params.toString();
    const url = `/overTheBox/${serviceName}/logs${query ? `?${query}` : ''}`;
    return ovhApi.get<OtbLogEntry[]>(url);
  },

  /** Exporter les logs. */
  async exportLogs(serviceName: string, format: 'txt' | 'json' = 'txt'): Promise<Blob> {
    return ovhApi.get<Blob>(`/overTheBox/${serviceName}/logs/export?format=${format}`, {
      responseType: 'blob',
    });
  },
};
