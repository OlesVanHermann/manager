// ============================================================
// ZIMBRA/ACCOUNTS - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { ZimbraAccount } from '../../zimbra.types';

export async function listAccounts(serviceId: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/email/zimbra/${serviceId}/account`);
}

export async function getAccount(serviceId: string, accountId: string): Promise<ZimbraAccount> {
  return ovhApi.get<ZimbraAccount>(`/email/zimbra/${serviceId}/account/${accountId}`);
}

export function formatSize(bytes: number): string {
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function getUsagePercent(used: number, available: number): number {
  return available > 0 ? Math.round((used / available) * 100) : 0;
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}
