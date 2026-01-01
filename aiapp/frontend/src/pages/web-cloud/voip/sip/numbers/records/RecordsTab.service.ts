// ============================================================
// RECORDS TAB SERVICE - Appels API isolés pour Numbers Records
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../services/api';

export interface NumberRecord {
  id: string;
  filename: string;
  datetime: string;
  duration: number;
  callerNumber: string;
  calledNumber: string;
  status: 'available' | 'pending' | 'expired';
}

export const recordsTabService = {
  async getRecords(billingAccount: string, serviceName: string): Promise<NumberRecord[]> {
    try {
      const ids = await ovhApi.get<string[]>(`/telephony/${billingAccount}/conference/${serviceName}/histories`);
      const records = await Promise.all(
        ids.slice(0, 20).map(async (id) => {
          try {
            return await ovhApi.get<NumberRecord>(`/telephony/${billingAccount}/conference/${serviceName}/histories/${id}`);
          } catch {
            return null;
          }
        })
      );
      return records.filter((r): r is NumberRecord => r !== null);
    } catch {
      return [];
    }
  },

  async deleteRecord(billingAccount: string, serviceName: string, recordId: string): Promise<void> {
    return ovhApi.delete(`/telephony/${billingAccount}/conference/${serviceName}/histories/${recordId}`);
  },

  async downloadRecord(billingAccount: string, serviceName: string, recordId: string): Promise<string> {
    const result = await ovhApi.get<{ url: string }>(`/telephony/${billingAccount}/conference/${serviceName}/histories/${recordId}/download`);
    return result.url;
  },
};
