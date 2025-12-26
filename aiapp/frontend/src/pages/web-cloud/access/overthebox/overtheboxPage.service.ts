// ============================================================
// SERVICE OVERTHEBOX PAGE - Listing et détails isolés
// ============================================================

import { ovhApi } from '../../../../services/api';
import type { OverTheBox } from './overthebox.types';

class OvertheboxPageService {
  /** Liste tous les services OverTheBox. */
  async listServices(): Promise<string[]> {
    return ovhApi.get<string[]>('/overTheBox');
  }

  /** Récupère les détails d'un service. */
  async getService(serviceName: string): Promise<OverTheBox> {
    return ovhApi.get<OverTheBox>(`/overTheBox/${serviceName}`);
  }
}

export const overtheboxPageService = new OvertheboxPageService();
