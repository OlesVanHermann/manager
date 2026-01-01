// ============================================================
// SERVICE CONFIGURE TAB - Isolé pour configuration OverTheBox
// Endpoints alignés avec old_manager (OvhApiOverTheBox)
// ============================================================

import { ovhApi } from '../../../../services/api';
import type { Task } from './overthebox.types';

// ---------- TYPES LOCAUX ----------

interface OtbDeviceHardware {
  model?: string;
  version?: string;
  serial?: string;
}

interface OtbStatisticsParams {
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  metricsType: 'traffic' | 'bandwidth' | 'device';
}

interface OtbStatistics {
  timestamp: string;
  values: number[];
}

interface OtbIp {
  ip: string;
  version: 4 | 6;
  enabled: boolean;
}

// ---------- SERVICE ----------

export const configureService = {
  /** Récupère les statistiques (old_manager: loadStatistics). */
  async getStatistics(serviceName: string, params: OtbStatisticsParams): Promise<OtbStatistics[]> {
    return ovhApi.get<OtbStatistics[]>(`/overTheBox/${serviceName}/statistics`, {
      params: {
        period: params.period,
        metricsType: params.metricsType,
      },
    });
  },

  /** Récupère les infos hardware du device. */
  async getDeviceHardware(serviceName: string): Promise<OtbDeviceHardware> {
    return ovhApi.get<OtbDeviceHardware>(`/overTheBox/${serviceName}/device/hardware`);
  },

  /** Délier le device du service. */
  async unlinkDevice(serviceName: string): Promise<void> {
    await ovhApi.delete(`/overTheBox/${serviceName}/device`);
  },

  /** Récupère les IPs du service. */
  async getIps(serviceName: string): Promise<OtbIp[]> {
    return ovhApi.get<OtbIp[]>(`/overTheBox/${serviceName}/ips`);
  },

  /** Active/désactive IPv6. */
  async updateIpv6(serviceName: string, enabled: boolean): Promise<string> {
    const response = await ovhApi.put<{ taskId: string }>(`/overTheBox/${serviceName}/ipv6`, { enabled });
    return response.taskId;
  },

  /** Vérifie le statut d'une tâche. */
  async checkTaskStatus(serviceName: string, taskId: string): Promise<Task> {
    return ovhApi.get<Task>(`/overTheBox/${serviceName}/tasks/${taskId}`);
  },

  /** Liste les services disponibles (pour rattachement device). */
  async getServices(): Promise<string[]> {
    return ovhApi.get<string[]>('/overTheBox');
  },

  /** Rattache un device à un service (old_manager: linkDevice). */
  async linkDevice(serviceName: string): Promise<Task> {
    // Endpoint aligné old_manager: /linkDevice (pas /link)
    return ovhApi.post<Task>(`/overTheBox/${serviceName}/linkDevice`, {});
  },

  // ============================================================
  // ENDPOINTS ALIGNÉS OLD_MANAGER (manquants)
  // ============================================================

  /**
   * Récupère les actions disponibles pour le device (old_manager: getAvailableActions).
   */
  async getAvailableActions(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/overTheBox/${serviceName}/device/availableActions`);
  },

  /**
   * Lance une action sur le device (old_manager: launchAction).
   */
  async launchDeviceAction(serviceName: string, action: string): Promise<Task> {
    return ovhApi.post<Task>(`/overTheBox/${serviceName}/device/actions`, { action });
  },

  /**
   * Récupère les canaux de release disponibles (old_manager: getAvailableReleaseChannels).
   */
  async getAvailableReleaseChannels(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/overTheBox/${serviceName}/availableReleaseChannels`);
  },

  /**
   * Récupère les offres de migration disponibles (old_manager: getMigrationOffers).
   */
  async getMigrationOffers(serviceName: string): Promise<any[]> {
    return ovhApi.get<any[]>(`/overTheBox/${serviceName}/migration/offers`);
  },

  /**
   * Récupère les offres disponibles globalement (old_manager: availableOffers).
   */
  async getAvailableOffers(): Promise<any[]> {
    return ovhApi.get<any[]>('/overTheBox/availableOffers');
  },

  /**
   * Récupère les infos service (old_manager: getServiceInfos).
   */
  async getServiceInfos(serviceName: string): Promise<any> {
    return ovhApi.get<any>(`/overTheBox/${serviceName}/serviceInfos`);
  },

  /**
   * Met à jour les infos service (old_manager: putServiceInfos).
   */
  async updateServiceInfos(serviceName: string, data: any): Promise<void> {
    await ovhApi.put(`/overTheBox/${serviceName}/serviceInfos`, data);
  },
};
