// ============================================================
// CALLS TAB SERVICE - Appels API isolés pour Numbers Calls
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../services/api';

export interface NumberCall {
  id: string;
  callingNumber: string;
  calledNumber: string;
  date: string;
  duration: number;
  type: 'incoming' | 'outgoing';
  price: number;
}

export const callsTabService = {
  async getCalls(billingAccount: string, serviceName: string): Promise<NumberCall[]> {
    try {
      const ids = await ovhApi.get<string[]>(`/telephony/${billingAccount}/number/${serviceName}/calls`);
      const calls = await Promise.all(
        ids.slice(0, 50).map(async (id) => {
          try {
            return await ovhApi.get<NumberCall>(`/telephony/${billingAccount}/number/${serviceName}/calls/${id}`);
          } catch {
            return null;
          }
        })
      );
      return calls.filter((c): c is NumberCall => c !== null);
    } catch {
      return [];
    }
  },
};
