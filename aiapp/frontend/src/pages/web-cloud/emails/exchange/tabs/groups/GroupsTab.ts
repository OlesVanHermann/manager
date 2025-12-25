// ============================================================
// EXCHANGE/GROUPS - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { ExchangeGroup } from '../../exchange.types';

// ============================================================
// API CALLS - Copie locale (défactorisation)
// ============================================================

export async function listGroups(org: string, service: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/email/exchange/${org}/service/${service}/mailingList`);
}

export async function getGroup(org: string, service: string, mailingListAddress: string): Promise<ExchangeGroup> {
  return ovhApi.get<ExchangeGroup>(`/email/exchange/${org}/service/${service}/mailingList/${mailingListAddress}`);
}
