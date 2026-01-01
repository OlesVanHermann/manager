// ============================================================
// API MODEM PORT MAPPINGS - Règles NAT
// Aligné avec old_manager: OvhApiXdslModemPort
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface PortMapping {
  name: string;
  description?: string;
  internalClient: string;
  internalPort: number;
  externalPortStart: number;
  externalPortEnd?: number;
  protocol: 'TCP' | 'UDP' | 'BOTH';
  status: 'enabled' | 'disabled';
}

// ---------- API ----------

export const modemPortMappingsApi = {
  /** Liste les règles NAT. */
  async list(accessName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/xdsl/${accessName}/modem/portMappings`);
  },

  /** Récupère une règle NAT. */
  async get(accessName: string, name: string): Promise<PortMapping> {
    return ovhApi.get<PortMapping>(`/xdsl/${accessName}/modem/portMappings/${name}`);
  },

  /** Liste toutes les règles NAT avec détails. */
  async getAll(accessName: string): Promise<PortMapping[]> {
    const names = await this.list(accessName);
    return Promise.all(names.map(name => this.get(accessName, name)));
  },

  /** Crée une règle NAT. */
  async create(accessName: string, data: {
    name: string;
    description?: string;
    internalClient: string;
    internalPort: number;
    externalPortStart: number;
    externalPortEnd?: number;
    protocol: 'TCP' | 'UDP' | 'BOTH';
  }): Promise<PortMapping> {
    return ovhApi.post<PortMapping>(`/xdsl/${accessName}/modem/portMappings`, data);
  },

  /** Met à jour une règle NAT. */
  async update(accessName: string, name: string, data: Partial<{
    description: string;
    internalClient: string;
    internalPort: number;
    externalPortStart: number;
    externalPortEnd: number;
    protocol: 'TCP' | 'UDP' | 'BOTH';
  }>): Promise<{ taskId: number }> {
    return ovhApi.put<{ taskId: number }>(`/xdsl/${accessName}/modem/portMappings/${name}`, data);
  },

  /** Supprime une règle NAT. */
  async delete(accessName: string, name: string): Promise<void> {
    await ovhApi.delete(`/xdsl/${accessName}/modem/portMappings/${name}`);
  },
};
