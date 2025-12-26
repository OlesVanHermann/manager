// ============================================================
// SERVICE FAX PAGE - Listing et détails isolés
// ============================================================

import { ovhApi } from '../../../../services/api';
import type { FreefaxAccount } from './fax.types';

class FaxPageService {
  /** Liste tous les services FreeFax. */
  async listFreefax(): Promise<string[]> {
    return ovhApi.get<string[]>('/freefax');
  }

  /** Récupère les détails d'un service FreeFax. */
  async getFreefax(serviceName: string): Promise<FreefaxAccount> {
    return ovhApi.get<FreefaxAccount>(`/freefax/${serviceName}`);
  }

  /** Alias pour listFreefax. */
  async listServices(): Promise<string[]> {
    return this.listFreefax();
  }
}

export const faxPageService = new FaxPageService();
