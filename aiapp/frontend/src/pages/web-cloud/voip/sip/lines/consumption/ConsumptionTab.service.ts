// ============================================================
// CONSUMPTION TAB SERVICE - Appels API isolés pour Lines Consumption
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../services/api';

export interface LineConsumption {
  consumptionId: number;
  creationDatetime: string;
  designation: string;
  destinationType: string;
  dialed: string;
  duration: number;
  planType: string;
  priceWithoutTax: { value: number; currencyCode: string };
  wayType: 'incoming' | 'outgoing' | 'transfer';
}

export const consumptionTabService = {
  // GET /telephony/{ba}/service/{sn}/voiceConsumption - Liste des IDs de consommation
  // GET /telephony/{ba}/service/{sn}/voiceConsumption/{id} - Détail d'une consommation
  async getConsumption(billingAccount: string, serviceName: string): Promise<LineConsumption[]> {
    try {
      // API correcte: GET /telephony/{ba}/service/{sn}/voiceConsumption
      const ids = await ovhApi.get<number[]>(
        `/telephony/${billingAccount}/service/${serviceName}/voiceConsumption`
      );
      // Récupérer les détails de chaque consommation (limité aux 50 dernières)
      const consumptions = await Promise.all(
        ids.slice(0, 50).map(async (consumptionId) => {
          try {
            return await ovhApi.get<LineConsumption>(
              `/telephony/${billingAccount}/service/${serviceName}/voiceConsumption/${consumptionId}`
            );
          } catch {
            return null;
          }
        })
      );
      return consumptions.filter((c): c is LineConsumption => c !== null);
    } catch {
      return [];
    }
  },

  calculateTotal(consumption: LineConsumption[]): number {
    return consumption.reduce((sum, c) => sum + (c.priceWithoutTax?.value || 0), 0);
  },

  calculateTotalDuration(consumption: LineConsumption[]): number {
    return consumption.reduce((sum, c) => sum + c.duration, 0);
  },
};
