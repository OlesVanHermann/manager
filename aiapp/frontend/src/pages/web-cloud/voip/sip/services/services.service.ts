// ============================================================
// SERVICES TAB SERVICE - Appels API isolés pour Services
// Target: target_.web-cloud.voip.group.services.svg
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../services/api';

// Types locaux pour ce tab
export interface ServiceItem {
  serviceName: string;
  type: 'line' | 'number' | 'fax';
  description?: string;
}

export interface ServiceCounts {
  all: number;
  line: number;
  number: number;
  fax: number;
}

// Service isolé pour ServicesTab
export const servicesTabService = {
  // Récupérer la liste des lignes
  async getLines(billingAccount: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/telephony/${billingAccount}/line`).catch(() => []);
  },

  // Récupérer la liste des numéros
  async getNumbers(billingAccount: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/telephony/${billingAccount}/number`).catch(() => []);
  },

  // Récupérer la liste des fax
  async getFaxList(billingAccount: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/telephony/${billingAccount}/fax`).catch(() => []);
  },

  // Récupérer tous les services consolidés
  async getAllServices(billingAccount: string): Promise<ServiceItem[]> {
    const [lines, numbers, faxList] = await Promise.all([
      this.getLines(billingAccount),
      this.getNumbers(billingAccount),
      this.getFaxList(billingAccount),
    ]);

    const allServices: ServiceItem[] = [
      ...lines.map((s) => ({ serviceName: s, type: 'line' as const })),
      ...numbers.map((s) => ({ serviceName: s, type: 'number' as const })),
      ...faxList.map((s) => ({ serviceName: s, type: 'fax' as const })),
    ];

    return allServices;
  },

  // Calculer les compteurs par type
  getServiceCounts(services: ServiceItem[]): ServiceCounts {
    return {
      all: services.length,
      line: services.filter((s) => s.type === 'line').length,
      number: services.filter((s) => s.type === 'number').length,
      fax: services.filter((s) => s.type === 'fax').length,
    };
  },
};
