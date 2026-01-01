// ============================================================
// CONSUMPTION TAB SERVICE - Appels API isolés pour Numbers Consumption
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../services/api';

export interface NumberConsumption {
  date: string;
  type: string;
  called: string;
  duration: number;
  price: { value: number; currency: string };
}

export const consumptionTabService = {
  async getConsumption(billingAccount: string, serviceName: string): Promise<NumberConsumption[]> {
    return ovhApi.get<NumberConsumption[]>(`/telephony/${billingAccount}/number/${serviceName}/statistics/consumption`).catch(() => []);
  },

  calculateTotal(consumption: NumberConsumption[]): number {
    return consumption.reduce((sum, c) => sum + c.price.value, 0);
  },

  calculateTotalDuration(consumption: NumberConsumption[]): number {
    return consumption.reduce((sum, c) => sum + c.duration, 0);
  },
};
