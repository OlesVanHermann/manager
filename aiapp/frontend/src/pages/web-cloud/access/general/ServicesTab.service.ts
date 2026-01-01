// ============================================================
// SERVICE SERVICES TAB - Isolé pour liste des services inclus
// Endpoints alignés avec old_manager (pack/xdsl/{packId}/**/services)
// ============================================================

import { ovhApi } from '../../../../services/api';
import type { Service } from '../connections.types';

// ---------- TYPES LOCAUX ----------

interface PackService {
  name: string;
  domain?: string;
  total: number;
  used: number;
  inCreation: number;
}

interface HostedEmailAccount {
  configuration: string;
  currentUsage: { quota: number; value: number };
  email: string;
  offer: string;
  state: string;
}

// ---------- SERVICE ----------

export const servicesTabService = {
  /**
   * Récupérer le résumé des services du pack (quota).
   * Aligné old_manager: OvhApiPackXdsl.v6().getServices()
   */
  async getServicesQuota(packId: string): Promise<PackService[]> {
    // GET /pack/xdsl/{packId}/services
    const services = await ovhApi.get<PackService[]>(`/pack/xdsl/${packId}/services`);
    // Ajouter le champ 'available' comme dans old_manager
    return services.map(svc => ({
      ...svc,
      available: svc.total - (svc.used + svc.inCreation),
    }));
  },

  /**
   * Liste de tous les services inclus dans le pack.
   * Aligné old_manager: Agrégation de tous les endpoints /services
   */
  async getServices(packId: string): Promise<Service[]> {
    const services: Service[] = [];

    // Domaines - GET /pack/xdsl/{packId}/domain/services
    const domains = await ovhApi.get<string[]>(`/pack/xdsl/${packId}/domain/services`).catch(() => []);
    domains.forEach(d => services.push({ id: d, type: 'domain', name: d, status: 'active' }));

    // Email Pro - GET /pack/xdsl/{packId}/emailPro/services
    const emailPro = await ovhApi.get<string[]>(`/pack/xdsl/${packId}/emailPro/services`).catch(() => []);
    emailPro.forEach(e => services.push({ id: e, type: 'emailPro', name: e, status: 'active' }));

    // VoIP Lines - GET /pack/xdsl/{packId}/voipLine/services
    const voips = await ovhApi.get<string[]>(`/pack/xdsl/${packId}/voipLine/services`).catch(() => []);
    voips.forEach(v => services.push({ id: v, type: 'voip', name: v, status: 'active' }));

    // Hosted Email - GET /pack/xdsl/{packId}/hostedEmail/services
    const hostings = await ovhApi.get<string[]>(`/pack/xdsl/${packId}/hostedEmail/services`).catch(() => []);
    hostings.forEach(h => services.push({ id: h, type: 'hostedEmail', name: h, status: 'active' }));

    // EcoFax - GET /pack/xdsl/{packId}/voipEcofax/services
    const ecofax = await ovhApi.get<string[]>(`/pack/xdsl/${packId}/voipEcofax/services`).catch(() => []);
    ecofax.forEach(f => services.push({ id: f, type: 'ecofax', name: f, status: 'active' }));

    // Exchange Account - GET /pack/xdsl/{packId}/exchangeAccount/services
    const exchangeAccount = await ovhApi.get<string[]>(`/pack/xdsl/${packId}/exchangeAccount/services`).catch(() => []);
    exchangeAccount.forEach(e => services.push({ id: e, type: 'exchangeAccount', name: e, status: 'active' }));

    // Exchange Lite - GET /pack/xdsl/{packId}/exchangeLite/services
    const exchangeLite = await ovhApi.get<string[]>(`/pack/xdsl/${packId}/exchangeLite/services`).catch(() => []);
    exchangeLite.forEach(e => services.push({ id: e, type: 'exchangeLite', name: e, status: 'active' }));

    // Hubic - GET /pack/xdsl/{packId}/hubic/services
    const hubic = await ovhApi.get<string[]>(`/pack/xdsl/${packId}/hubic/services`).catch(() => []);
    hubic.forEach(h => services.push({ id: h, type: 'hubic', name: h, status: 'active' }));

    // Site Builder - GET /pack/xdsl/{packId}/siteBuilderStart/services
    const siteBuilder = await ovhApi.get<string[]>(`/pack/xdsl/${packId}/siteBuilderStart/services`).catch(() => []);
    siteBuilder.forEach(s => services.push({ id: s, type: 'siteBuilder', name: s, status: 'active' }));

    return services;
  },

  // ============================================================
  // DOMAINES
  // Aligné old_manager: OvhApiPackXdslDomainActivation
  // ============================================================

  /**
   * TLDs disponibles pour créer un domaine.
   * Aligné old_manager: OvhApiPackXdslDomainActivation.v6().getTlds()
   */
  async getDomainTlds(packId: string): Promise<string[]> {
    // GET /pack/xdsl/{packId}/domain/options/tlds
    return ovhApi.get<string[]>(`/pack/xdsl/${packId}/domain/options/tlds`);
  },

  /**
   * Créer un domaine.
   * Aligné old_manager: OvhApiPackXdslDomainActivation.v6().postServices()
   */
  async createDomain(packId: string, params: { domain: string }): Promise<void> {
    // POST /pack/xdsl/{packId}/domain/services
    await ovhApi.post(`/pack/xdsl/${packId}/domain/services`, params);
  },

  // ============================================================
  // EMAIL PRO
  // Aligné old_manager: OvhApiPackXdslEmailPro
  // ============================================================

  /**
   * Domaines disponibles pour Email Pro.
   * Aligné old_manager: OvhApiPackXdslEmailPro.v6().getDomains()
   */
  async getEmailProDomains(packId: string): Promise<string[]> {
    // GET /pack/xdsl/{packId}/emailPro/options/domains
    return ovhApi.get<string[]>(`/pack/xdsl/${packId}/emailPro/options/domains`);
  },

  /**
   * Vérifier si un email est disponible.
   * Aligné old_manager: OvhApiPackXdslEmailPro.v6().isEmailAvailable()
   */
  async isEmailAvailable(packId: string, email: string): Promise<boolean> {
    // GET /pack/xdsl/{packId}/emailPro/options/isEmailAvailable?email={email}
    const result = await ovhApi.get<string>(`/pack/xdsl/${packId}/emailPro/options/isEmailAvailable?email=${encodeURIComponent(email)}`);
    return result.toUpperCase() === 'TRUE';
  },

  /**
   * Créer un compte Email Pro.
   * Aligné old_manager: OvhApiPackXdslEmailPro.v6().save()
   */
  async createEmailPro(packId: string, params: { email: string; password: string }): Promise<void> {
    // POST /pack/xdsl/{packId}/emailPro/services
    await ovhApi.post(`/pack/xdsl/${packId}/emailPro/services`, params);
  },

  // ============================================================
  // HOSTED EMAIL
  // Aligné old_manager: OvhApiPackXdslHostedEmail
  // ============================================================

  /**
   * Domaines disponibles pour Hosted Email.
   * Aligné old_manager: OvhApiPackXdslHostedEmail.v6().getDomains()
   */
  async getHostedEmailDomains(packId: string): Promise<string[]> {
    // GET /pack/xdsl/{packId}/hostedEmail/options/domains
    return ovhApi.get<string[]>(`/pack/xdsl/${packId}/hostedEmail/options/domains`);
  },

  /**
   * Créer un compte Hosted Email.
   * Aligné old_manager: OvhApiPackXdslHostedEmail.v6().save()
   */
  async createHostedEmail(packId: string, params: { email: string; password: string }): Promise<void> {
    // POST /pack/xdsl/{packId}/hostedEmail/services
    await ovhApi.post(`/pack/xdsl/${packId}/hostedEmail/services`, params);
  },

  /**
   * Supprimer un compte Hosted Email.
   * Aligné old_manager: OvhApiPackXdslHostedEmail.v6().delete()
   */
  async deleteHostedEmail(packId: string, domain: string): Promise<void> {
    // DELETE /pack/xdsl/{packId}/hostedEmail/services/{domain}
    await ovhApi.delete(`/pack/xdsl/${packId}/hostedEmail/services/${domain}`);
  },

  /**
   * Récupérer un compte Hosted Email.
   * Aligné old_manager: OvhApiPackXdslHostedEmail.v6().getAccount()
   */
  async getHostedEmailAccount(packId: string, domain: string): Promise<HostedEmailAccount> {
    // GET /pack/xdsl/{packId}/hostedEmail/services/{domain}/account
    return ovhApi.get<HostedEmailAccount>(`/pack/xdsl/${packId}/hostedEmail/services/${domain}/account`);
  },

  /**
   * Changer le mot de passe Hosted Email.
   * Aligné old_manager: OvhApiPackXdslHostedEmail.v6().changePassword()
   */
  async changeHostedEmailPassword(packId: string, domain: string, password: string): Promise<void> {
    // POST /pack/xdsl/{packId}/hostedEmail/services/{domain}/changePassword
    await ovhApi.post(`/pack/xdsl/${packId}/hostedEmail/services/${domain}/changePassword`, { password });
  },

  /**
   * Configuration Hosted Email.
   * Aligné old_manager: OvhApiPackXdslHostedEmail.v6().getConfig()
   */
  async getHostedEmailConfig(packId: string, domain: string): Promise<Record<string, string>> {
    // GET /pack/xdsl/{packId}/hostedEmail/services/{domain}/configuration
    return ovhApi.get<Record<string, string>>(`/pack/xdsl/${packId}/hostedEmail/services/${domain}/configuration`);
  },
};
