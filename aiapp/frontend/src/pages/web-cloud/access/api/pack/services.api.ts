// ============================================================
// API PACK SERVICES - Services inclus dans le pack
// Aligné avec old_manager: OvhApiPackXdsl*
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- API ----------

export const packServicesApi = {
  /** Liste les domaines inclus. */
  async getDomains(packName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/pack/xdsl/${packName}/domain/services`).catch(() => []);
  },

  /** Liste les emails Pro inclus. */
  async getEmailPro(packName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/pack/xdsl/${packName}/emailPro/services`).catch(() => []);
  },

  /** Liste les lignes VoIP incluses. */
  async getVoipLines(packName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/pack/xdsl/${packName}/voipLine/services`).catch(() => []);
  },

  /** Liste les emails hébergés inclus. */
  async getHostedEmail(packName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/pack/xdsl/${packName}/hostedEmail/services`).catch(() => []);
  },

  /** Liste les comptes Exchange inclus. */
  async getExchangeAccounts(packName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/pack/xdsl/${packName}/exchangeAccount/services`).catch(() => []);
  },

  /** Liste les comptes Exchange Lite inclus. */
  async getExchangeLite(packName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/pack/xdsl/${packName}/exchangeLite/services`).catch(() => []);
  },

  /** Liste les comptes hubiC inclus. */
  async getHubic(packName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/pack/xdsl/${packName}/hubic/services`).catch(() => []);
  },

  /** Récupère tous les services en une seule requête. */
  async getAll(packName: string): Promise<{
    domains: string[];
    emailPro: string[];
    voipLines: string[];
    hostedEmail: string[];
    exchangeAccounts: string[];
    exchangeLite: string[];
    hubic: string[];
  }> {
    const [domains, emailPro, voipLines, hostedEmail, exchangeAccounts, exchangeLite, hubic] = await Promise.all([
      this.getDomains(packName),
      this.getEmailPro(packName),
      this.getVoipLines(packName),
      this.getHostedEmail(packName),
      this.getExchangeAccounts(packName),
      this.getExchangeLite(packName),
      this.getHubic(packName),
    ]);
    return { domains, emailPro, voipLines, hostedEmail, exchangeAccounts, exchangeLite, hubic };
  },
};
