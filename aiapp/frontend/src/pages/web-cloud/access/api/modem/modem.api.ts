// ============================================================
// API MODEM - Endpoints /xdsl/{id}/modem
// Aligné avec old_manager: OvhApiXdslModem
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface Modem {
  macAddress: string;
  model: string;
  brandName: string;
  serialNumber?: string;
  firmwareVersion?: string;
  lastCwmpRequestDate?: string;
  isBridged: boolean;
  mtuSize: number;
  dmzIP?: string;
  easyFirewallLevel: 'disabled' | 'normal' | 'high';
  sipAlg: boolean;
  ipsecAlg: boolean;
  upnp: boolean;
  managedByOvh: boolean;
  acsBackend: string;
}

export interface ComfortExchange {
  newModel: string;
  price: { value: number; currency: string };
  priceWithTax: { value: number; currency: string };
}

// ---------- API ----------

export const modemApi = {
  /** Récupère les infos du modem. */
  async get(accessName: string): Promise<Modem> {
    return ovhApi.get<Modem>(`/xdsl/${accessName}/modem`);
  },

  /** Met à jour la configuration du modem. */
  async update(accessName: string, data: Partial<{
    mtuSize: number;
    isBridged: boolean;
    sipAlg: boolean;
    ipsecAlg: boolean;
    dmzIP: string | null;
    easyFirewallLevel: 'disabled' | 'normal' | 'high';
    managedByOvh: boolean;
  }>): Promise<{ taskId: number }> {
    return ovhApi.put<{ taskId: number }>(`/xdsl/${accessName}/modem`, data);
  },

  /** Redémarre le modem. */
  async reboot(accessName: string): Promise<{ taskId: number }> {
    return ovhApi.post<{ taskId: number }>(`/xdsl/${accessName}/modem/reboot`, {});
  },

  /** Reset le modem (configuration usine). */
  async reset(accessName: string, resetOvhConfig: boolean = false): Promise<{ taskId: number }> {
    return ovhApi.post<{ taskId: number }>(`/xdsl/${accessName}/modem/reset`, { resetOvhConfig });
  },

  /** Reconfigure le VoIP du modem. */
  async reconfigureVoip(accessName: string): Promise<{ taskId: number }> {
    return ovhApi.post<{ taskId: number }>(`/xdsl/${accessName}/modem/reconfigureVoip`, {});
  },

  /** Récupère les infos d'échange confort. */
  async getComfortExchange(accessName: string): Promise<ComfortExchange> {
    return ovhApi.get<ComfortExchange>(`/xdsl/${accessName}/modem/comfortExchange`);
  },

  /** Commander l'échange confort. */
  async orderComfortExchange(accessName: string): Promise<{ taskId: number }> {
    return ovhApi.post<{ taskId: number }>(`/xdsl/${accessName}/modem/comfortExchange`, {});
  },

  /** Récupère les backends ACS disponibles. */
  async getAvailableAcsBackends(accessName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/xdsl/${accessName}/modem/availableACSBackend`);
  },

  /** Récupère les appareils connectés. */
  async getConnectedDevices(accessName: string): Promise<any[]> {
    return ovhApi.get<any[]>(`/xdsl/${accessName}/modem/connectedDevices`);
  },
};
