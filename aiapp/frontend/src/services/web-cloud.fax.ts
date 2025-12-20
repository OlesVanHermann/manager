// ============================================================
// SERVICE WEB-CLOUD FAX - FreeFax OVHcloud
// ============================================================

import { ovhApi } from './api';

// ============================================================
// TYPES
// ============================================================

export interface FreefaxAccount {
  number: string;
  fromName: string;
  fromEmail: string;
  redirectionEmail: string[];
  faxQuality: 'best' | 'high' | 'normal';
  faxMaxCall: number;
  faxTagLine: string;
}

// ============================================================
// SERVICE
// ============================================================

class FaxService {
  /** Liste tous les services FreeFax. */
  async listFreefax(): Promise<string[]> {
    return ovhApi.get<string[]>('/freefax');
  }

  /** Alias pour compatibilite. */
  async listServices(): Promise<string[]> {
    return this.listFreefax();
  }

  /** Recupere les details d'un service FreeFax. */
  async getFreefax(serviceName: string): Promise<FreefaxAccount> {
    return ovhApi.get<FreefaxAccount>(`/freefax/${serviceName}`);
  }
}

export const faxService = new FaxService();
