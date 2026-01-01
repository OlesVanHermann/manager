// ============================================================
// API MODEM LAN - Configuration LAN
// Aligné avec old_manager: OvhApiXdslModemLan
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface ModemLan {
  lanName: string;
  IPAddress: string;
  subnetMask: string;
}

// ---------- API ----------

export const modemLanApi = {
  /** Liste les interfaces LAN. */
  async list(accessName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/xdsl/${accessName}/modem/lan`);
  },

  /** Récupère une interface LAN. */
  async get(accessName: string, lanName: string): Promise<ModemLan> {
    return ovhApi.get<ModemLan>(`/xdsl/${accessName}/modem/lan/${lanName}`);
  },

  /** Met à jour une interface LAN. */
  async update(accessName: string, lanName: string, data: Partial<{
    IPAddress: string;
    subnetMask: string;
  }>): Promise<{ taskId: number }> {
    return ovhApi.put<{ taskId: number }>(`/xdsl/${accessName}/modem/lan/${lanName}`, data);
  },
};
