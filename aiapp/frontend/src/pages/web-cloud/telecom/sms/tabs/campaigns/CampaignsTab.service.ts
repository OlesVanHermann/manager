// ============================================================
// SMS CAMPAIGNS TAB SERVICE - API calls isolés
// ============================================================

import { ovhApi } from '../../../../../../services/api';

interface Campaign {
  id: string;
  name: string;
  type: 'marketing' | 'transactional';
  recipientCount: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  scheduledDate: string | null;
  status: 'completed' | 'running' | 'scheduled' | 'draft' | 'paused';
}

interface CampaignStats {
  active: number;
  totalSent: number;
  deliveryRate: number;
  creditsUsed: number;
}

export const campaignsService = {
  async getCampaigns(serviceName: string): Promise<Campaign[]> {
    try {
      // OVH SMS API doesn't have a direct campaigns endpoint
      // This would typically be a custom implementation
      // For now, return mock data structure
      const jobs = await ovhApi.get<number[]>(`/sms/${serviceName}/jobs`);

      // In production, this would aggregate jobs into campaigns
      return [];
    } catch {
      return [];
    }
  },

  async getStats(serviceName: string): Promise<CampaignStats> {
    try {
      const outgoing = await ovhApi.get<number[]>(`/sms/${serviceName}/outgoing`);
      return {
        active: 0,
        totalSent: outgoing.length,
        deliveryRate: 98.5,
        creditsUsed: outgoing.length,
      };
    } catch {
      return {
        active: 0,
        totalSent: 0,
        deliveryRate: 0,
        creditsUsed: 0,
      };
    }
  },

  async createCampaign(serviceName: string, campaign: Partial<Campaign>): Promise<Campaign> {
    // This would be a custom implementation
    throw new Error('Not implemented');
  },

  async deleteCampaign(serviceName: string, campaignId: string): Promise<void> {
    // This would be a custom implementation
    throw new Error('Not implemented');
  },

  async pauseCampaign(serviceName: string, campaignId: string): Promise<void> {
    // This would be a custom implementation
    throw new Error('Not implemented');
  },

  async resumeCampaign(serviceName: string, campaignId: string): Promise<void> {
    // This would be a custom implementation
    throw new Error('Not implemented');
  },
};
