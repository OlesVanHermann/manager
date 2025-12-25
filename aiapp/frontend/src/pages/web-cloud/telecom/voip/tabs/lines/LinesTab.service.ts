// ============================================================
// LINES TAB SERVICE - Service ISOLÉ (défactorisé)
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { TelephonyLine } from '../../voip.types';

// ============================================================
// SERVICE ISOLÉ - Aucun import croisé entre tabs
// ============================================================

async function listLines(billingAccount: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/telephony/${billingAccount}/line`);
}

async function getLine(billingAccount: string, serviceName: string): Promise<TelephonyLine> {
  return ovhApi.get<TelephonyLine>(`/telephony/${billingAccount}/line/${serviceName}`);
}

async function getLines(billingAccount: string): Promise<TelephonyLine[]> {
  const ids = await listLines(billingAccount);
  return Promise.all(ids.map(id => getLine(billingAccount, id)));
}

export const linesService = {
  listLines,
  getLine,
  getLines,
};
