// ============================================================
// EXCHANGE/RESOURCES - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { ExchangeResource } from '../../exchange.types';

// ============================================================
// API CALLS - Copie locale (défactorisation)
// ============================================================

export async function listResources(org: string, service: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/email/exchange/${org}/service/${service}/resourceAccount`);
}

export async function getResource(org: string, service: string, email: string): Promise<ExchangeResource> {
  return ovhApi.get<ExchangeResource>(`/email/exchange/${org}/service/${service}/resourceAccount/${email}`);
}
