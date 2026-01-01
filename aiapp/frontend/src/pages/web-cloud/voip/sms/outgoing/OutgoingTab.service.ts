// ============================================================
// OUTGOING TAB SERVICE - Service ISOLÉ (défactorisé)
// ============================================================

import { ovhApi } from '../../../../../services/api';
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

// DELETE /sms/{serviceName}/outgoing/{id} - Supprimer un SMS sortant
async function deleteOutgoing(accountName: string, id: number): Promise<void> {
  return ovhApi.delete(`/sms/${accountName}/outgoing/${id}`);
}

// GET /sms/{serviceName}/outgoing/{id}/hlr - Récupérer le HLR (Home Location Register)
async function getOutgoingHlr(accountName: string, id: number): Promise<{
  datetime: string;
  countryCode: string;
  operatorCode: string;
  operatorName: string;
  status: string;
} | null> {
  try {
    return await ovhApi.get(`/sms/${accountName}/outgoing/${id}/hlr`);
  } catch {
    return null;
  }
}

export const outgoingService = {
  listOutgoing,
  getOutgoing,
  getOutgoingMessages,
  deleteOutgoing,
  getOutgoingHlr,
};
