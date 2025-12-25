// ============================================================
// EMAIL-DOMAIN/MAILINGLISTS - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { EmailMailingList } from '../../email-domain.types';

export async function listMailingLists(domain: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/email/domain/${domain}/mailingList`);
}

export async function getMailingList(domain: string, name: string): Promise<EmailMailingList> {
  return ovhApi.get<EmailMailingList>(`/email/domain/${domain}/mailingList/${name}`);
}
