// ============================================================
// SERVICE ISOLÉ : EmailsTab - Gestion Emails domaine
// ============================================================

import { ovhGet } from "../../../../../services/api";

// ============ SERVICE ============

class EmailsService {
  async listEmailAccounts(domain: string): Promise<string[]> {
    try {
      return await ovhGet<string[]>(`/email/domain/${domain}/account`);
    } catch {
      return [];
    }
  }

  async listMailingLists(domain: string): Promise<string[]> {
    try {
      return await ovhGet<string[]>(`/email/domain/${domain}/mailingList`);
    } catch {
      return [];
    }
  }

  async listEmailRedirections(domain: string): Promise<string[]> {
    try {
      return await ovhGet<string[]>(`/email/domain/${domain}/redirection`);
    } catch {
      return [];
    }
  }

  async hasEmailService(domain: string): Promise<boolean> {
    try {
      await ovhGet(`/email/domain/${domain}`);
      return true;
    } catch {
      return false;
    }
  }
}

export const emailsService = new EmailsService();
