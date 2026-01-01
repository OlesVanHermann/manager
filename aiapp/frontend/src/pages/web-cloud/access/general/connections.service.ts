// ============================================================
// CONNECTIONS SERVICE - Opérations transversales
// Endpoints alignés avec old_manager (OvhApiPackXdsl, OvhApiPackXdslResiliation, OvhApiPackXdslMove)
// ============================================================
// Ce service gère les opérations utilisées par les modals et
// composants partagés (renommage, déménagement, migration, etc.)

import { ovhApi } from "../../../../services/api";

// ---------- TYPES LOCAUX ----------

interface ResiliationTerms {
  due: { value: number; currencyCode: string };
  engagedUpTo?: string;
  minResiliationDate: string;
  resiliationDate: string;
  resiliationReasons: string[];
}

interface MigrationOffer {
  offerName: string;
  price: { value: number; currencyCode: string };
  contractList: string[];
  description?: string;
  engageMonths?: number;
  totalSubServiceToDelete: number;
  subServicesToDelete?: Array<{ service: string; name: string }>;
}

interface MoveEligibility {
  status: 'ok' | 'error' | 'pending';
  result?: {
    eligibilityReference: string;
    offers: MoveOffer[];
  };
  error?: string;
}

interface MoveOffer {
  offerName: string;
  price: { value: number; currencyCode: string };
  productCodes: string[];
  description?: string;
}

// ---------- SERVICE ----------

