// ============================================================
// PHONE TAB SERVICE - Appels API isolés pour Lines Phone
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../../services/api';
import type { TelephonyPhone } from '../../../voip.types';

export interface PhoneFunctionKey {
  keyNum: number;
  function: string;
  parameter: string;
  label: string;
}

export const phoneTabService = {
  async getPhone(billingAccount: string, serviceName: string): Promise<TelephonyPhone | null> {
    try {
      return await ovhApi.get<TelephonyPhone>(`/telephony/${billingAccount}/line/${serviceName}/phone`);
    } catch {
      return null;
    }
  },

  async rebootPhone(billingAccount: string, serviceName: string): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/phone/reboot`);
  },

  async resetPhoneConfig(billingAccount: string, serviceName: string): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/phone/resetConfig`);
  },

  async getFunctionKeys(billingAccount: string, serviceName: string): Promise<PhoneFunctionKey[]> {
    try {
      const keyNums = await ovhApi.get<number[]>(`/telephony/${billingAccount}/line/${serviceName}/phone/functionKey`);
      const keys = await Promise.all(
        keyNums.map(async (keyNum) => {
          try {
            return await ovhApi.get<PhoneFunctionKey>(`/telephony/${billingAccount}/line/${serviceName}/phone/functionKey/${keyNum}`);
          } catch {
            return null;
          }
        })
      );
      return keys.filter((k): k is PhoneFunctionKey => k !== null);
    } catch {
      return [];
    }
  },

  async updateFunctionKey(billingAccount: string, serviceName: string, keyNum: number, data: Partial<PhoneFunctionKey>): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/line/${serviceName}/phone/functionKey/${keyNum}`, data);
  },
};
