// ============================================================
// EXCHANGE/ACCOUNTS - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { ExchangeAccount } from '../../exchange.types';

// ============================================================
// API CALLS - Copie locale (défactorisation)
// ============================================================

export async function listAccounts(org: string, service: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/email/exchange/${org}/service/${service}/account`);
}

export async function getAccount(org: string, service: string, email: string): Promise<ExchangeAccount> {
  return ovhApi.get<ExchangeAccount>(`/email/exchange/${org}/service/${service}/account/${email}`);
}

// ============================================================
// HELPERS - Copie locale
// ============================================================

export function formatSize(bytes: number): string {
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function getUsagePercent(used: number, quota: number): number {
  return quota > 0 ? Math.round((used / quota) * 100) : 0;
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}
