// ============================================================
// DASHBOARD TAB SERVICE - Appels API isolés pour Lines Dashboard
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { TelephonyLine, TelephonyPhone } from '../../../voip.types';

export const dashboardTabService = {
  async getLine(billingAccount: string, serviceName: string): Promise<TelephonyLine> {
    return ovhApi.get<TelephonyLine>(`/telephony/${billingAccount}/line/${serviceName}`);
  },

  async getPhone(billingAccount: string, serviceName: string): Promise<TelephonyPhone | null> {
    try {
      return await ovhApi.get<TelephonyPhone>(`/telephony/${billingAccount}/line/${serviceName}/phone`);
    } catch {
      return null;
    }
  },

  async getRecentCalls(billingAccount: string, serviceName: string): Promise<number> {
    try {
      const ids = await ovhApi.get<string[]>(`/telephony/${billingAccount}/line/${serviceName}/calls`);
      return ids.length;
    } catch {
      return 0;
    }
  },

  async loadDashboardData(billingAccount: string, serviceName: string) {
    const [line, phone, callsCount] = await Promise.all([
      this.getLine(billingAccount, serviceName),
      this.getPhone(billingAccount, serviceName),
      this.getRecentCalls(billingAccount, serviceName),
    ]);
    return { line, phone, callsCount };
  },
};
