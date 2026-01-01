// ============================================================
// SOUNDS TAB SERVICE - Appels API isolés pour Numbers Sounds
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../services/api';

export interface NumberSound {
  id: number;
  filename: string;
  createdAt: string;
  description: string;
  size: number;
}

export const soundsTabService = {
  async getSounds(billingAccount: string): Promise<NumberSound[]> {
    try {
      const ids = await ovhApi.get<number[]>(`/telephony/${billingAccount}/sound`);
      const sounds = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get<NumberSound>(`/telephony/${billingAccount}/sound/${id}`);
          } catch {
            return null;
          }
        })
      );
      return sounds.filter((s): s is NumberSound => s !== null);
    } catch {
      return [];
    }
  },

  async deleteSound(billingAccount: string, soundId: number): Promise<void> {
    return ovhApi.delete(`/telephony/${billingAccount}/sound/${soundId}`);
  },

  async uploadSound(billingAccount: string, file: File, description: string): Promise<NumberSound> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    return ovhApi.post<NumberSound>(`/telephony/${billingAccount}/sound`, formData);
  },
};
