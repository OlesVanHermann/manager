// ============================================================
// STATS TAB SERVICE - Appels API isolés pour Numbers Stats
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../../services/api';

export interface NumberStats {
  period: string;
  incomingCalls: number;
  outgoingCalls: number;
  missedCalls: number;
  totalDuration: number;
  averageDuration: number;
}

export interface HuntingStats {
  agentId: string;
  calls: number;
  averageCallTime: number;
  averageWaitTime: number;
}

export const statsTabService = {
  async getStats(billingAccount: string, serviceName: string, period: string = 'lastMonth'): Promise<NumberStats | null> {
    try {
      return await ovhApi.get<NumberStats>(`/telephony/${billingAccount}/number/${serviceName}/statistics?period=${period}`);
    } catch {
      return null;
    }
  },

  async getHuntingStats(billingAccount: string, serviceName: string): Promise<HuntingStats[]> {
    try {
      return await ovhApi.get<HuntingStats[]>(`/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/statistics`);
    } catch {
      return [];
    }
  },
};
