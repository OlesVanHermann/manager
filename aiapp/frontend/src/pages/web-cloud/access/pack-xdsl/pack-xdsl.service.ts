// ============================================================
// SERVICE PACK-XDSL PAGE - Listing et détails isolés
// ============================================================

import { ovhApi } from '../../../../services/api';
import type { Pack } from './pack-xdsl.types';

class PackXdslPageService {
  /** Liste tous les packs xDSL. */
  async listPacks(): Promise<string[]> {
    return ovhApi.get<string[]>('/pack/xdsl');
  }

  /** Récupère les détails d'un pack. */
  async getPack(packName: string): Promise<Pack> {
    return ovhApi.get<Pack>(`/pack/xdsl/${packName}`);
  }
}

export const packXdslPageService = new PackXdslPageService();
