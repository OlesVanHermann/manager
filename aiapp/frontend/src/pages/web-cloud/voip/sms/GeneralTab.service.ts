// ============================================================
// SMS GENERAL TAB SERVICE - API calls isolés
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { SmsAccount } from '../../sms.types';

interface SmsStats {
  sent: number;
  received: number;
  pending: number;
}

export const generalService = {
  async getAccount(serviceName: string): Promise<SmsAccount> {
    return ovhApi.get<SmsAccount>(`/sms/${serviceName}`);
  },

  async getStatistics(serviceName: string): Promise<SmsStats> {
    try {
      // Try to get real stats from API
      const outgoing = await ovhApi.get<number[]>(`/sms/${serviceName}/outgoing`);
      const incoming = await ovhApi.get<number[]>(`/sms/${serviceName}/incoming`);
      const jobs = await ovhApi.get<number[]>(`/sms/${serviceName}/jobs`);

      return {
        sent: outgoing.length,
        received: incoming.length,
        pending: jobs.length,
      };
    } catch {
      // Fallback to mock data if API fails
      return { sent: 0, received: 0, pending: 0 };
    }
  },

  async getSenders(serviceName: string): Promise<string[]> {
    try {
      return await ovhApi.get<string[]>(`/sms/${serviceName}/senders`);
    } catch {
      return [];
    }
  },
};
