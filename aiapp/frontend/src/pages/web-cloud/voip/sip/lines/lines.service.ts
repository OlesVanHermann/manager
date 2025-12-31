// ============================================================
// LINES SERVICE - Appels API pour la gestion des lignes VoIP
// ============================================================

import { ovhApi } from '../../../../../services/api';
import type { TelephonyLine, TelephonyPhone, TelephonyLineOptions } from '../voip.types';
import type {
  LineServiceInfos,
  LineOptions,
  LineCall,
  LineConsumption,
  Click2CallUser,
  PhoneConfiguration,
} from './lines.types';

export const linesService = {
  // ---------- GENERAL ----------

  async getLine(billingAccount: string, serviceName: string): Promise<TelephonyLine> {
    return ovhApi.get<TelephonyLine>(`/telephony/${billingAccount}/line/${serviceName}`);
  },

  async updateLine(
    billingAccount: string,
    serviceName: string,
    data: Partial<TelephonyLine>
  ): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/line/${serviceName}`, data);
  },

  async getServiceInfos(billingAccount: string, serviceName: string): Promise<LineServiceInfos> {
    return ovhApi.get<LineServiceInfos>(
      `/telephony/${billingAccount}/line/${serviceName}/serviceInfos`
    );
  },

  // ---------- PHONE ----------

  async getPhone(billingAccount: string, serviceName: string): Promise<TelephonyPhone | null> {
    try {
      return await ovhApi.get<TelephonyPhone>(
        `/telephony/${billingAccount}/line/${serviceName}/phone`
      );
    } catch {
      return null;
    }
  },

  async getPhoneConfiguration(
    billingAccount: string,
    serviceName: string
  ): Promise<PhoneConfiguration | null> {
    try {
      const phone = await this.getPhone(billingAccount, serviceName);
      if (!phone) return null;
      return {
        macAddress: phone.macAddress,
        protocol: phone.protocol,
        ipAddress: phone.ip,
        firmwareVersion: phone.softwareVersion,
      };
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

  // ---------- OPTIONS ----------

  async getOptions(billingAccount: string, serviceName: string): Promise<TelephonyLineOptions> {
    return ovhApi.get<TelephonyLineOptions>(
      `/telephony/${billingAccount}/line/${serviceName}/options`
    );
  },

  async updateOptions(
    billingAccount: string,
    serviceName: string,
    options: Partial<TelephonyLineOptions>
  ): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/line/${serviceName}/options`, options);
  },

  // ---------- CALLS ----------

  async getCalls(billingAccount: string, serviceName: string): Promise<LineCall[]> {
    const ids = await ovhApi
      .get<string[]>(`/telephony/${billingAccount}/line/${serviceName}/calls`)
      .catch(() => []);
    const calls = await Promise.all(
      ids.slice(0, 50).map(async (id) => {
        try {
          return await ovhApi.get<LineCall>(
            `/telephony/${billingAccount}/line/${serviceName}/calls/${id}`
          );
        } catch {
          return null;
        }
      })
    );
    return calls.filter((c): c is LineCall => c !== null);
  },

  // ---------- CONSUMPTION ----------

  async getConsumption(billingAccount: string, serviceName: string): Promise<LineConsumption[]> {
    return ovhApi
      .get<LineConsumption[]>(
        `/telephony/${billingAccount}/line/${serviceName}/statistics/consumption`
      )
      .catch(() => []);
  },

  // ---------- CLICK2CALL ----------

  async getClick2CallUsers(billingAccount: string, serviceName: string): Promise<Click2CallUser[]> {
    const ids = await ovhApi
      .get<number[]>(`/telephony/${billingAccount}/line/${serviceName}/click2CallUser`)
      .catch(() => []);
    const users = await Promise.all(
      ids.map(async (id) => {
        try {
          return await ovhApi.get<Click2CallUser>(
            `/telephony/${billingAccount}/line/${serviceName}/click2CallUser/${id}`
          );
        } catch {
          return null;
        }
      })
    );
    return users.filter((u): u is Click2CallUser => u !== null);
  },

  async createClick2CallUser(
    billingAccount: string,
    serviceName: string,
    data: { login: string; password: string }
  ): Promise<Click2CallUser> {
    return ovhApi.post<Click2CallUser>(
      `/telephony/${billingAccount}/line/${serviceName}/click2CallUser`,
      data
    );
  },

  async deleteClick2CallUser(
    billingAccount: string,
    serviceName: string,
    userId: number
  ): Promise<void> {
    return ovhApi.delete(
      `/telephony/${billingAccount}/line/${serviceName}/click2CallUser/${userId}`
    );
  },

  async click2Call(
    billingAccount: string,
    serviceName: string,
    calledNumber: string
  ): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/click2Call`, {
      calledNumber,
    });
  },

  // ---------- VOICEMAIL ----------

  async getVoicemailConfig(
    billingAccount: string,
    serviceName: string
  ): Promise<{
    active: boolean;
    audioFormat: string;
    doNotRecord: boolean;
    forcePassword: boolean;
    fromEmail: string;
    keepMessage: boolean;
    redirectionEmails: string[];
  }> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/line/${serviceName}/voicemail`);
    } catch {
      return {
        active: false,
        audioFormat: 'wav',
        doNotRecord: false,
        forcePassword: false,
        fromEmail: '',
        keepMessage: true,
        redirectionEmails: [],
      };
    }
  },

  async updateVoicemailConfig(
    billingAccount: string,
    serviceName: string,
    config: Partial<{
      active: boolean;
      audioFormat: string;
      doNotRecord: boolean;
      forcePassword: boolean;
      keepMessage: boolean;
      redirectionEmails: string[];
    }>
  ): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/line/${serviceName}/voicemail`, config);
  },

  async changeVoicemailPassword(
    billingAccount: string,
    serviceName: string,
    password: string
  ): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/voicemail/changePassword`, {
      password,
    });
  },

  async getVoicemailMessages(
    billingAccount: string,
    serviceName: string
  ): Promise<
    Array<{
      id: string;
      caller: string;
      datetime: string;
      duration: number;
      status: 'new' | 'read';
    }>
  > {
    try {
      const voicemailNumber = serviceName;
      const ids = await ovhApi.get<string[]>(
        `/telephony/${billingAccount}/voicemail/${voicemailNumber}/directories`
      );
      const messages = await Promise.all(
        ids.slice(0, 20).map(async (id) => {
          try {
            const msg = await ovhApi.get<{
              id: string;
              callerIdName: string;
              callerIdNumber: string;
              datetime: string;
              duration: number;
              dir: string;
            }>(`/telephony/${billingAccount}/voicemail/${voicemailNumber}/directories/${id}`);
            return {
              id: msg.id,
              caller: msg.callerIdNumber || msg.callerIdName || 'Inconnu',
              datetime: msg.datetime,
              duration: msg.duration,
              status: (msg.dir === 'inbox' ? 'new' : 'read') as 'new' | 'read',
            };
          } catch {
            return null;
          }
        })
      );
      return messages.filter((m): m is NonNullable<typeof m> => m !== null);
    } catch {
      return [];
    }
  },

  async getVoicemailMessageAudio(
    billingAccount: string,
    serviceName: string,
    messageId: string
  ): Promise<string> {
    const voicemailNumber = serviceName;
    const result = await ovhApi.get<{ url: string }>(
      `/telephony/${billingAccount}/voicemail/${voicemailNumber}/directories/${messageId}/download`
    );
    return result.url;
  },

  async deleteVoicemailMessage(
    billingAccount: string,
    serviceName: string,
    messageId: string
  ): Promise<void> {
    const voicemailNumber = serviceName;
    return ovhApi.delete(
      `/telephony/${billingAccount}/voicemail/${voicemailNumber}/directories/${messageId}`
    );
  },
};
