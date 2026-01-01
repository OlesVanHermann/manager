// ============================================================
// GENERAL TAB SERVICE - Appels API isolés pour Numbers General
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { TelephonyNumber } from '../../../voip.types';

export interface NumberServiceInfos {
  domain: string;
  status: string;
  creation: string;
  expiration: string;
  engagedUpTo: string | null;
  renew: { automatic: boolean; deleteAtExpiration: boolean };
}

export const generalTabService = {
  async getNumber(billingAccount: string, serviceName: string): Promise<TelephonyNumber> {
    return ovhApi.get<TelephonyNumber>(`/telephony/${billingAccount}/number/${serviceName}`);
  },

  async updateNumber(billingAccount: string, serviceName: string, data: Partial<TelephonyNumber>): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/number/${serviceName}`, data);
  },

  async getServiceInfos(billingAccount: string, serviceName: string): Promise<NumberServiceInfos> {
    return ovhApi.get<NumberServiceInfos>(`/telephony/${billingAccount}/number/${serviceName}/serviceInfos`);
  },
};
