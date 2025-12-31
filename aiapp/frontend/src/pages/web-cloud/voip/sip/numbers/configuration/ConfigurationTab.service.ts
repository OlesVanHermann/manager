// ============================================================
// CONFIGURATION TAB SERVICE - Appels API isolés pour Numbers Configuration
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../../services/api';

export interface NumberConference {
  pin: string;
  recordStatus: boolean;
  language: string;
  reportEmail: string;
  roomNumber: number;
}

export interface RedirectConfig {
  destination: string;
  featureType: string;
}

export const configurationTabService = {
  async getConference(billingAccount: string, serviceName: string): Promise<NumberConference | null> {
    try {
      return await ovhApi.get<NumberConference>(`/telephony/${billingAccount}/conference/${serviceName}`);
    } catch {
      return null;
    }
  },

  async updateConference(billingAccount: string, serviceName: string, data: Partial<NumberConference>): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/conference/${serviceName}`, data);
  },

  async getRedirect(billingAccount: string, serviceName: string): Promise<RedirectConfig | null> {
    try {
      return await ovhApi.get<RedirectConfig>(`/telephony/${billingAccount}/redirect/${serviceName}`);
    } catch {
      return null;
    }
  },

  async updateRedirect(billingAccount: string, serviceName: string, data: Partial<RedirectConfig>): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/redirect/${serviceName}`, data);
  },

  async changeFeature(billingAccount: string, serviceName: string, featureType: string): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/number/${serviceName}/changeFeatureType`, { featureType });
  },
};
