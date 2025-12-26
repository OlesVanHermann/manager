// ============================================================
// SERVICE ORCHESTRATEUR LOCAL - ExchangePage
// Fonctions API pour la page principale Exchange
// ============================================================

import { ovhGet } from "../../../../services/api";
import type { ExchangeService } from "./exchange.types";

// ============ SERVICE ============

class ExchangePageService {
  /** Liste toutes les organisations Exchange. */
  async listOrganizations(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/email/exchange");
    } catch {
      return [];
    }
  }

  /** Liste tous les services d'une organisation. */
  async listServices(org: string): Promise<string[]> {
    try {
      return await ovhGet<string[]>(`/email/exchange/${org}/service`);
    } catch {
      return [];
    }
  }

  /** Récupère les détails d'un service Exchange. */
  async getService(org: string, service: string): Promise<ExchangeService> {
    return ovhGet<ExchangeService>(`/email/exchange/${org}/service/${service}`);
  }

  /** Récupère les infos de service. */
  async getServiceInfos(org: string, service: string): Promise<unknown> {
    return ovhGet(`/email/exchange/${org}/service/${service}/serviceInfos`);
  }
}

export const exchangePageService = new ExchangePageService();
