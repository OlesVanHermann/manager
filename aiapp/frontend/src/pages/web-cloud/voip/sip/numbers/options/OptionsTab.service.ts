// ============================================================
// OPTIONS TAB SERVICE - Appels API isolés pour Numbers Options
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../../services/api';

export interface NumberOptions {
  simultaneousLines: number;
  voicemail: boolean;
  displayedNumber: string;
  identificationRestriction: boolean;
}

export const optionsTabService = {
  async getOptions(billingAccount: string, serviceName: string): Promise<NumberOptions> {
    return ovhApi.get<NumberOptions>(`/telephony/${billingAccount}/number/${serviceName}/options`);
  },

  async updateOptions(billingAccount: string, serviceName: string, options: Partial<NumberOptions>): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/number/${serviceName}/options`, options);
  },
};
