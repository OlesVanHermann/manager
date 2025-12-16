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
  async listFreefax(): Promise<string[]> {
    return ovhApi.get<string[]>('/freefax');
  }

  async getFreefax(serviceName: string): Promise<FreefaxAccount> {
    return ovhApi.get<FreefaxAccount>(`/freefax/${serviceName}`);
  }
}

export const faxService = new FaxService();
