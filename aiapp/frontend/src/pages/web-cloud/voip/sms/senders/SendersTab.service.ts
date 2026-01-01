// ============================================================
// SENDERS TAB SERVICE - Service ISOLÉ (défactorisé)
// ============================================================

import { ovhApi } from '../../../../../services/api';
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

// POST /sms/{serviceName}/senders - Créer un expéditeur
async function createSender(accountName: string, data: {
  sender: string;
  description?: string;
  reason?: string;
}): Promise<string> {
  return ovhApi.post<string>(`/sms/${accountName}/senders`, data);
}

// PUT /sms/{serviceName}/senders/{sender} - Modifier un expéditeur
async function updateSender(accountName: string, sender: string, data: {
  description?: string;
  status?: string;
}): Promise<void> {
  return ovhApi.put(`/sms/${accountName}/senders/${encodeURIComponent(sender)}`, data);
}

// DELETE /sms/{serviceName}/senders/{sender} - Supprimer un expéditeur
async function deleteSender(accountName: string, sender: string): Promise<void> {
  return ovhApi.delete(`/sms/${accountName}/senders/${encodeURIComponent(sender)}`);
}

// POST /sms/{serviceName}/senders/{sender}/validate - Valider un expéditeur
async function validateSender(accountName: string, sender: string, code: string): Promise<void> {
  return ovhApi.post(`/sms/${accountName}/senders/${encodeURIComponent(sender)}/validate`, { code });
}

export const sendersService = {
  listSenders,
  getSender,
  getSenders,
  createSender,
  updateSender,
  deleteSender,
  validateSender,
};
