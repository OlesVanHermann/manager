// ============================================================
// FAX CAMPAIGNS TAB SERVICE - API calls isolés
// Pour les fax liés à un billingAccount telephony
// ============================================================

import { ovhApi } from '../../../../../services/api';

interface FaxCampaign {
  id: number;
  name: string;
  faxQuality: 'normal' | 'high' | 'best';
  recipientsList: string[];
  recipientsType: 'document' | 'list';
  reference: string;
  sendReport: boolean;
  status: 'todo' | 'doing' | 'done' | 'stopped' | 'error';
  todoDate: string;
  countFailed: number;
  countSuccess: number;
  countTotal: number;
}

interface FaxCampaignCreate {
  name: string;
  faxQuality?: 'normal' | 'high' | 'best';
  recipientsList: string[];
  sendReport?: boolean;
  todoDate?: string;
  documentId: string;
}

interface FaxCampaignDetail {
  id: number;
  recipientNumber: string;
  status: 'todo' | 'doing' | 'done' | 'stopped' | 'error';
}

export const campaignsService = {
  // GET /telephony/{ba}/fax/{sn}/campaigns - Liste des campagnes
  async getCampaigns(billingAccount: string, serviceName: string): Promise<FaxCampaign[]> {
    try {
      const ids = await ovhApi.get<number[]>(
        `/telephony/${billingAccount}/fax/${serviceName}/campaigns`
      );
      const campaigns = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get<FaxCampaign>(
              `/telephony/${billingAccount}/fax/${serviceName}/campaigns/${id}`
            );
          } catch {
            return null;
          }
        })
      );
      return campaigns.filter((c): c is FaxCampaign => c !== null);
    } catch {
      return [];
    }
  },

  // GET /telephony/{ba}/fax/{sn}/campaigns/{id} - Détail d'une campagne
  async getCampaign(
    billingAccount: string,
    serviceName: string,
    campaignId: number
  ): Promise<FaxCampaign | null> {
    try {
      return await ovhApi.get<FaxCampaign>(
        `/telephony/${billingAccount}/fax/${serviceName}/campaigns/${campaignId}`
      );
    } catch {
      return null;
    }
  },

  // POST /telephony/{ba}/fax/{sn}/campaigns - Créer une campagne
  async createCampaign(
    billingAccount: string,
    serviceName: string,
    data: FaxCampaignCreate
  ): Promise<FaxCampaign> {
    return ovhApi.post<FaxCampaign>(
      `/telephony/${billingAccount}/fax/${serviceName}/campaigns`,
      data
    );
  },

  // DELETE /telephony/{ba}/fax/{sn}/campaigns/{id} - Supprimer une campagne
  async deleteCampaign(
    billingAccount: string,
    serviceName: string,
    campaignId: number
  ): Promise<void> {
    await ovhApi.delete(
      `/telephony/${billingAccount}/fax/${serviceName}/campaigns/${campaignId}`
    );
  },

  // POST /telephony/{ba}/fax/{sn}/campaigns/{id}/start - Démarrer une campagne
  async startCampaign(
    billingAccount: string,
    serviceName: string,
    campaignId: number
  ): Promise<void> {
    await ovhApi.post(
      `/telephony/${billingAccount}/fax/${serviceName}/campaigns/${campaignId}/start`,
      {}
    );
  },

  // POST /telephony/{ba}/fax/{sn}/campaigns/{id}/stop - Arrêter une campagne
  async stopCampaign(
    billingAccount: string,
    serviceName: string,
    campaignId: number
  ): Promise<void> {
    await ovhApi.post(
      `/telephony/${billingAccount}/fax/${serviceName}/campaigns/${campaignId}/stop`,
      {}
    );
  },

  // GET /telephony/{ba}/fax/{sn}/campaigns/{id}/detail - Détails des destinataires
  async getCampaignDetails(
    billingAccount: string,
    serviceName: string,
    campaignId: number
  ): Promise<FaxCampaignDetail[]> {
    try {
      const ids = await ovhApi.get<number[]>(
        `/telephony/${billingAccount}/fax/${serviceName}/campaigns/${campaignId}/detail`
      );
      const details = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get<FaxCampaignDetail>(
              `/telephony/${billingAccount}/fax/${serviceName}/campaigns/${campaignId}/detail/${id}`
            );
          } catch {
            return null;
          }
        })
      );
      return details.filter((d): d is FaxCampaignDetail => d !== null);
    } catch {
      return [];
    }
  },
};
