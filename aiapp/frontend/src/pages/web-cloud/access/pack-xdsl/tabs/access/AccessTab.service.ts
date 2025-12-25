// ============================================================
// SERVICE ACCESS - Isolé pour AccessTab (Pack xDSL)
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { XdslAccess } from '../../pack-xdsl.types';

class AccessService {
  /** Récupère les accès xDSL d'un pack. */
  async getAccesses(packName: string): Promise<XdslAccess[]> {
    const ids = await ovhApi.get<string[]>(`/pack/xdsl/${packName}/xdslAccess/services`);
    return Promise.all(ids.map(id => ovhApi.get<XdslAccess>(`/xdsl/${id}`)));
  }
}

export const accessService = new AccessService();
