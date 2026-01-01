// ============================================================
// SMS GENERAL TAB SERVICE - API calls isolés
// ============================================================

import { ovhApi } from '../../../../services/api';
import type { SmsAccount } from '../../sms.types';

interface SmsStats {
  sent: number;
  received: number;
  pending: number;
}

export const generalService = {
  async getAccount(serviceName: string): Promise<SmsAccount> {
    return ovhApi.get<SmsAccount>(`/sms/${serviceName}`);
  },

  async getStatistics(serviceName: string): Promise<SmsStats> {
    try {
      // Try to get real stats from API
      const outgoing = await ovhApi.get<number[]>(`/sms/${serviceName}/outgoing`);
      const incoming = await ovhApi.get<number[]>(`/sms/${serviceName}/incoming`);
      const jobs = await ovhApi.get<number[]>(`/sms/${serviceName}/jobs`);

      return {
        sent: outgoing.length,
        received: incoming.length,
        pending: jobs.length,
      };
    } catch {
      // Fallback to mock data if API fails
      return { sent: 0, received: 0, pending: 0 };
    }
  },

  async getSenders(serviceName: string): Promise<string[]> {
    try {
      return await ovhApi.get<string[]>(`/sms/${serviceName}/senders`);
    } catch {
      return [];
    }
  },

  // PUT /sms/{serviceName} - Modifier le compte SMS
  async updateAccount(serviceName: string, data: Partial<SmsAccount>): Promise<void> {
    await ovhApi.put(`/sms/${serviceName}`, data);
  },

  // GET /sms/{serviceName}/seeOffers - Voir les offres disponibles
  async seeOffers(serviceName: string): Promise<{ name: string; quantity: number; price: { value: number; currencyCode: string } }[]> {
    try {
      return await ovhApi.get(`/sms/${serviceName}/seeOffers`);
    } catch {
      return [];
    }
  },

  // GET /sms/{serviceName}/document - Récupérer un document (facture, etc.)
  async getDocument(serviceName: string, wayType: 'incoming' | 'outgoing'): Promise<string> {
    try {
      const result = await ovhApi.get<string>(`/sms/${serviceName}/document`, { params: { wayType } });
      return result;
    } catch {
      return '';
    }
  },

  // GET /sms/{serviceName}/serviceInfos - Informations du service
  async getServiceInfos(serviceName: string): Promise<{
    domain: string;
    serviceId: number;
    creation: string;
    expiration: string;
    status: string;
    contactAdmin: string;
    contactTech: string;
    contactBilling: string;
  } | null> {
    try {
      return await ovhApi.get(`/sms/${serviceName}/serviceInfos`);
    } catch {
      return null;
    }
  },

  // GET /sms/{serviceName}/sendersAvailableForValidation - Expéditeurs en attente de validation
  async getSendersAvailableForValidation(serviceName: string): Promise<string[]> {
    try {
      return await ovhApi.get<string[]>(`/sms/${serviceName}/sendersAvailableForValidation`);
    } catch {
      return [];
    }
  },
};
