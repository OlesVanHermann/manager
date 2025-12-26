// ============================================================
// SERVICE ORCHESTRATEUR LOCAL - OfficePage
// Remplace les imports du service monolithique web-cloud.office.ts
// ============================================================

import { ovhGet } from "../../../../services/api";
import type { OfficeTenant } from "./office.types";

// ============ SERVICE ============

class OfficePageService {
  /** Liste tous les tenants Office 365. */
  async listTenants(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/license/office");
    } catch {
      return [];
    }
  }

  /** Récupère les détails d'un tenant Office 365. */
  async getTenant(serviceName: string): Promise<OfficeTenant> {
    return ovhGet<OfficeTenant>(`/license/office/${serviceName}`);
  }

  /** Récupère les infos de service. */
  async getServiceInfos(serviceName: string): Promise<unknown> {
    return ovhGet(`/license/office/${serviceName}/serviceInfos`);
  }
}

export const officePageService = new OfficePageService();
