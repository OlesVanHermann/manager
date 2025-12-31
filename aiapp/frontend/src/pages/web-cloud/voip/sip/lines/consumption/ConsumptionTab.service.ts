// ============================================================
// CONSUMPTION TAB SERVICE - Appels API isolés pour Lines Consumption
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../../services/api';

export interface LineConsumption {
  date: string;
  type: string;
  called: string;
  duration: number;
  price: { value: number; currency: string };
}

export const consumptionTabService = {
  async getConsumption(billingAccount: string, serviceName: string): Promise<LineConsumption[]> {
    return ovhApi.get<LineConsumption[]>(`/telephony/${billingAccount}/line/${serviceName}/statistics/consumption`).catch(() => []);
  },

  calculateTotal(consumption: LineConsumption[]): number {
    return consumption.reduce((sum, c) => sum + c.price.value, 0);
  },

  calculateTotalDuration(consumption: LineConsumption[]): number {
    return consumption.reduce((sum, c) => sum + c.duration, 0);
  },
};
