// ============================================================
// SERVICE GENERAL - Isolé pour GeneralTab (Pack xDSL)
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { Pack } from '../../pack-xdsl.types';

class GeneralService {
  /** Récupère les détails d'un pack xDSL. */
  async getPack(packName: string): Promise<Pack> {
    return ovhApi.get<Pack>(`/pack/xdsl/${packName}`);
  }
}

export const generalService = new GeneralService();
