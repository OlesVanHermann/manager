// ============================================================
// SERVICE MODEM PERSO TAB - Isolé pour modem personnel
// ============================================================

import { ovhApi } from '../../../../services/api';
import type { ModemCredentials } from '../connections.types';

// ---------- SERVICE ----------

export const modemPersoService = {
  /** Infos modem perso. */
  async getModemCustom(_connectionId: string): Promise<{ brand: string; model: string; mac: string } | null> {
    return null;
  },

  /** Credentials connexion. */
  async getModemCredentials(connectionId: string): Promise<ModemCredentials> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const xdsl = await ovhApi.get<any>(`/xdsl/${accessNames[0]}`);
    return {
      mode: 'PPPoE',
      username: xdsl.login || '',
      password: '••••••••',
      vlan: 835,
    };
  },
};
