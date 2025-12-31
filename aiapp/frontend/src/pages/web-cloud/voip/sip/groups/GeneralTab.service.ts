// ============================================================
// GENERAL TAB SERVICE - Appels API isolés pour General
// Target: target_.web-cloud.voip.group.general.svg
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../../services/api';
import type { TelephonyBillingAccount } from '../../../voip.types';

// Types locaux pour ce tab
export interface GeneralServiceInfos {
  domain: string;
  status: string;
  creation: string;
  expiration: string;
  engagedUpTo: string | null;
  renew: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    period: number;
  };
}

// Service isolé pour GeneralTab
export const generalTabService = {
  // Récupérer les détails du groupe
  async getGroup(billingAccount: string): Promise<TelephonyBillingAccount> {
    return ovhApi.get<TelephonyBillingAccount>(`/telephony/${billingAccount}`);
  },

  // Modifier le groupe (description)
  async updateGroup(billingAccount: string, data: { description?: string }): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}`, data);
  },

  // Récupérer les infos de service/abonnement
  async getServiceInfos(billingAccount: string): Promise<GeneralServiceInfos> {
    return ovhApi.get<GeneralServiceInfos>(`/telephony/${billingAccount}/serviceInfos`);
  },

  // Récupérer le nombre de lignes
  async getLinesCount(billingAccount: string): Promise<number> {
    const lines = await ovhApi.get<string[]>(`/telephony/${billingAccount}/line`).catch(() => []);
    return lines.length;
  },

  // Récupérer le nombre de numéros
  async getNumbersCount(billingAccount: string): Promise<number> {
    const numbers = await ovhApi.get<string[]>(`/telephony/${billingAccount}/number`).catch(() => []);
    return numbers.length;
  },

  // Récupérer le nombre de fax
  async getFaxCount(billingAccount: string): Promise<number> {
    const fax = await ovhApi.get<string[]>(`/telephony/${billingAccount}/fax`).catch(() => []);
    return fax.length;
  },

  // Récupérer tous les compteurs
  async getServiceCounts(billingAccount: string): Promise<{
    lines: number;
    numbers: number;
    fax: number;
  }> {
    const [lines, numbers, fax] = await Promise.all([
      this.getLinesCount(billingAccount),
      this.getNumbersCount(billingAccount),
      this.getFaxCount(billingAccount),
    ]);
    return { lines, numbers, fax };
  },
};
