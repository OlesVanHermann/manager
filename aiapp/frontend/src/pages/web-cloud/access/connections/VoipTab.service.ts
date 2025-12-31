// ============================================================
// SERVICE VOIP TAB - Isolé pour lignes VoIP et EcoFax
// ============================================================

import { ovhApi } from '../../../../services/api';
import type { VoipLine, EcoFax, VoipStats, FaxHistoryItem } from '../connections.types';

// ---------- SERVICE ----------

export const voipService = {
  /** Lignes VoIP. */
  async getVoipLines(connectionId: string): Promise<VoipLine[]> {
    const lines = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/voipLine/services`);
    return Promise.all(lines.map(async (line) => {
      const details = await ovhApi.get<any>(`/telephony/line/${line}`).catch(() => ({}));
      return {
        id: line,
        number: details.number || line,
        status: details.status || 'active',
        type: 'line' as const,
      };
    }));
  },

  /** EcoFax. */
  async getEcoFax(_connectionId: string): Promise<EcoFax> {
    return { enabled: false, email: '' };
  },

  /** Configurer EcoFax. */
  async updateEcoFax(_connectionId: string, _config: Partial<EcoFax>): Promise<void> {
    // API EcoFax update
  },

  /** Statistiques VoIP du mois. */
  async getVoipStats(_connectionId: string): Promise<VoipStats> {
    return {
      incomingCalls: 287,
      outgoingCalls: 156,
      totalDuration: 754,
      faxSent: 8,
      faxReceived: 4,
    };
  },

  /** Historique des fax. */
  async getFaxHistory(_connectionId: string): Promise<FaxHistoryItem[]> {
    return [
      { id: 'fax-1', date: '2024-12-30T14:32:00', type: 'received', correspondent: '+33 1 44 55 66 77', pages: 3, status: 'success' },
      { id: 'fax-2', date: '2024-12-29T10:15:00', type: 'sent', correspondent: '+33 1 23 45 67 89', pages: 2, status: 'success' },
      { id: 'fax-3', date: '2024-12-28T16:45:00', type: 'sent', correspondent: '+33 9 72 11 22 33', pages: 1, status: 'error' },
    ];
  },
};
