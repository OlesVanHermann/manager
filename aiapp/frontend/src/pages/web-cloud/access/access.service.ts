// ============================================================
// SERVICE ACCESS - Isolé pour la page Access (listing counts)
// ============================================================

import { ovhApi } from '../../../services/api';

class AccessService {
  /** Liste tous les packs xDSL (pour le count). */
  async listPacks(): Promise<string[]> {
    return ovhApi.get<string[]>('/pack/xdsl');
  }

  /** Liste tous les services OverTheBox (pour le count). */
  async listOvertheboxServices(): Promise<string[]> {
    return ovhApi.get<string[]>('/overTheBox');
  }
}

export const accessService = new AccessService();
