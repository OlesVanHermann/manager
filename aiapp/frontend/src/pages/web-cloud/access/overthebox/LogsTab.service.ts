// ============================================================
// SERVICE LOGS TAB - Isolé pour logs OverTheBox
// Endpoints alignés avec old_manager (OvhApiOverTheBox.getLogs)
// ============================================================

import { ovhApi } from '../../../../services/api';

// ---------- TYPES LOCAUX ----------

interface LogsResponse {
  url: string;
}

// ---------- SERVICE ----------

export const logsService = {
  /**
   * Récupérer l'URL des logs (old_manager: getLogs via TailLogs).
   * Note: old_manager utilise POST /device/logs qui retourne une URL
   * que TailLogs poll ensuite pour afficher les logs en temps réel.
   */
  async getLogsUrl(serviceName: string): Promise<string> {
    // Endpoint aligné old_manager: POST /overTheBox/{serviceName}/device/logs
    const response = await ovhApi.post<LogsResponse>(`/overTheBox/${serviceName}/device/logs`, {});
    return response.url;
  },

  /**
   * Récupérer les logs disponibles.
   * Utilise l'URL retournée par getLogsUrl.
   */
  async fetchLogsFromUrl(url: string): Promise<string> {
    // L'URL retournée est externe, on la fetch directement
    const response = await fetch(url);
    return response.text();
  },
};
