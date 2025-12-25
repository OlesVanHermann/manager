// ============================================================
// OUTGOING TAB SERVICE - Service ISOLÉ (défactorisé)
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { SmsOutgoing } from '../../sms.types';

// ============================================================
// SERVICE ISOLÉ - Aucun import croisé entre tabs
// ============================================================

async function listOutgoing(accountName: string): Promise<number[]> {
  return ovhApi.get<number[]>(`/sms/${accountName}/outgoing`);
}

async function getOutgoing(accountName: string, id: number): Promise<SmsOutgoing> {
  return ovhApi.get<SmsOutgoing>(`/sms/${accountName}/outgoing/${id}`);
}

async function getOutgoingMessages(accountName: string, limit: number = 50): Promise<SmsOutgoing[]> {
  const ids = await listOutgoing(accountName);
  const messages = await Promise.all(
    ids.slice(0, limit).map(id => getOutgoing(accountName, id))
  );
  // Tri par date décroissante
  messages.sort((a, b) => 
    new Date(b.creationDatetime).getTime() - new Date(a.creationDatetime).getTime()
  );
  return messages;
}

export const outgoingService = {
  listOutgoing,
  getOutgoing,
  getOutgoingMessages,
};
