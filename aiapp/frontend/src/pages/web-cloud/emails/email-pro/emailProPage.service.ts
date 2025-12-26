// ============================================================
// SERVICE ORCHESTRATEUR LOCAL - EmailProPage
// Remplace les imports du service monolithique web-cloud.email-pro.ts
// ============================================================

import { ovhGet } from "../../../../services/api";
import type { EmailProService } from "./email-pro.types";

// ============ SERVICE ============

class EmailProPageService {
  /** Liste tous les services Email Pro. */
  async listServices(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/email/pro");
    } catch {
      return [];
    }
  }

  /** Récupère les détails d'un service Email Pro. */
  async getService(service: string): Promise<EmailProService> {
    return ovhGet<EmailProService>(`/email/pro/${service}`);
  }

  /** Récupère les infos de service. */
  async getServiceInfos(service: string): Promise<unknown> {
    return ovhGet(`/email/pro/${service}/serviceInfos`);
  }
}

export const emailProPageService = new EmailProPageService();
