// ============================================================
// CALLS TAB SERVICE - Appels API isolés pour Lines Calls
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../services/api';

export interface LineCall {
  id: string;
  called: string;
  calling: string;
  datetime: string;
  duration: number;
  destination: string;
  type: 'incoming' | 'outgoing' | 'missed';
}

export const callsTabService = {
  async getCalls(billingAccount: string, serviceName: string): Promise<LineCall[]> {
    const ids = await ovhApi.get<string[]>(`/telephony/${billingAccount}/line/${serviceName}/calls`).catch(() => []);
    const calls = await Promise.all(
      ids.slice(0, 50).map(async (id) => {
        try {
          return await ovhApi.get<LineCall>(`/telephony/${billingAccount}/line/${serviceName}/calls/${id}`);
        } catch {
          return null;
        }
      })
    );
    return calls.filter((c): c is LineCall => c !== null);
  },
};
