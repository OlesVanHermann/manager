// ============================================================
// DDI TAB SERVICE - Appels API isolés pour Numbers DDI
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../../services/api';

export interface DdiRule {
  extension: string;
  destination: string;
  destinationType: 'internal' | 'external' | 'queue' | 'svi';
  enabled: boolean;
  description: string;
}

export interface DdiRange {
  min: string;
  max: string;
}

export const ddiTabService = {
  async getDdiRules(billingAccount: string, serviceName: string): Promise<DdiRule[]> {
    try {
      // DDI endpoints - récupérer les extensions
      const extensions = await ovhApi.get<string[]>(`/telephony/${billingAccount}/ddi/${serviceName}/extensions`);
      const rules = await Promise.all(
        extensions.map(async (ext) => {
          try {
            return await ovhApi.get<DdiRule>(`/telephony/${billingAccount}/ddi/${serviceName}/extensions/${ext}`);
          } catch {
            return null;
          }
        })
      );
      return rules.filter((r): r is DdiRule => r !== null);
    } catch {
      return [];
    }
  },

  async getDdiRange(billingAccount: string, serviceName: string): Promise<DdiRange | null> {
    try {
      return await ovhApi.get<DdiRange>(`/telephony/${billingAccount}/ddi/${serviceName}/range`);
    } catch {
      return null;
    }
  },

  async deleteDdiRule(billingAccount: string, serviceName: string, extension: string): Promise<void> {
    return ovhApi.delete(`/telephony/${billingAccount}/ddi/${serviceName}/extensions/${extension}`);
  },

  async updateDdiRule(billingAccount: string, serviceName: string, extension: string, data: Partial<DdiRule>): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/ddi/${serviceName}/extensions/${extension}`, data);
  },

  async addDdiRule(billingAccount: string, serviceName: string, data: Partial<DdiRule>): Promise<DdiRule> {
    return ovhApi.post<DdiRule>(`/telephony/${billingAccount}/ddi/${serviceName}/extensions`, data);
  },
};
