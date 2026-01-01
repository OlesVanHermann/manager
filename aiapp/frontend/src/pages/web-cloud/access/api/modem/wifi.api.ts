// ============================================================
// API MODEM WIFI - Configuration WiFi
// Aligné avec old_manager: OvhApiXdslModemWifi
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface ModemWifi {
  wifiName: string;
  SSID: string;
  enabled: boolean;
  channel: number | 'auto';
  channelMode: 'Auto' | 'Manual';
  securityKey?: string;
  securityType: 'None' | 'WEP' | 'WPA' | 'WPA2' | 'WPA2_WPA3' | 'WPA3';
  frequency?: '2.4GHz' | '5GHz';
}

// ---------- API ----------

export const modemWifiApi = {
  /** Liste les interfaces WiFi. */
  async list(accessName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/xdsl/${accessName}/modem/wifi`);
  },

  /** Récupère une interface WiFi. */
  async get(accessName: string, wifiName: string): Promise<ModemWifi> {
    return ovhApi.get<ModemWifi>(`/xdsl/${accessName}/modem/wifi/${wifiName}`);
  },

  /** Liste toutes les interfaces WiFi avec détails. */
  async getAll(accessName: string): Promise<ModemWifi[]> {
    const names = await this.list(accessName);
    return Promise.all(names.map(name => this.get(accessName, name)));
  },

  /** Met à jour une interface WiFi. */
  async update(accessName: string, wifiName: string, data: Partial<{
    enabled: boolean;
    SSID: string;
    channel: number | 'auto';
    channelMode: 'Auto' | 'Manual';
    securityKey: string;
    securityType: ModemWifi['securityType'];
  }>): Promise<{ taskId: number }> {
    return ovhApi.put<{ taskId: number }>(`/xdsl/${accessName}/modem/wifi/${wifiName}`, data);
  },

  /** Récupère les canaux disponibles. */
  async getAvailableChannels(accessName: string, frequency: '2.4GHz' | '5GHz'): Promise<number[]> {
    return ovhApi.get<number[]>(`/xdsl/${accessName}/modem/availableWLANChannel?frequency=${frequency}`);
  },
};
