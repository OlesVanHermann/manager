// ============================================================
// FORWARD TAB SERVICE - Appels API isolés pour Lines Forward
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { TelephonyLineOptions } from '../../../voip.types';

export interface ForwardOptions {
  forwardUnconditional: boolean;
  forwardUnconditionalNumber: string;
  forwardNoReply: boolean;
  forwardNoReplyDelay: number;
  forwardNoReplyNumber: string;
  forwardBusy: boolean;
  forwardBusyNumber: string;
  forwardBackup: boolean;
  forwardBackupNumber: string;
}

export const forwardTabService = {
  async getOptions(billingAccount: string, serviceName: string): Promise<TelephonyLineOptions> {
    return ovhApi.get<TelephonyLineOptions>(`/telephony/${billingAccount}/line/${serviceName}/options`);
  },

  async updateOptions(billingAccount: string, serviceName: string, options: Partial<ForwardOptions>): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/line/${serviceName}/options`, options);
  },
};
