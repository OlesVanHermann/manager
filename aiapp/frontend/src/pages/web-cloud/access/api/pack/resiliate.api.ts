// ============================================================
// API PACK RESILIATE - Résiliation
// Aligné avec old_manager: OvhApiPackXdslResiliation
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface ResiliationTerms {
  resiliationDate: string;
  minResiliationDate: string;
  resiliationReasons: string[];
  engagementEndDate?: string;
  penaltyAmount?: number;
}

export interface ResiliationFollowUp {
  status: string;
  dateTodo?: string;
  needModemReturn: boolean;
  registrationDate?: string;
  resiliationDate?: string;
}

// ---------- API ----------

export const packResiliateApi = {
  /** Récupère les conditions de résiliation. */
  async getTerms(packName: string): Promise<ResiliationTerms> {
    return ovhApi.get<ResiliationTerms>(`/pack/xdsl/${packName}/resiliationTerms`);
  },

  /** Lance la résiliation. */
  async resiliate(packName: string, data: {
    resiliationSurvey?: {
      reason: string;
      details?: string;
    };
  }): Promise<void> {
    await ovhApi.post(`/pack/xdsl/${packName}/resiliate`, data);
  },

  /** Récupère le suivi de résiliation. */
  async getFollowUp(packName: string): Promise<ResiliationFollowUp> {
    return ovhApi.get<ResiliationFollowUp>(`/pack/xdsl/${packName}/resiliationFollowUp`);
  },

  /** Annule la résiliation. */
  async cancel(packName: string): Promise<void> {
    await ovhApi.post(`/pack/xdsl/${packName}/cancelResiliation`, {});
  },
};
