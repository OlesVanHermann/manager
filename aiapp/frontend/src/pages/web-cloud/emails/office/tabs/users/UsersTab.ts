// ============================================================
// OFFICE/USERS - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { OfficeUser } from '../../office.types';

export async function listUsers(serviceName: string): Promise<number[]> {
  return ovhApi.get<number[]>(`/license/office/${serviceName}/user`);
}

export async function getUser(serviceName: string, id: number): Promise<OfficeUser> {
  return ovhApi.get<OfficeUser>(`/license/office/${serviceName}/user/${id}`);
}

export function getInitials(first: string, last: string): string {
  return `${first[0] || ''}${last[0] || ''}`.toUpperCase();
}

export function getLicenseType(licenses: string[]): string {
  if (licenses.some(l => l.toLowerCase().includes('enterprise'))) return 'enterprise';
  if (licenses.some(l => l.toLowerCase().includes('business'))) return 'business';
  return 'other';
}
