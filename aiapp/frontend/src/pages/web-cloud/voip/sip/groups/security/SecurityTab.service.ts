// ============================================================
// SECURITY TAB SERVICE - Appels API isolés pour Security
// Target: target_.web-cloud.voip.group.security.svg
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../../services/api';

// Types locaux pour ce tab
export interface GroupEventToken {
  token: string;
  type: string;
  callbackUrl: string;
  expiration?: string;
}

export interface CreateTokenData {
  type: string;
  callbackUrl: string;
}

// Service isolé pour SecurityTab
export const securityTabService = {
  // Récupérer les event tokens
  async getEventTokens(billingAccount: string): Promise<GroupEventToken[]> {
    const tokens = await ovhApi.get<string[]>(`/telephony/${billingAccount}/eventToken`).catch(() => []);
    const details = await Promise.all(
      tokens.map(async (token) => {
        try {
          return await ovhApi.get<GroupEventToken>(
            `/telephony/${billingAccount}/eventToken/${token}`
          );
        } catch {
          return null;
        }
      })
    );
    return details.filter((t): t is GroupEventToken => t !== null);
  },

  // Créer un event token
  async createEventToken(billingAccount: string, data: CreateTokenData): Promise<GroupEventToken> {
    return ovhApi.post<GroupEventToken>(`/telephony/${billingAccount}/eventToken`, data);
  },

  // Supprimer un event token
  async deleteEventToken(billingAccount: string, token: string): Promise<void> {
    return ovhApi.delete(`/telephony/${billingAccount}/eventToken/${token}`);
  },
};
