// ============================================================
// SERVICE ORCHESTRATEUR LOCAL - EmailsPage (page groupe)
// Remplace les imports des 5 services monolithiques
// ============================================================

import { ovhGet } from "../../../services/api";

// ============ TYPES ============

export interface EmailsCounts {
  emailDomain: number;
  emailPro: number;
  exchange: number;
  office: number;
  zimbra: number;
}

// ============ SERVICE ============

class EmailsPageService {
  /** Liste les domaines email (MX Plan). */
  async listEmailDomains(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/email/domain");
    } catch {
      return [];
    }
  }

  /** Liste les services Email Pro. */
  async listEmailPro(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/email/pro");
    } catch {
      return [];
    }
  }

  /** Liste les organisations Exchange. */
  async listExchangeOrganizations(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/email/exchange");
    } catch {
      return [];
    }
  }

  /** Liste les tenants Office 365. */
  async listOfficeTenants(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/license/office");
    } catch {
      return [];
    }
  }

  /** Liste les services Zimbra. */
  async listZimbra(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/email/zimbra");
    } catch {
      return [];
    }
  }

  /** Charge tous les counts en parallèle. */
  async loadAllCounts(): Promise<EmailsCounts> {
    const [emailDomains, emailPros, exchanges, offices, zimbras] = await Promise.all([
      this.listEmailDomains(),
      this.listEmailPro(),
      this.listExchangeOrganizations(),
      this.listOfficeTenants(),
      this.listZimbra(),
    ]);
    return {
      emailDomain: emailDomains.length,
      emailPro: emailPros.length,
      exchange: exchanges.length,
      office: offices.length,
      zimbra: zimbras.length,
    };
  }
}

export const emailsPageService = new EmailsPageService();
