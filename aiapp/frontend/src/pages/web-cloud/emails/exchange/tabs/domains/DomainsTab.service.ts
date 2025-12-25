// ============================================================
// EXCHANGE/DOMAINS - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { ExchangeDomain } from '../../exchange.types';

// ============================================================
// API CALLS - Copie locale (défactorisation)
// ============================================================

export async function listDomains(org: string, service: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/email/exchange/${org}/service/${service}/domain`);
}

export async function getDomain(org: string, service: string, domainName: string): Promise<ExchangeDomain> {
  return ovhApi.get<ExchangeDomain>(`/email/exchange/${org}/service/${service}/domain/${domainName}`);
}
