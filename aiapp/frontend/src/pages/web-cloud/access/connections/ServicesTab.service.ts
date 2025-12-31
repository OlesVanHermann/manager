// ============================================================
// SERVICE SERVICES TAB - Isolé pour liste des services inclus
// ============================================================

import { ovhApi } from '../../../../services/api';
import type { Service } from '../connections.types';

// ---------- SERVICE ----------

export const servicesTabService = {
  /** Liste des services inclus. */
  async getServices(connectionId: string): Promise<Service[]> {
    const services: Service[] = [];
    const domains = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/domain/services`).catch(() => []);
    domains.forEach(d => services.push({ id: d, type: 'domain', name: d, status: 'active' }));
    const emails = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/emailPro/services`).catch(() => []);
    emails.forEach(e => services.push({ id: e, type: 'email', name: e, status: 'active' }));
    const voips = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/voipLine/services`).catch(() => []);
    voips.forEach(v => services.push({ id: v, type: 'voip', name: v, status: 'active' }));
    const hostings = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/hostedEmail/services`).catch(() => []);
    hostings.forEach(h => services.push({ id: h, type: 'hosting', name: h, status: 'active' }));
    return services;
  },
};
