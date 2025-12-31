// ============================================================
// GENERAL TAB SERVICE - Isolé pour GeneralTab (Fax)
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { FreefaxAccount } from '../../fax.types';

class GeneralService {
  /** Liste tous les FreeFax. */
  async listFreefax(): Promise<string[]> {
    return ovhApi.get<string[]>('/freefax');
  }

  /** Récupère les détails d'un FreeFax. */
  async getFreefax(serviceName: string): Promise<FreefaxAccount> {
    return ovhApi.get<FreefaxAccount>(`/freefax/${serviceName}`);
  }
}

export const generalService = new GeneralService();
