// ============================================================
// API PACK MOVE - Déménagement
// Aligné avec old_manager: OvhApiPackXdslMove
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface MoveEligibility {
  eligible: boolean;
  offers?: MoveOffer[];
  reason?: string;
}

export interface MoveOffer {
  productCode: string;
  description: string;
  price: number;
  downloadRate: number;
  uploadRate: number;
}

export interface MoveMeeting {
  fakeMeeting: boolean;
  meetingSlots?: Array<{
    startDate: string;
    endDate: string;
  }>;
}

// ---------- API ----------

export const packMoveApi = {
  /** Vérifie l'éligibilité au déménagement. */
  async checkEligibility(packName: string, address: {
    rilesCode?: string;
    streetNumber?: string;
    streetName?: string;
    zipCode?: string;
    city?: string;
  }): Promise<MoveEligibility> {
    return ovhApi.post<MoveEligibility>(`/pack/xdsl/${packName}/addressMove/eligibility`, address);
  },

  /** Récupère les créneaux de rendez-vous. */
  async getMeetingSlots(packName: string, offerId: string): Promise<MoveMeeting> {
    return ovhApi.get<MoveMeeting>(`/pack/xdsl/${packName}/addressMove/meetingSlots?offerId=${offerId}`);
  },

  /** Lance le déménagement. */
  async move(packName: string, data: {
    offerId: string;
    keepCurrentNumber?: boolean;
    rio?: string;
    meeting?: { startDate: string; endDate: string };
  }): Promise<{ taskId: number }> {
    return ovhApi.post<{ taskId: number }>(`/pack/xdsl/${packName}/addressMove/move`, data);
  },

  /** Récupère les adresses de livraison. */
  async getShippingAddresses(packName: string, context: string): Promise<any[]> {
    return ovhApi.get<any[]>(`/pack/xdsl/${packName}/shippingAddresses?context=${context}`);
  },
};
