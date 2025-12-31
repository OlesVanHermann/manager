// ============================================================
// VOICEMAIL TAB SERVICE - Appels API isolés pour Lines Voicemail
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../../services/api';

export interface VoicemailConfig {
  active: boolean;
  audioFormat: string;
  doNotRecord: boolean;
  forcePassword: boolean;
  fromEmail: string;
  keepMessage: boolean;
  redirectionEmails: string[];
}

export interface VoicemailMessage {
  id: string;
  caller: string;
  datetime: string;
  duration: number;
  status: 'new' | 'read';
}

export const voicemailTabService = {
  async getVoicemailConfig(billingAccount: string, serviceName: string): Promise<VoicemailConfig> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/voicemail/${serviceName}/settings`);
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

  async updateVoicemailConfig(billingAccount: string, serviceName: string, config: Partial<VoicemailConfig>): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/voicemail/${serviceName}/settings`, config);
  },

  async changeVoicemailPassword(billingAccount: string, serviceName: string, password: string): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/voicemail/${serviceName}/changePassword`, { password });
  },

  async getVoicemailMessages(billingAccount: string, serviceName: string): Promise<VoicemailMessage[]> {
    try {
      const ids = await ovhApi.get<string[]>(`/telephony/${billingAccount}/voicemail/${serviceName}/directories`);
      const messages = await Promise.all(
        ids.slice(0, 20).map(async (id) => {
          try {
            const msg = await ovhApi.get<any>(`/telephony/${billingAccount}/voicemail/${serviceName}/directories/${id}`);
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
      return messages.filter((m): m is VoicemailMessage => m !== null);
    } catch {
      return [];
    }
  },

  async deleteVoicemailMessage(billingAccount: string, serviceName: string, messageId: string): Promise<void> {
    return ovhApi.delete(`/telephony/${billingAccount}/voicemail/${serviceName}/directories/${messageId}`);
  },
};
