// ============================================================
// SERVICE GENERAL - Isolé pour GeneralTab (OverTheBox)
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { OverTheBox } from '../../overthebox.types';

class GeneralService {
  /** Récupère les détails d'un service OverTheBox. */
  async getService(serviceName: string): Promise<OverTheBox> {
    return ovhApi.get<OverTheBox>(`/overTheBox/${serviceName}`);
  }
}

export const generalService = new GeneralService();
