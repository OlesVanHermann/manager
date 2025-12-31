// ============================================================
// SCHEDULER TAB SERVICE - Appels API isolés pour Numbers Scheduler
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../../services/api';

export interface SchedulerCondition {
  id: number;
  day: string;
  hourBegin: string;
  hourEnd: string;
  policy: 'available' | 'unavailable';
}

export interface SchedulerTimeCondition {
  id: number;
  condition: string;
  timeFrom: string;
  timeTo: string;
  policy: string;
}

export const schedulerTabService = {
  async getSchedule(billingAccount: string, serviceName: string): Promise<SchedulerCondition[]> {
    try {
      const ids = await ovhApi.get<number[]>(`/telephony/${billingAccount}/scheduler/${serviceName}/conditions`);
      const conditions = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get<SchedulerCondition>(`/telephony/${billingAccount}/scheduler/${serviceName}/conditions/${id}`);
          } catch {
            return null;
          }
        })
      );
      return conditions.filter((c): c is SchedulerCondition => c !== null);
    } catch {
      return [];
    }
  },

  async createCondition(billingAccount: string, serviceName: string, data: Omit<SchedulerCondition, 'id'>): Promise<SchedulerCondition> {
    return ovhApi.post<SchedulerCondition>(`/telephony/${billingAccount}/scheduler/${serviceName}/conditions`, data);
  },

  async deleteCondition(billingAccount: string, serviceName: string, conditionId: number): Promise<void> {
    return ovhApi.delete(`/telephony/${billingAccount}/scheduler/${serviceName}/conditions/${conditionId}`);
  },
};
