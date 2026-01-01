// ============================================================
// API XDSL INCIDENT - Incidents de ligne
// Aligné avec old_manager: OvhApiXdsl.Incident
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface XdslIncident {
  id: number;
  creationDate: string;
  endDate?: string;
  comment?: string;
  nra?: string;
  operators?: string[];
  taskId?: number;
}

// ---------- API ----------

export const xdslIncidentApi = {
  /**
   * Récupère l'incident en cours.
   * Retourne null si code 404 (pas d'incident).
   */
  async get(accessName: string): Promise<XdslIncident | null> {
    try {
      return await ovhApi.get<XdslIncident>(`/xdsl/${accessName}/incident`);
    } catch (error: any) {
      // Code 404 = pas d'incident
      if (error?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /** Vérifie s'il y a un incident en cours. */
  async hasIncident(accessName: string): Promise<boolean> {
    const incident = await this.get(accessName);
    return incident !== null;
  },
};
