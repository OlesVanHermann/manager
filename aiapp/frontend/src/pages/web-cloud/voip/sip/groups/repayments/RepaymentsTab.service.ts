// ============================================================
// REPAYMENTS TAB SERVICE - Appels API isolés pour Repayments
// Target: target_.web-cloud.voip.group.repayments.svg
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../services/api';

// Types locaux pour ce tab
export interface GroupRepayment {
  consumptionId: number;
  date: string;
  description: string;
  price: number;
  status: 'pending' | 'done' | 'refused';
}

// Service isolé pour RepaymentsTab
export const repaymentsTabService = {
  // Récupérer l'historique des remboursements
  async getRepayments(billingAccount: string): Promise<GroupRepayment[]> {
    return ovhApi
      .get<GroupRepayment[]>(`/telephony/${billingAccount}/historyRepaymentConsumption`)
      .catch(() => []);
  },

  // Demander un remboursement
  async requestRepayment(billingAccount: string, consumptionId: number): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/repaymentConsumption`, {
      consumptionId,
    });
  },
};
