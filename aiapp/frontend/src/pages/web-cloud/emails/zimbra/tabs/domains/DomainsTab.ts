// ============================================================
// ZIMBRA/DOMAINS - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { ZimbraDomain } from '../../zimbra.types';

export async function listDomains(serviceId: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/email/zimbra/${serviceId}/domain`);
}

export async function getDomain(serviceId: string, domainId: string): Promise<ZimbraDomain> {
  return ovhApi.get<ZimbraDomain>(`/email/zimbra/${serviceId}/domain/${domainId}`);
}
