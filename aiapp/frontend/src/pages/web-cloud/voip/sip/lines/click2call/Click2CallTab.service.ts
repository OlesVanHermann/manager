// ============================================================
// CLICK2CALL TAB SERVICE - Appels API isolés pour Lines Click2Call
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../services/api';

export interface Click2CallUser {
  id: number;
  login: string;
  creationDateTime: string;
}

export const click2callTabService = {
  async getClick2CallUsers(billingAccount: string, serviceName: string): Promise<Click2CallUser[]> {
    const ids = await ovhApi.get<number[]>(`/telephony/${billingAccount}/line/${serviceName}/click2CallUser`).catch(() => []);
    const users = await Promise.all(
      ids.map(async (id) => {
        try {
          return await ovhApi.get<Click2CallUser>(`/telephony/${billingAccount}/line/${serviceName}/click2CallUser/${id}`);
        } catch {
          return null;
        }
      })
    );
    return users.filter((u): u is Click2CallUser => u !== null);
  },

  async createClick2CallUser(billingAccount: string, serviceName: string, data: { login: string; password: string }): Promise<Click2CallUser> {
    return ovhApi.post<Click2CallUser>(`/telephony/${billingAccount}/line/${serviceName}/click2CallUser`, data);
  },

  async deleteClick2CallUser(billingAccount: string, serviceName: string, userId: number): Promise<void> {
    return ovhApi.delete(`/telephony/${billingAccount}/line/${serviceName}/click2CallUser/${userId}`);
  },

  async click2Call(billingAccount: string, serviceName: string, calledNumber: string): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/click2Call`, { calledNumber });
  },
};
