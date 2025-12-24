// ============================================================
// SERVICE REMOTES - Isolé pour RemotesTab (OverTheBox)
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { Remote } from '../../overthebox.types';

class RemotesService {
  /** Récupère les accès distants d'un service OverTheBox. */
  async getRemotes(serviceName: string): Promise<Remote[]> {
    const ids = await ovhApi.get<string[]>(`/overTheBox/${serviceName}/remoteAccesses`);
    return Promise.all(
      ids.map(id => ovhApi.get<Remote>(`/overTheBox/${serviceName}/remoteAccesses/${id}`))
    );
  }
}

export const remotesService = new RemotesService();
