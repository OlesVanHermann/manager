// ============================================================
// EMAIL-DOMAIN/REDIRECTIONS - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { EmailRedirection } from '../../email-domain.types';

export async function listRedirections(domain: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/email/domain/${domain}/redirection`);
}

export async function getRedirection(domain: string, id: string): Promise<EmailRedirection> {
  return ovhApi.get<EmailRedirection>(`/email/domain/${domain}/redirection/${id}`);
}
