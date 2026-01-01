// ============================================================
// BILLING TAB SERVICE - Appels API isolés pour Billing
// Target: target_.web-cloud.voip.group.billing.svg
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { TelephonyHistoryConsumption } from '../../../voip.types';

// Service isolé pour BillingTab
export const billingTabService = {
  // Récupérer l'historique de consommation/facturation
  async getHistoryConsumption(billingAccount: string): Promise<TelephonyHistoryConsumption[]> {
    return ovhApi
      .get<TelephonyHistoryConsumption[]>(`/telephony/${billingAccount}/historyConsumption`)
      .catch(() => []);
  },

  // Calculer le total des consommations
  calculateTotal(consumption: TelephonyHistoryConsumption[]): number {
    return consumption.reduce((sum, c) => sum + c.price.value, 0);
  },
};
