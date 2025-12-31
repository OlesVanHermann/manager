// ============================================================
// FAX SETTINGS TAB SERVICE - API calls isolés
// ============================================================

import { ovhApi } from '../../../../../../services/api';

interface FaxSettings {
  fromName: string;
  fromEmail: string;
  faxQuality: 'normal' | 'high' | 'best';
  faxMaxTry: number;
  mailUrl: string;
  redirectionEmail: string[];
  sendMode: 'auto' | 'manual';
  callNumber: string;
  countryCode: string;
}

interface FaxNotifications {
  sendEmail: boolean;
  receiveEmail: boolean;
  emailOnError: boolean;
}

export const settingsService = {
  async getSettings(serviceName: string): Promise<FaxSettings> {
    try {
      return await ovhApi.get<FaxSettings>(
        `/freefax/${serviceName}`
      );
    } catch {
      return {
        fromName: '',
        fromEmail: '',
        faxQuality: 'normal',
        faxMaxTry: 3,
        mailUrl: '',
        redirectionEmail: [],
        sendMode: 'auto',
        callNumber: '',
        countryCode: 'FR',
      };
    }
  },

  async updateSettings(
    serviceName: string,
    settings: Partial<FaxSettings>
  ): Promise<void> {
    await ovhApi.put(
      `/freefax/${serviceName}`,
      settings
    );
  },

  async getNotifications(serviceName: string): Promise<FaxNotifications> {
    try {
      return await ovhApi.get<FaxNotifications>(
        `/freefax/${serviceName}/voicemail/routing`
      );
    } catch {
      return {
        sendEmail: true,
        receiveEmail: true,
        emailOnError: true,
      };
    }
  },

  async updateNotifications(
    serviceName: string,
    notifications: FaxNotifications
  ): Promise<void> {
    await ovhApi.put(
      `/freefax/${serviceName}/voicemail/routing`,
      notifications
    );
  },

  async testFax(serviceName: string): Promise<void> {
    await ovhApi.post(
      `/freefax/${serviceName}/voicemail/test`,
      {}
    );
  },
};
