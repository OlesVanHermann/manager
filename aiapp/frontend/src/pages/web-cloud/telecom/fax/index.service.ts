// ============================================================
// FAX SERVICE - Service LOCAL (défactorisé)
// ============================================================

import { ovhApi } from '../../../../services/api';
import type { FreefaxAccount } from './fax.types';

// ============================================================
// SERVICE LOCAL - Pas d'import depuis /services/web-cloud.fax.ts
// ============================================================

async function listFreefax(): Promise<string[]> {
  return ovhApi.get<string[]>('/freefax');
}

async function getFreefax(serviceName: string): Promise<FreefaxAccount> {
  return ovhApi.get<FreefaxAccount>(`/freefax/${serviceName}`);
}

async function listServices(): Promise<string[]> {
  return listFreefax();
}

export const faxService = {
  listFreefax,
  listServices,
  getFreefax,
};
