// ============================================================
// SVI TAB SERVICE - Appels API isolés pour Numbers SVI (IVR)
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../../services/api';

export interface SviMenu {
  menuId: number;
  name: string;
  greetSound: string;
  invalidSound: string;
  entries: SviMenuEntry[];
}

export interface SviMenuEntry {
  entryId: number;
  position: number;
  dtmf: string;
  action: 'playback' | 'menu' | 'callcenter' | 'ivr' | 'hangup';
  actionParam: string;
}

export const sviTabService = {
  async getMenus(billingAccount: string, serviceName: string): Promise<SviMenu[]> {
    try {
      const ids = await ovhApi.get<number[]>(`/telephony/${billingAccount}/ovhPabx/${serviceName}/menu`);
      const menus = await Promise.all(
        ids.map(async (menuId) => {
          try {
            const menu = await ovhApi.get<SviMenu>(`/telephony/${billingAccount}/ovhPabx/${serviceName}/menu/${menuId}`);
            const entryIds = await ovhApi.get<number[]>(`/telephony/${billingAccount}/ovhPabx/${serviceName}/menu/${menuId}/entry`).catch(() => []);
            const entries = await Promise.all(
              entryIds.map(async (entryId) => {
                try {
                  return await ovhApi.get<SviMenuEntry>(`/telephony/${billingAccount}/ovhPabx/${serviceName}/menu/${menuId}/entry/${entryId}`);
                } catch {
                  return null;
                }
              })
            );
            return { ...menu, entries: entries.filter((e): e is SviMenuEntry => e !== null) };
          } catch {
            return null;
          }
        })
      );
      return menus.filter((m): m is SviMenu => m !== null);
    } catch {
      return [];
    }
  },

  async createMenu(billingAccount: string, serviceName: string, data: Partial<SviMenu>): Promise<SviMenu> {
    return ovhApi.post<SviMenu>(`/telephony/${billingAccount}/ovhPabx/${serviceName}/menu`, data);
  },

  async updateMenu(billingAccount: string, serviceName: string, menuId: number, data: Partial<SviMenu>): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/ovhPabx/${serviceName}/menu/${menuId}`, data);
  },

  async deleteMenu(billingAccount: string, serviceName: string, menuId: number): Promise<void> {
    return ovhApi.delete(`/telephony/${billingAccount}/ovhPabx/${serviceName}/menu/${menuId}`);
  },

  async addMenuEntry(billingAccount: string, serviceName: string, menuId: number, data: Partial<SviMenuEntry>): Promise<SviMenuEntry> {
    return ovhApi.post<SviMenuEntry>(`/telephony/${billingAccount}/ovhPabx/${serviceName}/menu/${menuId}/entry`, data);
  },

  async deleteMenuEntry(billingAccount: string, serviceName: string, menuId: number, entryId: number): Promise<void> {
    return ovhApi.delete(`/telephony/${billingAccount}/ovhPabx/${serviceName}/menu/${menuId}/entry/${entryId}`);
  },
};
