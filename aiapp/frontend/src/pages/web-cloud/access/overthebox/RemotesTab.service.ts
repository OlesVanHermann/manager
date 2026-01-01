// ============================================================
// SERVICE REMOTES - Isolé pour RemotesTab (OverTheBox)
// Endpoints alignés avec old_manager (OvhApiOverTheBox)
// ============================================================

import { ovhApi } from '../../../../services/api';
import type { Remote } from './overthebox.types';

// ---------- TYPES LOCAUX ----------

export type RemoteProtocol = 'ssh' | 'http' | 'https' | 'rdp' | 'rtsp' | 'tcp';

export interface CreateRemoteParams {
  exposedPort: number;
  localIp?: string;
  localPort?: number;
  protocol?: RemoteProtocol;
  publicKey?: string;
  expirationDate?: string;
}

export interface UpdateRemoteParams {
  name?: string;
  enabled?: boolean;
}

// ---------- SERVICE ----------

class RemotesService {
  /**
   * Récupère les accès distants d'un service OverTheBox.
   * old_manager utilise Aapi().remoteAccesses qui retourne directement les objets.
   * Ici on utilise v6 qui retourne les IDs puis on fetch chaque remote.
   */
  async getRemotes(serviceName: string): Promise<Remote[]> {
    const ids = await ovhApi.get<string[]>(`/overTheBox/${serviceName}/remoteAccesses`);
    return Promise.all(
      ids.map(id => ovhApi.get<Remote>(`/overTheBox/${serviceName}/remoteAccesses/${id}`))
    );
  }

  /** Récupère un accès distant spécifique (old_manager: loadRemote). */
  async getRemote(serviceName: string, remoteId: string): Promise<Remote> {
    return ovhApi.get<Remote>(`/overTheBox/${serviceName}/remoteAccesses/${remoteId}`);
  }

  /**
   * Crée un nouvel accès distant (old_manager: Aapi.createAndAuthorize).
   * Note: old_manager utilise /remoteAccess/create (Aapi) qui crée ET autorise.
   * v6 utilise /remoteAccesses (POST) pour créer, puis /authorize pour autoriser.
   */
  async createRemote(serviceName: string, params: CreateRemoteParams): Promise<Remote> {
    // Endpoint v6: POST /overTheBox/{serviceName}/remoteAccesses
    return ovhApi.post<Remote>(`/overTheBox/${serviceName}/remoteAccesses`, {
      exposedPort: params.exposedPort,
      allowedIp: params.localIp,
      publicKey: params.publicKey,
      expirationDate: params.expirationDate,
    });
  }

  /**
   * Autorise un accès distant (old_manager: authorizeRemote).
   * Utilisé quand le support a créé un remote et qu'il faut l'autoriser.
   */
  async authorizeRemote(serviceName: string, remoteId: string): Promise<void> {
    await ovhApi.post(`/overTheBox/${serviceName}/remoteAccesses/${remoteId}/authorize`, {});
  }

  /** Supprime un accès distant (old_manager: deleteRemote). */
  async deleteRemote(serviceName: string, remoteId: string): Promise<void> {
    await ovhApi.delete(`/overTheBox/${serviceName}/remoteAccesses/${remoteId}`);
  }
}

export const remotesService = new RemotesService();
