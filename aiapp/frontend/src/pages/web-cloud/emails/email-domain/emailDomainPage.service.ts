// ============================================================
// SERVICE ORCHESTRATEUR LOCAL - EmailDomainPage
// Remplace les imports du service monolithique web-cloud.email-domain.ts
// ============================================================

import { ovhGet } from "../../../../services/api";
import type { EmailDomain } from "./email-domain.types";

// ============ SERVICE ============

class EmailDomainPageService {
  /** Liste tous les domaines email (MX Plan). */
  async listDomains(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/email/domain");
    } catch {
      return [];
    }
  }

  /** Récupère les détails d'un domaine email. */
  async getDomain(domain: string): Promise<EmailDomain> {
    return ovhGet<EmailDomain>(`/email/domain/${domain}`);
  }

  /** Récupère les infos de service. */
  async getServiceInfos(domain: string): Promise<unknown> {
    return ovhGet(`/email/domain/${domain}/serviceInfos`);
  }
}

export const emailDomainPageService = new EmailDomainPageService();
