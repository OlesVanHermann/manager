// ============================================================
// EMAIL-PRO/ACCOUNTS - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { EmailProAccount } from '../../email-pro.types';

export async function listAccounts(service: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/email/pro/${service}/account`);
}

export async function getAccount(service: string, email: string): Promise<EmailProAccount> {
  return ovhApi.get<EmailProAccount>(`/email/pro/${service}/account/${email}`);
}

export function formatSize(bytes: number | null): string {
  return bytes ? `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB` : '-';
}

export function getUsagePercent(used: number | null, quota: number): number {
  return used && quota > 0 ? Math.round((used / quota) * 100) : 0;
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}
