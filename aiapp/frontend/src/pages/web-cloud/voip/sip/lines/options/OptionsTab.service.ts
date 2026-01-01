// ============================================================
// OPTIONS TAB SERVICE - Appels API isolés pour Lines Options
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { TelephonyLineOptions } from '../../../voip.types';

export const optionsTabService = {
  async getOptions(billingAccount: string, serviceName: string): Promise<TelephonyLineOptions> {
    return ovhApi.get<TelephonyLineOptions>(`/telephony/${billingAccount}/line/${serviceName}/options`);
  },

  async updateOptions(billingAccount: string, serviceName: string, options: Partial<TelephonyLineOptions>): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/line/${serviceName}/options`, options);
  },
};
