// ============================================================
// PORTABILITY TAB SERVICE - Appels API isolés pour Portability
// Target: target_.web-cloud.voip.group.portability.svg
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../services/api';

// Types locaux pour ce tab
export interface GroupPortability {
  id: number;
  creationDate: string;
  desiredExecutionDate: string | null;
  status: 'todo' | 'pending' | 'done' | 'cancelled' | 'error';
  numbersList: string[];
  type: 'portIn' | 'portOut';
}

// Service isolé pour PortabilityTab
export const portabilityTabService = {
  // Récupérer la liste des portabilités
  async getPortabilities(billingAccount: string): Promise<GroupPortability[]> {
    const ids = await ovhApi.get<number[]>(`/telephony/${billingAccount}/portability`).catch(() => []);
    const portabilities = await Promise.all(
      ids.map(async (id) => {
        try {
          return await ovhApi.get<GroupPortability>(`/telephony/${billingAccount}/portability/${id}`);
        } catch {
          return null;
        }
      })
    );
    return portabilities.filter((p): p is GroupPortability => p !== null);
  },

  // Récupérer les détails d'une portabilité
  async getPortabilityDetails(billingAccount: string, portabilityId: number): Promise<GroupPortability | null> {
    try {
      return await ovhApi.get<GroupPortability>(`/telephony/${billingAccount}/portability/${portabilityId}`);
    } catch {
      return null;
    }
  },

  // Créer une demande de portabilité
  async createPortability(billingAccount: string, data: {
    numbers: string[];
    desiredExecutionDate?: string;
  }): Promise<GroupPortability> {
    return ovhApi.post<GroupPortability>(`/telephony/${billingAccount}/portability`, data);
  },

  // Helper: Déterminer le type de badge selon le statut
  getStatusBadgeType(status: string): 'success' | 'warning' | 'error' | 'info' {
    switch (status) {
      case 'done':
        return 'success';
      case 'pending':
      case 'todo':
        return 'warning';
      case 'cancelled':
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  },
};
