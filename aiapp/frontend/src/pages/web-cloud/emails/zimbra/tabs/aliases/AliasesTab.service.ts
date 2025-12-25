// ============================================================
// ZIMBRA/ALIASES - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { ZimbraAlias } from '../../zimbra.types';

export async function listAliases(serviceId: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/email/zimbra/${serviceId}/alias`);
}

export async function getAlias(serviceId: string, aliasId: string): Promise<ZimbraAlias> {
  return ovhApi.get<ZimbraAlias>(`/email/zimbra/${serviceId}/alias/${aliasId}`);
}
