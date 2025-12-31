// ============================================================
// GENERAL TAB SERVICE - Appels API isolés pour Lines General
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../../services/api';
import type { TelephonyLine } from '../../../voip.types';

export interface LineServiceInfos {
  domain: string;
  status: string;
  creation: string;
  expiration: string;
  engagedUpTo: string | null;
  renew: { automatic: boolean; deleteAtExpiration: boolean };
}

export const generalTabService = {
  async getLine(billingAccount: string, serviceName: string): Promise<TelephonyLine> {
    return ovhApi.get<TelephonyLine>(`/telephony/${billingAccount}/line/${serviceName}`);
  },

  async updateLine(billingAccount: string, serviceName: string, data: Partial<TelephonyLine>): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/line/${serviceName}`, data);
  },

  async getServiceInfos(billingAccount: string, serviceName: string): Promise<LineServiceInfos> {
    return ovhApi.get<LineServiceInfos>(`/telephony/${billingAccount}/line/${serviceName}/serviceInfos`);
  },

  async changePassword(billingAccount: string, serviceName: string, password: string): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/changePassword`, { password });
  },
};
