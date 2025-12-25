// ============================================================
// SENDERS TAB SERVICE - Service ISOLÉ (défactorisé)
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { SmsSender } from '../../sms.types';

// ============================================================
// SERVICE ISOLÉ - Aucun import croisé entre tabs
// ============================================================

async function listSenders(accountName: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/sms/${accountName}/senders`);
}

async function getSender(accountName: string, sender: string): Promise<SmsSender> {
  return ovhApi.get<SmsSender>(`/sms/${accountName}/senders/${sender}`);
}

async function getSenders(accountName: string): Promise<SmsSender[]> {
  const names = await listSenders(accountName);
  return Promise.all(names.map(name => getSender(accountName, name)));
}

export const sendersService = {
  listSenders,
  getSender,
  getSenders,
};
