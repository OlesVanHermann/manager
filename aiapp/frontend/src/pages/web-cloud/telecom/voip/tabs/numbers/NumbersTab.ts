// ============================================================
// NUMBERS TAB SERVICE - Service ISOLÉ (défactorisé)
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { TelephonyNumber } from '../../voip.types';

// ============================================================
// SERVICE ISOLÉ - Aucun import croisé entre tabs
// ============================================================

async function listNumbers(billingAccount: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/telephony/${billingAccount}/number`);
}

async function getNumber(billingAccount: string, serviceName: string): Promise<TelephonyNumber> {
  return ovhApi.get<TelephonyNumber>(`/telephony/${billingAccount}/number/${serviceName}`);
}

async function getNumbers(billingAccount: string): Promise<TelephonyNumber[]> {
  const ids = await listNumbers(billingAccount);
  return Promise.all(ids.map(id => getNumber(billingAccount, id)));
}

export const numbersService = {
  listNumbers,
  getNumber,
  getNumbers,
};
