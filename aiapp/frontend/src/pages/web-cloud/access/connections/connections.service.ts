// ============================================================
// CONNECTIONS SERVICE - Opérations transversales
// ============================================================
// Ce service gère les opérations utilisées par les modals et
// composants partagés (renommage, déménagement, migration, etc.)

import { ovhApi } from "../../../../services/api";

export const connectionsService = {
  // ============================================================
  // GESTION CONNEXION
  // ============================================================

  /** Renommer une connexion. */
  async renameConnection(connectionId: string, name: string): Promise<void> {
    await ovhApi.put(`/pack/xdsl/${connectionId}`, { description: name });
  },

  /** Déménager une connexion. */
  async moveConnection(connectionId: string, options: {
    address: string;
    meeting?: { start: string; end: string };
  }): Promise<void> {
    await ovhApi.post(`/pack/xdsl/${connectionId}/move`, options);
  },

  /** Migrer vers une autre offre. */
  async migrateConnection(connectionId: string, offerId: string): Promise<void> {
    await ovhApi.post(`/pack/xdsl/${connectionId}/migration`, { offerId });
  },

  /** Récupérer les offres de migration disponibles. */
  async getMigrationOffers(connectionId: string): Promise<Array<{
    id: string;
    name: string;
    price: number;
    description: string;
  }>> {
    return ovhApi.get(`/pack/xdsl/${connectionId}/migration/offers`);
  },

  /** Résilier une connexion. */
  async cancelConnection(connectionId: string): Promise<void> {
    await ovhApi.post(`/pack/xdsl/${connectionId}/cancel`, {});
  },

  // ============================================================
  // GESTION MODEM
  // ============================================================

  /** Redémarrer le modem. */
  async rebootModem(connectionId: string): Promise<void> {
    await ovhApi.post(`/pack/xdsl/${connectionId}/modem/reboot`, {});
  },

  /** Réinitialiser le modem. */
  async resetModem(connectionId: string): Promise<void> {
    await ovhApi.post(`/pack/xdsl/${connectionId}/modem/reset`, {});
  },

  /** Mettre à jour le firmware du modem. */
  async updateModemFirmware(connectionId: string): Promise<void> {
    await ovhApi.post(`/pack/xdsl/${connectionId}/modem/firmware`, {});
  },

  /** Ajouter une règle NAT. */
  async addModemNatRule(connectionId: string, rule: {
    name: string;
    protocol: "tcp" | "udp" | "both";
    externalPort: number;
    internalIp: string;
    internalPort: number;
  }): Promise<void> {
    await ovhApi.post(`/pack/xdsl/${connectionId}/modem/nat`, rule);
  },

  // ============================================================
  // ALERTES LIGNE
  // ============================================================

  /** Ajouter une alerte sur la ligne. */
  async addLineAlert(connectionId: string, alert: {
    type: string;
    threshold?: number;
    email?: string;
  }): Promise<void> {
    await ovhApi.post(`/pack/xdsl/${connectionId}/xdslAccess/alerts`, alert);
  },
};
