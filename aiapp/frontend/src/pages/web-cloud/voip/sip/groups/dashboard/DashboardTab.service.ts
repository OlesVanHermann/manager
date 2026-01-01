// ============================================================
// DASHBOARD TAB SERVICE - Appels API isolés pour Dashboard
// Target: target_.web-cloud.voip.group.dashboard.svg
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type {
  TelephonyBillingAccount,
  TelephonyHistoryConsumption,
  TelephonyLine,
  TelephonyPhone,
} from '../../../voip.types';

// Types locaux pour ce tab
export interface DashboardCounts {
  lines: number;
  numbers: number;
  fax: number;
}

export interface PhoneWithLine {
  serviceName: string;
  phone: TelephonyPhone | null;
}

// Service isolé pour DashboardTab
export const dashboardTabService = {
  // Récupérer les détails du groupe
  async getGroup(billingAccount: string): Promise<TelephonyBillingAccount> {
    return ovhApi.get<TelephonyBillingAccount>(`/telephony/${billingAccount}`);
  },

  // Récupérer l'historique de consommation
  async getHistoryConsumption(billingAccount: string): Promise<TelephonyHistoryConsumption[]> {
    return ovhApi
      .get<TelephonyHistoryConsumption[]>(`/telephony/${billingAccount}/historyConsumption`)
      .catch(() => []);
  },

  // Récupérer le nombre de lignes
  async getLines(billingAccount: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/telephony/${billingAccount}/line`).catch(() => []);
  },

  // Récupérer le nombre de numéros
  async getNumbers(billingAccount: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/telephony/${billingAccount}/number`).catch(() => []);
  },

  // Récupérer le nombre de fax
  async getFaxList(billingAccount: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/telephony/${billingAccount}/fax`).catch(() => []);
  },

  // Récupérer les téléphones associés aux lignes
  async getAllPhones(billingAccount: string): Promise<PhoneWithLine[]> {
    const lines = await this.getLines(billingAccount);
    const phones = await Promise.all(
      lines.map(async (serviceName) => {
        try {
          const phone = await ovhApi.get<TelephonyPhone>(
            `/telephony/${billingAccount}/line/${serviceName}/phone`
          );
          return { serviceName, phone };
        } catch {
          return { serviceName, phone: null };
        }
      })
    );
    return phones;
  },

  // Récupérer tous les compteurs en une fois
  async getCounts(billingAccount: string): Promise<DashboardCounts> {
    const [lines, numbers, faxList] = await Promise.all([
      this.getLines(billingAccount),
      this.getNumbers(billingAccount),
      this.getFaxList(billingAccount),
    ]);
    return {
      lines: lines.length,
      numbers: numbers.length,
      fax: faxList.length,
    };
  },

  // Charger toutes les données du dashboard
  async loadDashboardData(billingAccount: string) {
    const [consumption, phones, counts] = await Promise.all([
      this.getHistoryConsumption(billingAccount),
      this.getAllPhones(billingAccount),
      this.getCounts(billingAccount),
    ]);
    return {
      consumption: consumption.slice(0, 5),
      phones,
      counts,
    };
  },
};
