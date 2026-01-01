// ============================================================
// API OVERTHEBOX DEVICE - Endpoints /overTheBox/{id}/device/*
// Aligné avec old_manager: OvhApiOverTheBox + OvhApiOverTheBoxDevice
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface OtbDevice {
  deviceId: string;
  version: string;
  lastSeen?: string;
  activated: boolean;
  networkInterfaces?: any[];
  publicIp?: string;
  systemVersion?: string;
}

export interface OtbDeviceHardware {
  model?: string;
  version?: string;
  serial?: string;
  imei?: string;
}

export interface OtbDeviceAction {
  name: string;
  description?: string;
}

// ---------- API ----------

export const otbDeviceApi = {
  /** Récupère les infos du device. */
  async get(serviceName: string): Promise<OtbDevice> {
    return ovhApi.get<OtbDevice>(`/overTheBox/${serviceName}/device`);
  },

  /** Lie un device au service. */
  async link(serviceName: string): Promise<{ taskId: number }> {
    return ovhApi.post<{ taskId: number }>(`/overTheBox/${serviceName}/linkDevice`, {});
  },

  /** Délie le device du service. */
  async unlink(serviceName: string): Promise<void> {
    await ovhApi.delete(`/overTheBox/${serviceName}/device`);
  },

  /** Récupère les infos hardware. */
  async getHardware(serviceName: string): Promise<OtbDeviceHardware> {
    return ovhApi.get<OtbDeviceHardware>(`/overTheBox/${serviceName}/device/hardware`);
  },

  /** Récupère les actions disponibles. */
  async getAvailableActions(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/overTheBox/${serviceName}/device/availableActions`);
  },

  /** Lance une action sur le device. */
  async launchAction(serviceName: string, action: string): Promise<{ taskId: number }> {
    return ovhApi.post<{ taskId: number }>(`/overTheBox/${serviceName}/device/actions`, { action });
  },

  /** Récupère l'URL des logs (pour polling). */
  async getLogs(serviceName: string): Promise<{ url: string }> {
    return ovhApi.post<{ url: string }>(`/overTheBox/${serviceName}/device/logs`, {});
  },
};
