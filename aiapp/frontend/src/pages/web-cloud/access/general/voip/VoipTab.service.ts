// ============================================================
// SERVICE VOIP TAB - Isolé pour lignes VoIP et EcoFax
// Endpoints alignés avec old_manager (OvhApiPackXdslVoipLine, OvhApiPackXdslVoipEcofax)
// ============================================================

import { ovhApi } from '../../../../../services/api';
import type { VoipLine, EcoFax, VoipStats, FaxHistoryItem } from '../connections.types';

// ---------- TYPES LOCAUX ----------

interface VoipLineService {
  serviceName: string;
  domain: string;
  description?: string;
}

interface EcoFaxService {
  domain: string;
  faxNumber: string;
  email?: string;
}

interface VoipLineHardware {
  name: string;
  image?: string;
}

interface ShippingAddress {
  id: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

// ---------- SERVICE ----------

export const voipService = {
  /**
   * Lignes VoIP du pack.
   * Aligné old_manager: OvhApiPackXdslVoipLine.v6().query()
   */
  async getVoipLines(packId: string): Promise<VoipLine[]> {
    // GET /pack/xdsl/{packId}/voipLine/services
    const services = await ovhApi.get<VoipLineService[]>(`/pack/xdsl/${packId}/voipLine/services`);
    return services.map((svc) => ({
      id: svc.serviceName,
      number: svc.domain,
      status: 'active' as const,
      type: 'line' as const,
      description: svc.description,
    }));
  },

  /**
   * Créer une ligne VoIP.
   * Aligné old_manager: OvhApiPackXdslVoipLine.v6().save()
   */
  async createVoipLine(packId: string, params: {
    shippingId?: string;
    hardwareName?: string;
    mondialRelayId?: string;
  }): Promise<void> {
    // POST /pack/xdsl/{packId}/voipLine/services
    await ovhApi.post(`/pack/xdsl/${packId}/voipLine/services`, params);
  },

  /**
   * Matériels disponibles pour VoIP.
   * Aligné old_manager: OvhApiPackXdslVoipLine.v6().getHardwares()
   */
  async getVoipHardwares(packId: string): Promise<VoipLineHardware[]> {
    // GET /pack/xdsl/{packId}/voipLine/options/hardwares
    return ovhApi.get<VoipLineHardware[]>(`/pack/xdsl/${packId}/voipLine/options/hardwares`);
  },

  /**
   * Adresses de livraison VoIP.
   * Aligné old_manager: OvhApiPackXdslVoipLine.v6().getShippingAddresses()
   */
  async getVoipShippingAddresses(packId: string): Promise<ShippingAddress[]> {
    // GET /pack/xdsl/{packId}/voipLine/options/shippingAddresses
    return ovhApi.get<ShippingAddress[]>(`/pack/xdsl/${packId}/voipLine/options/shippingAddresses`);
  },

  /**
   * Services EcoFax du pack.
   * Aligné old_manager: OvhApiPackXdslVoipEcofax.v6().query()
   */
  async getEcoFaxServices(packId: string): Promise<EcoFax[]> {
    // GET /pack/xdsl/{packId}/voipEcofax/services
    const services = await ovhApi.get<EcoFaxService[]>(`/pack/xdsl/${packId}/voipEcofax/services`);
    return services.map((svc) => ({
      enabled: true,
      email: svc.email || '',
      faxNumber: svc.faxNumber,
      domain: svc.domain,
    }));
  },

  /**
   * Créer un service EcoFax.
   * Aligné old_manager: OvhApiPackXdslVoipEcofax.v6().save()
   */
  async createEcoFax(packId: string, params: {
    domain?: string;
  }): Promise<void> {
    // POST /pack/xdsl/{packId}/voipEcofax/services
    await ovhApi.post(`/pack/xdsl/${packId}/voipEcofax/services`, params);
  },

  /**
   * EcoFax principal (premier de la liste).
   * Wrapper pour compatibilité.
   */
  async getEcoFax(packId: string): Promise<EcoFax> {
    const services = await this.getEcoFaxServices(packId);
    if (services.length > 0) {
      return services[0];
    }
    return { enabled: false, email: '' };
  },

  /**
   * Statistiques VoIP (agrégées depuis telephony).
   * Note: old_manager utilise /telephony/{billingAccount}/line/{serviceName}/statistics
   */
  async getVoipStats(packId: string): Promise<VoipStats> {
    // Pour l'instant, récupérer les lignes et agréger
    // Les stats détaillées nécessitent le billingAccount
    const lines = await this.getVoipLines(packId);

    // Si pas de lignes, retourner des stats vides
    if (lines.length === 0) {
      return {
        incomingCalls: 0,
        outgoingCalls: 0,
        totalDuration: 0,
        faxSent: 0,
        faxReceived: 0,
      };
    }

    // TODO: Implémenter les stats réelles via /telephony
    // Pour l'instant, indiquer qu'il n'y a pas de stats disponibles
    return {
      incomingCalls: 0,
      outgoingCalls: 0,
      totalDuration: 0,
      faxSent: 0,
      faxReceived: 0,
    };
  },

  /**
   * Historique des fax.
   * Note: old_manager utilise /telephony/{billingAccount}/fax/{serviceName}/campaigns
   */
  async getFaxHistory(packId: string): Promise<FaxHistoryItem[]> {
    // Les fax sont gérés via l'API telephony, pas directement via pack/xdsl
    // TODO: Implémenter via /telephony quand le billingAccount sera disponible
    const ecofax = await this.getEcoFaxServices(packId);
    if (ecofax.length === 0) {
      return [];
    }
    // Pour l'instant, liste vide (les fax nécessitent l'accès telephony)
    return [];
  },
};
