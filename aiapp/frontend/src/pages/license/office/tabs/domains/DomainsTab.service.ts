// ============================================================
// OFFICE/DOMAINS - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../services/api';
import type { OfficeDomain } from '../../office.types';

export async function listDomains(serviceName: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/license/office/${serviceName}/domain`);
}

export async function getDomain(serviceName: string, domainName: string): Promise<OfficeDomain> {
  return ovhApi.get<OfficeDomain>(`/license/office/${serviceName}/domain/${domainName}`);
}
