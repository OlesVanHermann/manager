// ============================================================
// API XDSL IPS - Gestion des IPs
// Aligné avec old_manager: OvhApiXdslIps
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface XdslIp {
  ip: string;
  range: number;
  version: 'v4' | 'v6';
  status: string;
  dnsList?: string[];
  ipPeriod?: number;
  type?: 'primary' | 'additional';
}

// ---------- API ----------

export const xdslIpsApi = {
  /** Liste les IPs d'un accès. */
  async list(accessName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/xdsl/${accessName}/ips`);
  },

  /** Récupère les détails d'une IP. */
  async get(accessName: string, ip: string): Promise<XdslIp> {
    return ovhApi.get<XdslIp>(`/xdsl/${accessName}/ips/${encodeURIComponent(ip)}`);
  },

  /** Liste toutes les IPs avec détails. */
  async getAll(accessName: string): Promise<XdslIp[]> {
    const ips = await this.list(accessName);
    return Promise.all(ips.map(ip => this.get(accessName, ip)));
  },

  /** Supprime une IP additionnelle. */
  async delete(accessName: string, ip: string): Promise<void> {
    await ovhApi.delete(`/xdsl/${accessName}/ips/${encodeURIComponent(ip)}`);
  },

  /** Active/désactive IPv6. */
  async setIpv6(accessName: string, enabled: boolean): Promise<{ taskId: number }> {
    return ovhApi.post<{ taskId: number }>(`/xdsl/${accessName}/ipv6`, { enabled });
  },
};
