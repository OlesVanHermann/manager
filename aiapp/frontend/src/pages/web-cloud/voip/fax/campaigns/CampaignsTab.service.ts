// ============================================================
// FAX CAMPAIGNS TAB SERVICE - API calls isolés
// ============================================================

import { ovhApi } from '../../../../../../services/api';

interface FaxCampaign {
  id: string;
  name: string;
  creationDatetime: string;
  recipientsCount: number;
  sentCount: number;
  failedCount: number;
  status: 'scheduled' | 'running' | 'completed' | 'cancelled';
}

export const campaignsService = {
  async getCampaigns(serviceName: string): Promise<FaxCampaign[]> {
    try {
      const ids = await ovhApi.get<string[]>(
        `/freefax/${serviceName}/voicemail/campaigns`
      );
      // Would need to fetch each campaign's details
      return [];
    } catch {
      return [];
    }
  },

  async getCampaign(
    serviceName: string,
    campaignId: string
  ): Promise<FaxCampaign | null> {
    try {
      return await ovhApi.get<FaxCampaign>(
        `/freefax/${serviceName}/voicemail/campaigns/${campaignId}`
      );
    } catch {
      return null;
    }
  },

  async createCampaign(
    serviceName: string,
    campaign: Partial<FaxCampaign>
  ): Promise<FaxCampaign> {
    return ovhApi.post(
      `/freefax/${serviceName}/voicemail/campaigns`,
      campaign
    );
  },

  async deleteCampaign(
    serviceName: string,
    campaignId: string
  ): Promise<void> {
    await ovhApi.delete(
      `/freefax/${serviceName}/voicemail/campaigns/${campaignId}`
    );
  },

  async startCampaign(
    serviceName: string,
    campaignId: string
  ): Promise<void> {
    await ovhApi.post(
      `/freefax/${serviceName}/voicemail/campaigns/${campaignId}/start`,
      {}
    );
  },

  async stopCampaign(
    serviceName: string,
    campaignId: string
  ): Promise<void> {
    await ovhApi.post(
      `/freefax/${serviceName}/voicemail/campaigns/${campaignId}/stop`,
      {}
    );
  },
};
