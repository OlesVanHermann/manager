// ============================================================
// SERVICE OPTIONS TAB - Isolé pour options actives/disponibles
// ============================================================

import { ovhApi } from '../../../../services/api';
import type { Option, AvailableOption, Task } from '../connections.types';

// ---------- SERVICE ----------

export const optionsService = {
  /** Options actives. */
  async getOptions(connectionId: string): Promise<Option[]> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const xdsl = await ovhApi.get<any>(`/xdsl/${accessNames[0]}`);
    const options: Option[] = [];
    if (xdsl.ipv6) options.push({ id: 'ipv6', type: 'ipv6', label: 'IPv6', active: true });
    return options;
  },

  /** Options disponibles. */
  async getAvailableOptions(_connectionId: string): Promise<AvailableOption[]> {
    return [
      { id: 'backup-4g', type: 'backup-4g', label: 'Backup 4G', description: 'Basculement auto si panne', price: 19.99, period: 'monthly' },
      { id: 'fixed-ip', type: 'fixed-ip', label: 'IP Failover', description: 'Adresses IP supplémentaires', price: 2.99, period: 'monthly' },
      { id: 'anti-ddos', type: 'anti-ddos', label: 'Anti-DDoS', description: 'Protection renforcée', price: 9.99, period: 'monthly' },
      { id: 'qos', type: 'qos', label: 'QoS Avancée', description: 'Priorisation trafic', price: 4.99, period: 'monthly' },
      { id: 'gtr', type: 'gtr', label: 'GTR 4h', description: 'Garantie rétablissement 4h', price: 29.99, period: 'monthly' },
    ];
  },

  /** Ajouter option. */
  async addOption(connectionId: string, optionId: string): Promise<Task> {
    return ovhApi.post<Task>(`/pack/xdsl/${connectionId}/options`, { optionId });
  },

  /** Supprimer option. */
  async removeOption(connectionId: string, optionId: string): Promise<void> {
    await ovhApi.delete(`/pack/xdsl/${connectionId}/options/${optionId}`);
  },
};
