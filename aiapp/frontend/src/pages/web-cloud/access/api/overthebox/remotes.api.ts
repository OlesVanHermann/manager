// ============================================================
// API OVERTHEBOX REMOTES - Accès distants
// Aligné avec old_manager: OvhApiOverTheBox (remoteAccesses)
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface OtbRemote {
  remoteAccessId: string;
  status: 'toAuthorize' | 'active' | 'toDelete';
  accepted: boolean;
  exposedPort: number;
  allowedIp?: string;
  publicKey?: string;
  expirationDate?: string;
  connectionInfos?: {
    ip: string;
    port: number;
  };
}

// ---------- API ----------

export const otbRemotesApi = {
  /** Liste les IDs des accès distants. */
  async list(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/overTheBox/${serviceName}/remoteAccesses`);
  },

  /** Récupère un accès distant. */
  async get(serviceName: string, remoteId: string): Promise<OtbRemote> {
    return ovhApi.get<OtbRemote>(`/overTheBox/${serviceName}/remoteAccesses/${remoteId}`);
  },

  /** Liste tous les accès distants avec détails. */
  async getAll(serviceName: string): Promise<OtbRemote[]> {
    const ids = await this.list(serviceName);
    return Promise.all(ids.map(id => this.get(serviceName, id)));
  },

  /** Crée un accès distant. */
  async create(serviceName: string, data: {
    exposedPort: number;
    allowedIp?: string;
    publicKey?: string;
    expirationDate?: string;
  }): Promise<OtbRemote> {
    return ovhApi.post<OtbRemote>(`/overTheBox/${serviceName}/remoteAccesses`, data);
  },

  /** Autorise un accès distant. */
  async authorize(serviceName: string, remoteId: string): Promise<void> {
    await ovhApi.post(`/overTheBox/${serviceName}/remoteAccesses/${remoteId}/authorize`, {});
  },

  /** Supprime un accès distant. */
  async delete(serviceName: string, remoteId: string): Promise<void> {
    await ovhApi.delete(`/overTheBox/${serviceName}/remoteAccesses/${remoteId}`);
  },
};
