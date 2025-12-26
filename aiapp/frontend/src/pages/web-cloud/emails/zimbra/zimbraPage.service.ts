// ============================================================
// SERVICE ORCHESTRATEUR LOCAL - ZimbraPage
// Remplace les imports du service monolithique web-cloud.zimbra.ts
// ============================================================

import { ovhGet } from "../../../../services/api";
import type { ZimbraService } from "./zimbra.types";

// ============ SERVICE ============

class ZimbraPageService {
  /** Liste tous les services Zimbra. */
  async listServices(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/email/zimbra");
    } catch {
      return [];
    }
  }

  /** Récupère les détails d'un service Zimbra. */
  async getService(serviceId: string): Promise<ZimbraService> {
    return ovhGet<ZimbraService>(`/email/zimbra/${serviceId}`);
  }

  /** Récupère les infos de service. */
  async getServiceInfos(serviceId: string): Promise<unknown> {
    return ovhGet(`/email/zimbra/${serviceId}/serviceInfos`);
  }
}

export const zimbraPageService = new ZimbraPageService();
