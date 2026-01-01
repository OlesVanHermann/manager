// ============================================================
// FAX SETTINGS TAB SERVICE - API calls isolés
// Pour les fax liés à un billingAccount telephony
// ============================================================

import { ovhApi } from '../../../../../services/api';

interface FaxSettings {
  callNumber: string;
  countryCode: string;
  faxMaxCall: number;
  faxQuality: 'normal' | 'high' | 'best';
  faxTagLine: string;
  fromEmail: string;
  fromName: string;
  mailUrl: string;
  redirectionEmail: string[];
  rejectAnonymous: boolean;
  sender: string;
}

export const settingsService = {
  // GET /telephony/{ba}/fax/{sn}/settings - Récupérer les paramètres fax
  async getSettings(billingAccount: string, serviceName: string): Promise<FaxSettings> {
    try {
      // API correcte: GET /telephony/{ba}/fax/{sn}/settings
      return await ovhApi.get<FaxSettings>(
        `/telephony/${billingAccount}/fax/${serviceName}/settings`
      );
    } catch {
      return {
        callNumber: '',
        countryCode: 'FR',
        faxMaxCall: 3,
        faxQuality: 'normal',
        faxTagLine: '',
        fromEmail: '',
        fromName: '',
        mailUrl: '',
        redirectionEmail: [],
        rejectAnonymous: false,
        sender: '',
      };
    }
  },

  // PUT /telephony/{ba}/fax/{sn}/settings - Modifier les paramètres fax
  async updateSettings(
    billingAccount: string,
    serviceName: string,
    settings: Partial<FaxSettings>
  ): Promise<void> {
    // API correcte: PUT /telephony/{ba}/fax/{sn}/settings
    await ovhApi.put(
      `/telephony/${billingAccount}/fax/${serviceName}/settings`,
      settings
    );
  },

  // POST /telephony/{ba}/fax/{sn}/settings/changePassword - Changer mot de passe
  async changePassword(
    billingAccount: string,
    serviceName: string,
    password: string
  ): Promise<void> {
    await ovhApi.post(
      `/telephony/${billingAccount}/fax/${serviceName}/settings/changePassword`,
      { password }
    );
  },

  // POST /telephony/{ba}/fax/{sn}/settings/sendFax - Envoyer un fax
  async sendFax(
    billingAccount: string,
    serviceName: string,
    data: { pdfUrl: string; recipients: string[] }
  ): Promise<void> {
    await ovhApi.post(
      `/telephony/${billingAccount}/fax/${serviceName}/settings/sendFax`,
      data
    );
  },

  // GET /telephony/{ba}/fax/{sn}/screenLists - Récupérer les filtres
  async getScreenLists(billingAccount: string, serviceName: string): Promise<{
    callNumber: string;
    type: 'incomingBlackList' | 'incomingWhiteList' | 'outgoingBlackList' | 'outgoingWhiteList';
  }[]> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/fax/${serviceName}/screenLists`);
    } catch {
      return [];
    }
  },

  // POST /telephony/{ba}/fax/{sn}/screenLists - Créer un filtre
  async createScreenList(billingAccount: string, serviceName: string, data: {
    callNumber: string;
    type: 'incomingBlackList' | 'incomingWhiteList' | 'outgoingBlackList' | 'outgoingWhiteList';
  }): Promise<void> {
    await ovhApi.post(`/telephony/${billingAccount}/fax/${serviceName}/screenLists`, data);
  },

  // PUT /telephony/{ba}/fax/{sn}/screenLists - Modifier un filtre
  async updateScreenList(billingAccount: string, serviceName: string, data: {
    callNumber: string;
    type: 'incomingBlackList' | 'incomingWhiteList' | 'outgoingBlackList' | 'outgoingWhiteList';
  }): Promise<void> {
    await ovhApi.put(`/telephony/${billingAccount}/fax/${serviceName}/screenLists`, data);
  },

  // DELETE /telephony/{ba}/fax/{sn}/screenLists - Supprimer un filtre
  async deleteScreenList(billingAccount: string, serviceName: string): Promise<void> {
    await ovhApi.delete(`/telephony/${billingAccount}/fax/${serviceName}/screenLists`);
  },

  // POST /telephony/{ba}/fax/{sn}/screenLists/reset - Réinitialiser les filtres
  async resetScreenLists(billingAccount: string, serviceName: string): Promise<void> {
    await ovhApi.post(`/telephony/${billingAccount}/fax/${serviceName}/screenLists/reset`, {});
  },

  // GET /telephony/{ba}/fax/{sn} - Récupérer les infos du fax
  async getFax(billingAccount: string, serviceName: string): Promise<{
    serviceName: string;
    description: string;
    serviceType: string;
  } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/fax/${serviceName}`);
    } catch {
      return null;
    }
  },

  // PUT /telephony/{ba}/fax/{sn} - Modifier le fax
  async updateFax(billingAccount: string, serviceName: string, data: {
    description?: string;
  }): Promise<void> {
    await ovhApi.put(`/telephony/${billingAccount}/fax/${serviceName}`, data);
  },
};
