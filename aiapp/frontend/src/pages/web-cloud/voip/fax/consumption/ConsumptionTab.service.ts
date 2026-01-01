// ============================================================
// FAX CONSUMPTION TAB SERVICE - API calls isolés
// ============================================================

import { ovhApi } from '../../../../../services/api';

interface FaxConsumption {
  id: string;
  datetime: string;
  destinationNumber: string;
  pages: number;
  duration: number;
  price: number;
  status: 'success' | 'failed';
}

interface ConsumptionStats {
  total: number;
  pagesCount: number;
  totalCost: number;
}

export const consumptionService = {
  async getConsumption(
    serviceName: string,
    wayType: 'outgoing' | 'incoming'
  ): Promise<FaxConsumption[]> {
    try {
      const data = await ovhApi.get<FaxConsumption[]>(
        `/freefax/${serviceName}/voicemail/consumption?wayType=${wayType}`
      );
      return data;
    } catch {
      return [];
    }
  },

  async getStats(serviceName: string): Promise<ConsumptionStats> {
    try {
      return await ovhApi.get<ConsumptionStats>(
        `/freefax/${serviceName}/voicemail/consumption`
      );
    } catch {
      return { total: 0, pagesCount: 0, totalCost: 0 };
    }
  },

  async downloadFax(
    serviceName: string,
    consumptionId: string
  ): Promise<Blob> {
    const response = await fetch(
      `/api/ovh/freefax/${serviceName}/voicemail/consumption/${consumptionId}/download`,
      { credentials: 'include' }
    );
    return response.blob();
  },
};
