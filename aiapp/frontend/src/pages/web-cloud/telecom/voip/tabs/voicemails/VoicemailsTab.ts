// ============================================================
// VOICEMAILS TAB SERVICE - Service ISOLÉ (défactorisé)
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { TelephonyVoicemail } from '../../voip.types';

// ============================================================
// SERVICE ISOLÉ - Aucun import croisé entre tabs
// ============================================================

async function listVoicemails(billingAccount: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/telephony/${billingAccount}/voicemail`);
}

async function getVoicemail(billingAccount: string, serviceName: string): Promise<TelephonyVoicemail> {
  return ovhApi.get<TelephonyVoicemail>(`/telephony/${billingAccount}/voicemail/${serviceName}`);
}

async function getVoicemails(billingAccount: string): Promise<TelephonyVoicemail[]> {
  const ids = await listVoicemails(billingAccount);
  return Promise.all(ids.map(id => getVoicemail(billingAccount, id)));
}

export const voicemailsService = {
  listVoicemails,
  getVoicemail,
  getVoicemails,
};