export const connectionsService = {
  // ============================================================
  // GESTION CONNEXION
  // ============================================================

  /**
   * Renommer une connexion.
   * Aligné old_manager: OvhApiPackXdsl.v6().put()
   */
  async renameConnection(packId: string, name: string): Promise<void> {
    // PUT /pack/xdsl/{packId}
    await ovhApi.put(`/pack/xdsl/${packId}`, { description: name });
  },

  // ============================================================
  // RÉSILIATION
  // Aligné old_manager: OvhApiPackXdslResiliation
  // ============================================================

  /**
   * Vérifier si on peut annuler une résiliation.
   * Aligné old_manager: OvhApiPackXdslResiliation.v6().canCancelResiliation()
   */
  async canCancelResiliation(packId: string): Promise<boolean> {
    // GET /pack/xdsl/{packName}/canCancelResiliation
    const result = await ovhApi.get<string>(`/pack/xdsl/${packId}/canCancelResiliation`);
    return result === 'true' || result === true;
  },

  /**
   * Annuler une résiliation en cours.
   * Aligné old_manager: OvhApiPackXdslResiliation.v6().cancelResiliation()
   */
  async cancelResiliation(packId: string): Promise<void> {
    // POST /pack/xdsl/{packName}/cancelResiliation
    await ovhApi.post(`/pack/xdsl/${packId}/cancelResiliation`, {});
  },

  /**
   * Récupérer les termes de résiliation.
   * Aligné old_manager: OvhApiPackXdslResiliation.v6().resiliationTerms()
   */
  async getResiliationTerms(packId: string): Promise<ResiliationTerms> {
    // GET /pack/xdsl/{packName}/resiliationTerms
    return ovhApi.get<ResiliationTerms>(`/pack/xdsl/${packId}/resiliationTerms`);
  },

  /**
   * Suivi de résiliation.
   * Aligné old_manager: OvhApiPackXdsl.v6().resiliationFollowUp()
   */
  async getResiliationFollowUp(packId: string): Promise<{
    dateTodo: string;
    needModemReturn: boolean;
    registrationDate: string;
    status: string;
  } | null> {
    // GET /pack/xdsl/{packName}/resiliationFollowUp
    try {
      return await ovhApi.get(`/pack/xdsl/${packId}/resiliationFollowUp`);
    } catch {
      return null;
    }
  },

  /**
   * Résilier une connexion.
   * Aligné old_manager: OvhApiPackXdslResiliation.v6().resiliate()
   */
  async resiliate(packId: string, params: {
    resiliationSurvey?: {
      type: string;
      details?: string;
    };
    resiliationDate?: string;
  }): Promise<void> {
    // POST /pack/xdsl/{packName}/resiliate
    await ovhApi.post(`/pack/xdsl/${packId}/resiliate`, params);
  },

  // ============================================================
  // MIGRATION
  // Aligné old_manager: OvhApiPackXdsl (migration)
  // ============================================================

  /**
   * Récupérer les offres de migration disponibles.
   * Aligné old_manager: OvhApiPackXdsl.v6().migrationOffers() - POST
   */
  async getMigrationOffers(packId: string): Promise<MigrationOffer[]> {
    // POST /pack/xdsl/{packName}/migration/offers
    const result = await ovhApi.post<{ result: MigrationOffer[] }>(`/pack/xdsl/${packId}/migration/offers`, {});
    return result.result || [];
  },

  /**
   * Récupérer les services à supprimer lors de la migration.
   * Aligné old_manager: OvhApiPackXdsl.v6().servicesToDelete()
   */
  async getMigrationServicesToDelete(packId: string, offerName: string): Promise<Array<{ service: string; name: string }>> {
    // POST /pack/xdsl/{packName}/migration/servicesToDelete
    return ovhApi.post<Array<{ service: string; name: string }>>(`/pack/xdsl/${packId}/migration/servicesToDelete`, { offerName });
  },

  /**
   * Effectuer la migration.
   * Aligné old_manager: OvhApiPackXdsl.v6().migrate()
   */
  async migrate(packId: string, params: {
    offerName: string;
    options?: {
      acceptContracts?: boolean;
      nicShipping?: string;
      subServicesToDelete?: Array<{ service: string; name: string }>;
    };
  }): Promise<void> {
    // POST /pack/xdsl/{packName}/migration/migrate
    await ovhApi.post(`/pack/xdsl/${packId}/migration/migrate`, params);
  },

  // ============================================================
  // DÉMÉNAGEMENT
  // Aligné old_manager: OvhApiPackXdslMove
  // ============================================================

  /**
   * Vérifier l'éligibilité d'une adresse pour le déménagement.
   * Aligné old_manager: OvhApiPackXdslMove.pollElligibility()
   * Note: Cet endpoint nécessite un polling car il retourne un statut.
   */
  async checkMoveEligibility(packId: string, params: {
    lineNumber: string;
    address: {
      streetNumber: string;
      streetName: string;
      city: string;
      zipCode: string;
    };
  }): Promise<MoveEligibility> {
    // POST /pack/xdsl/{packName}/addressMove/eligibility
    return ovhApi.post<MoveEligibility>(`/pack/xdsl/${packId}/addressMove/eligibility`, params);
  },

  /**
   * Récupérer les offres de déménagement.
   * Aligné old_manager: OvhApiPackXdslMove.pollOffers()
   */
  async getMoveOffers(packId: string, eligibilityReference: string): Promise<{ status: string; result?: { offers: MoveOffer[] } }> {
    // POST /pack/xdsl/{packName}/addressMove/offers
    return ovhApi.post(`/pack/xdsl/${packId}/addressMove/offers`, { eligibilityReference });
  },

  /**
   * Récupérer les services à supprimer lors du déménagement.
   * Aligné old_manager: OvhApiPackXdslMove.v6().servicesToDelete()
   */
  async getMoveServicesToDelete(packId: string, offerName: string): Promise<Array<{ service: string; name: string }>> {
    // POST /pack/xdsl/{packName}/addressMove/servicesToDelete
    return ovhApi.post<Array<{ service: string; name: string }>>(`/pack/xdsl/${packId}/addressMove/servicesToDelete`, { offerName });
  },

  /**
   * Soumettre une offre de déménagement.
   * Aligné old_manager: OvhApiPackXdslMove.v6().moveOffer()
   */
  async submitMoveOffer(packId: string, params: {
    eligibilityReference: string;
    offerName: string;
    options?: Record<string, unknown>;
  }): Promise<void> {
    // POST /pack/xdsl/{packName}/addressMove/moveOffer
    await ovhApi.post(`/pack/xdsl/${packId}/addressMove/moveOffer`, params);
  },

  /**
   * Exécuter le déménagement.
   * Aligné old_manager: OvhApiPackXdslMove.v6().move()
   */
  async executeMove(packId: string, params: {
    keepCurrentNumber: boolean;
    offerName: string;
    provider: string;
    rio?: string;
  }): Promise<void> {
    // POST /pack/xdsl/{packName}/addressMove/move
    await ovhApi.post(`/pack/xdsl/${packId}/addressMove/move`, params);
  },

  // ============================================================
  // GESTION MODEM
  // Note: Ces endpoints utilisent /xdsl/{accessId} et non /pack/xdsl
  // ============================================================

  /**
   * Redémarrer le modem.
   * Aligné old_manager: OvhApiXdslModemReboot.v6()
   */
  async rebootModem(accessId: string): Promise<void> {
    // POST /xdsl/{xdslId}/modem/reboot
    await ovhApi.post(`/xdsl/${accessId}/modem/reboot`, {});
  },

  /**
   * Réinitialiser le modem.
   * Aligné old_manager: OvhApiXdslModemReset.v6().reset()
   */
  async resetModem(accessId: string): Promise<void> {
    // POST /xdsl/{xdslId}/modem/reset
    await ovhApi.post(`/xdsl/${accessId}/modem/reset`, {});
  },

  /**
   * Reconfigurer la VoIP sur le modem.
   * Aligné old_manager: OvhApiXdslModem.v6().reconfigureVoip()
   */
  async reconfigureModemVoip(accessId: string): Promise<void> {
    // POST /xdsl/{xdslId}/modem/reconfigureVoip
    await ovhApi.post(`/xdsl/${accessId}/modem/reconfigureVoip`, {});
  },

  /**
   * Ajouter une règle NAT (port mapping).
   * Aligné old_manager: via /xdsl/{xdslId}/modem/portMappings
   */
  async addModemNatRule(accessId: string, rule: {
    name: string;
    protocol: "tcp" | "udp" | "both";
    externalPortStart: number;
    externalPortEnd?: number;
    internalIp: string;
    internalPort: number;
  }): Promise<void> {
    // POST /xdsl/{xdslId}/modem/portMappings
    await ovhApi.post(`/xdsl/${accessId}/modem/portMappings`, rule);
  },

  /**
   * Supprimer une règle NAT.
   */
  async deleteModemNatRule(accessId: string, ruleId: string): Promise<void> {
    // DELETE /xdsl/{xdslId}/modem/portMappings/{id}
    await ovhApi.delete(`/xdsl/${accessId}/modem/portMappings/${ruleId}`);
  },

  // ============================================================
  // ALERTES LIGNE
  // Aligné old_manager: OvhApiXdslNotifications
  // ============================================================

  /**
   * Ajouter une notification de monitoring.
   * Aligné old_manager: OvhApiXdslNotifications.v6().add()
   */
  async addLineAlert(accessId: string, alert: {
    type: 'http' | 'mail' | 'sms';
    frequency: 'once' | 'always' | '5m' | '1h' | '6h';
    email?: string;
    phone?: string;
    httpUrl?: string;
    allowIncident?: boolean;
    downThreshold?: number;
    smsAccount?: string;
  }): Promise<void> {
    // POST /xdsl/{xdslId}/monitoringNotifications
    await ovhApi.post(`/xdsl/${accessId}/monitoringNotifications`, alert);
  },

  /**
   * Supprimer une notification de monitoring.
   * Aligné old_manager: OvhApiXdslNotifications.v6().remove()
   */
  async deleteLineAlert(accessId: string, alertId: string): Promise<void> {
    // DELETE /xdsl/{xdslId}/monitoringNotifications/{id}
    await ovhApi.delete(`/xdsl/${accessId}/monitoringNotifications/${alertId}`);
  },

  /**
   * Modifier une notification de monitoring.
   * Aligné old_manager: OvhApiXdslNotifications.v6().update()
   */
  async updateLineAlert(accessId: string, alertId: string, alert: {
    frequency?: 'once' | 'always' | '5m' | '1h' | '6h';
    email?: string;
    phone?: string;
    httpUrl?: string;
    allowIncident?: boolean;
    downThreshold?: number;
  }): Promise<void> {
    // PUT /xdsl/{xdslId}/monitoringNotifications/{id}
    await ovhApi.put(`/xdsl/${accessId}/monitoringNotifications/${alertId}`, alert);
  },

  // ============================================================
  // ADRESSES DE LIVRAISON
  // ============================================================

  /**
   * Récupérer les adresses de livraison.
   * Aligné old_manager: OvhApiPackXdsl.v6().shippingAddresses()
   */
  async getShippingAddresses(packId: string, context: string): Promise<Array<{
    address: string;
    cityName: string;
    countryCode: string;
    firstName: string;
    lastName: string;
    shippingId: string;
    zipCode: string;
  }>> {
    // GET /pack/xdsl/{packName}/shippingAddresses?context={context}
    return ovhApi.get(`/pack/xdsl/${packId}/shippingAddresses?context=${context}`);
  },

  // ============================================================
  // CONTACT OWNER
  // ============================================================

  /**
   * Récupérer le contact propriétaire.
   * Aligné old_manager: OvhApiPackXdsl.v6().getContactOwner()
   */
  async getContactOwner(packId: string): Promise<string> {
    // GET /pack/xdsl/{packName}/contactOwner
    return ovhApi.get<string>(`/pack/xdsl/${packId}/contactOwner`);
  },
};
