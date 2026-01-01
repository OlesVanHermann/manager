// ============================================================
// API PACK MIGRATION - Migration vers autre offre
// Aligné avec old_manager: OvhApiPackXdsl (migration)
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface MigrationOffer {
  offerName: string;
  description: string;
  price: number;
  engagementMonths: number;
  downloadRate: number;
  uploadRate: number;
  isCurrentOffer: boolean;
}

export interface MigrationServicesToDelete {
  services: Array<{
    type: string;
    name: string;
    domain?: string;
  }>;
}

// ---------- API ----------

export const packMigrationApi = {
  /** Récupère les offres de migration disponibles. */
  async getOffers(packName: string, data?: {
    rilesCode?: string;
  }): Promise<MigrationOffer[]> {
    return ovhApi.post<MigrationOffer[]>(`/pack/xdsl/${packName}/migration/offers`, data || {});
  },

  /** Récupère les services à supprimer lors de la migration. */
  async getServicesToDelete(packName: string, offerName: string): Promise<MigrationServicesToDelete> {
    return ovhApi.post<MigrationServicesToDelete>(`/pack/xdsl/${packName}/migration/servicesToDelete`, { offerName });
  },

  /** Lance la migration. */
  async migrate(packName: string, data: {
    offerName: string;
    rio?: string;
    keepCurrentNumber?: boolean;
    meeting?: { startDate: string; endDate: string };
    buildingReference?: string;
    floor?: string;
    stair?: string;
    nicShipping?: string;
  }): Promise<{ orderId: number }> {
    return ovhApi.post<{ orderId: number }>(`/pack/xdsl/${packName}/migration/migrate`, data);
  },
};
