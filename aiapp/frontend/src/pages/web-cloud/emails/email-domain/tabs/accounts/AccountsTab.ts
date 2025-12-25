// ============================================================
// EMAIL-DOMAIN/ACCOUNTS - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { EmailAccount } from '../../email-domain.types';

export async function listAccounts(domain: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/email/domain/${domain}/account`);
}

export async function getAccount(domain: string, accountName: string): Promise<EmailAccount> {
  return ovhApi.get<EmailAccount>(`/email/domain/${domain}/account/${accountName}`);
}

export function formatSize(bytes: number): string {
  return bytes > 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} GB` : `${(bytes / 1024).toFixed(0)} MB`;
}

export function getUsagePercent(used: number, quota: number): number {
  return quota > 0 ? Math.round((used / quota) * 100) : 0;
}

export function getInitials(email: string): string {
  return email.split('@')[0].substring(0, 2).toUpperCase();
}
