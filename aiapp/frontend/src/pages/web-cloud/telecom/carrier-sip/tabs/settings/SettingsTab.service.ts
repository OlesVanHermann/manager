// ============================================================
// SETTINGS TAB SERVICE - API calls isolés
// ============================================================

import { ovhApi } from '../../../../../../services/api';

interface CarrierSipSettings {
  description: string;
  maxCalls: number;
  secureCall: boolean;
  ipRestriction: string[];
  codecs: string[];
}

interface CarrierSipCredentials {
  username: string;
  password?: string;
  realm: string;
}

export const settingsService = {
  async getSettings(billingAccount: string, serviceName: string): Promise<CarrierSipSettings> {
    try {
      return await ovhApi.get<CarrierSipSettings>(
        `/telephony/${billingAccount}/carrierSip/${serviceName}`
      );
    } catch {
      return {
        description: '',
        maxCalls: 0,
        secureCall: false,
        ipRestriction: [],
        codecs: [],
      };
    }
  },

  async updateSettings(
    billingAccount: string,
    serviceName: string,
    settings: Partial<CarrierSipSettings>
  ): Promise<void> {
    await ovhApi.put(
      `/telephony/${billingAccount}/carrierSip/${serviceName}`,
      settings
    );
  },

  async getCredentials(billingAccount: string, serviceName: string): Promise<CarrierSipCredentials> {
    try {
      return await ovhApi.get<CarrierSipCredentials>(
        `/telephony/${billingAccount}/carrierSip/${serviceName}/credentials`
      );
    } catch {
      return {
        username: '',
        realm: '',
      };
    }
  },

  async regeneratePassword(billingAccount: string, serviceName: string): Promise<string> {
    const result = await ovhApi.post<{ password: string }>(
      `/telephony/${billingAccount}/carrierSip/${serviceName}/credentials/password`,
      {}
    );
    return result.password;
  },

  async addIpRestriction(
    billingAccount: string,
    serviceName: string,
    ip: string
  ): Promise<void> {
    await ovhApi.post(
      `/telephony/${billingAccount}/carrierSip/${serviceName}/ipRestriction`,
      { ip }
    );
  },

  async removeIpRestriction(
    billingAccount: string,
    serviceName: string,
    ip: string
  ): Promise<void> {
    await ovhApi.delete(
      `/telephony/${billingAccount}/carrierSip/${serviceName}/ipRestriction/${encodeURIComponent(ip)}`
    );
  },
};
