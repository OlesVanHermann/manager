// ============================================================
// EMAIL-PRO/DOMAINS - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { EmailProDomain } from '../../email-pro.types';

export async function listDomains(service: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/email/pro/${service}/domain`);
}

export async function getDomain(service: string, domainName: string): Promise<EmailProDomain> {
  return ovhApi.get<EmailProDomain>(`/email/pro/${service}/domain/${domainName}`);
}
