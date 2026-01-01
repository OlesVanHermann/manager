// ============================================================
// INCOMING TAB SERVICE - Service ISOLÉ (défactorisé)
// ============================================================

import { ovhApi } from '../../../../../services/api';
import type { SmsIncoming } from '../../sms.types';

// ============================================================
// SERVICE ISOLÉ - Aucun import croisé entre tabs
// ============================================================

async function listIncoming(accountName: string): Promise<number[]> {
  return ovhApi.get<number[]>(`/sms/${accountName}/incoming`);
}

async function getIncoming(accountName: string, id: number): Promise<SmsIncoming> {
  return ovhApi.get<SmsIncoming>(`/sms/${accountName}/incoming/${id}`);
}

async function getIncomingMessages(accountName: string, limit: number = 50): Promise<SmsIncoming[]> {
  const ids = await listIncoming(accountName);
  const messages = await Promise.all(
    ids.slice(0, limit).map(id => getIncoming(accountName, id))
  );
  // Tri par date décroissante
  messages.sort((a, b) => 
    new Date(b.creationDatetime).getTime() - new Date(a.creationDatetime).getTime()
  );
  return messages;
}

export const incomingService = {
  listIncoming,
  getIncoming,
  getIncomingMessages,
};
