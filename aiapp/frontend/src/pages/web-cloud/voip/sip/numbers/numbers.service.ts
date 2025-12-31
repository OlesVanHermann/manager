// ============================================================
// NUMBERS SERVICE - Appels API pour la gestion des numéros VoIP
// ============================================================

import { ovhApi } from '../../../../../services/api';
import type { TelephonyNumber } from '../voip.types';
import type {
  NumberServiceInfos,
  NumberConfiguration,
  NumberScheduler,
  ScheduleTimeCondition,
  NumberCall,
  NumberConsumption,
  NumberRecord,
  NumberOptions,
  NumberConference,
  NumberAgent,
  NumberDDIRule,
  NumberDDIRange,
  NumberSound,
  NumberStats,
  NumberStatsAgent,
  NumberStatsChart,
  NumberSVIMenu,
  NumberSVIEntry,
} from './numbers.types';

export const numbersService = {
  // ---------- GENERAL ----------

  async getNumber(billingAccount: string, serviceName: string): Promise<TelephonyNumber> {
    return ovhApi.get<TelephonyNumber>(`/telephony/${billingAccount}/number/${serviceName}`);
  },

  async updateNumber(
    billingAccount: string,
    serviceName: string,
    data: Partial<TelephonyNumber>
  ): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/number/${serviceName}`, data);
  },

  async getServiceInfos(billingAccount: string, serviceName: string): Promise<NumberServiceInfos> {
    return ovhApi.get<NumberServiceInfos>(
      `/telephony/${billingAccount}/number/${serviceName}/serviceInfos`
    );
  },

  // ---------- CONFIGURATION ----------

  async getConfiguration(
    billingAccount: string,
    serviceName: string
  ): Promise<NumberConfiguration | null> {
    try {
      // Get feature type first
      const number = await this.getNumber(billingAccount, serviceName);
      return {
        featureType: number.featureType as NumberConfiguration['featureType'],
        destination: undefined,
        destinationType: undefined,
      };
    } catch {
      return null;
    }
  },

  async setRedirect(
    billingAccount: string,
    serviceName: string,
    destination: string
  ): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/number/${serviceName}/changeFeatureType`, {
      featureType: 'redirect',
      destination,
    });
  },

  async getConference(
    billingAccount: string,
    serviceName: string
  ): Promise<NumberConference | null> {
    try {
      return await ovhApi.get<NumberConference>(
        `/telephony/${billingAccount}/conference/${serviceName}`
      );
    } catch {
      return null;
    }
  },

  async updateConference(
    billingAccount: string,
    serviceName: string,
    data: Partial<NumberConference>
  ): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/conference/${serviceName}`, data);
  },

  // ---------- SCHEDULER ----------

  async getSchedulers(billingAccount: string, serviceName: string): Promise<NumberScheduler[]> {
    try {
      const ids = await ovhApi.get<number[]>(
        `/telephony/${billingAccount}/number/${serviceName}/scheduler`
      );
      const schedulers = await Promise.all(
        ids.map(async (id) => {
          const scheduler = await ovhApi.get<NumberScheduler>(
            `/telephony/${billingAccount}/number/${serviceName}/scheduler/${id}`
          );
          return scheduler;
        })
      );
      return schedulers;
    } catch {
      return [];
    }
  },

  async createScheduler(
    billingAccount: string,
    serviceName: string,
    data: { name: string }
  ): Promise<NumberScheduler> {
    return ovhApi.post<NumberScheduler>(
      `/telephony/${billingAccount}/number/${serviceName}/scheduler`,
      data
    );
  },

  async deleteScheduler(
    billingAccount: string,
    serviceName: string,
    schedulerId: number
  ): Promise<void> {
    return ovhApi.delete(
      `/telephony/${billingAccount}/number/${serviceName}/scheduler/${schedulerId}`
    );
  },

  // ---------- CALLS ----------

  async getCalls(billingAccount: string, serviceName: string): Promise<NumberCall[]> {
    try {
      // Use history consumption endpoint for numbers
      return await ovhApi
        .get<NumberCall[]>(`/telephony/${billingAccount}/number/${serviceName}/calls`)
        .catch(() => []);
    } catch {
      return [];
    }
  },

  // ---------- CONSUMPTION ----------

  async getConsumption(billingAccount: string, serviceName: string): Promise<NumberConsumption[]> {
    return ovhApi
      .get<NumberConsumption[]>(
        `/telephony/${billingAccount}/number/${serviceName}/consumption`
      )
      .catch(() => []);
  },

  // ---------- RECORDS ----------

  async getRecords(billingAccount: string, serviceName: string): Promise<NumberRecord[]> {
    try {
      const ids = await ovhApi.get<string[]>(
        `/telephony/${billingAccount}/number/${serviceName}/records`
      );
      const records = await Promise.all(
        ids.slice(0, 50).map(async (id) => {
          try {
            return await ovhApi.get<NumberRecord>(
              `/telephony/${billingAccount}/number/${serviceName}/records/${id}`
            );
          } catch {
            return null;
          }
        })
      );
      return records.filter((r): r is NumberRecord => r !== null);
    } catch {
      return [];
    }
  },

  async deleteRecord(
    billingAccount: string,
    serviceName: string,
    recordId: string
  ): Promise<void> {
    return ovhApi.delete(
      `/telephony/${billingAccount}/number/${serviceName}/records/${recordId}`
    );
  },

  async downloadRecord(
    billingAccount: string,
    serviceName: string,
    recordId: string
  ): Promise<string> {
    const result = await ovhApi.get<{ url: string }>(
      `/telephony/${billingAccount}/number/${serviceName}/records/${recordId}/download`
    );
    return result.url;
  },

  // ---------- OPTIONS ----------

  async getOptions(billingAccount: string, serviceName: string): Promise<NumberOptions> {
    return ovhApi
      .get<NumberOptions>(`/telephony/${billingAccount}/number/${serviceName}/options`)
      .catch(() => ({
        displayNumber: true,
        recordIncomingCalls: false,
        antiSpam: false,
      }));
  },

  async updateOptions(
    billingAccount: string,
    serviceName: string,
    options: Partial<NumberOptions>
  ): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/number/${serviceName}/options`, options);
  },

  // ---------- AGENTS ----------

  async getAgents(billingAccount: string, serviceName: string): Promise<NumberAgent[]> {
    try {
      const ids = await ovhApi.get<number[]>(
        `/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/agent`
      );
      const agents = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get<NumberAgent>(
              `/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/agent/${id}`
            );
          } catch {
            return null;
          }
        })
      );
      return agents.filter((a): a is NumberAgent => a !== null);
    } catch {
      return [];
    }
  },

  async createAgent(
    billingAccount: string,
    serviceName: string,
    data: { number: string; simultaneousLines?: number; timeout?: number; wrapUpTime?: number }
  ): Promise<NumberAgent> {
    return ovhApi.post<NumberAgent>(
      `/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/agent`,
      data
    );
  },

  async updateAgent(
    billingAccount: string,
    serviceName: string,
    agentId: number,
    data: Partial<NumberAgent>
  ): Promise<void> {
    return ovhApi.put(
      `/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/agent/${agentId}`,
      data
    );
  },

  async deleteAgent(
    billingAccount: string,
    serviceName: string,
    agentId: number
  ): Promise<void> {
    return ovhApi.delete(
      `/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/agent/${agentId}`
    );
  },

  // ---------- DDI ----------

  async getDDIRules(billingAccount: string, serviceName: string): Promise<NumberDDIRule[]> {
    try {
      const ids = await ovhApi.get<number[]>(
        `/telephony/${billingAccount}/ddi/${serviceName}/rule`
      );
      const rules = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get<NumberDDIRule>(
              `/telephony/${billingAccount}/ddi/${serviceName}/rule/${id}`
            );
          } catch {
            return null;
          }
        })
      );
      return rules.filter((r): r is NumberDDIRule => r !== null);
    } catch {
      return [];
    }
  },

  async getDDIRange(billingAccount: string, serviceName: string): Promise<NumberDDIRange | null> {
    try {
      return await ovhApi.get<NumberDDIRange>(
        `/telephony/${billingAccount}/ddi/${serviceName}`
      );
    } catch {
      return null;
    }
  },

  async createDDIRule(
    billingAccount: string,
    serviceName: string,
    data: { extension: string; destination: string; destinationType: string; description?: string }
  ): Promise<NumberDDIRule> {
    return ovhApi.post<NumberDDIRule>(
      `/telephony/${billingAccount}/ddi/${serviceName}/rule`,
      data
    );
  },

  async updateDDIRule(
    billingAccount: string,
    serviceName: string,
    ruleId: number,
    data: Partial<NumberDDIRule>
  ): Promise<void> {
    return ovhApi.put(
      `/telephony/${billingAccount}/ddi/${serviceName}/rule/${ruleId}`,
      data
    );
  },

  async deleteDDIRule(
    billingAccount: string,
    serviceName: string,
    ruleId: number
  ): Promise<void> {
    return ovhApi.delete(
      `/telephony/${billingAccount}/ddi/${serviceName}/rule/${ruleId}`
    );
  },

  // ---------- SOUNDS ----------

  async getSounds(billingAccount: string, serviceName: string): Promise<NumberSound[]> {
    try {
      const ids = await ovhApi.get<number[]>(
        `/telephony/${billingAccount}/number/${serviceName}/sound`
      );
      const sounds = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get<NumberSound>(
              `/telephony/${billingAccount}/number/${serviceName}/sound/${id}`
            );
          } catch {
            return null;
          }
        })
      );
      return sounds.filter((s): s is NumberSound => s !== null);
    } catch {
      return [];
    }
  },

  async uploadSound(
    billingAccount: string,
    serviceName: string,
    data: { name: string; url: string }
  ): Promise<NumberSound> {
    return ovhApi.post<NumberSound>(
      `/telephony/${billingAccount}/number/${serviceName}/sound`,
      data
    );
  },

  async deleteSound(
    billingAccount: string,
    serviceName: string,
    soundId: number
  ): Promise<void> {
    return ovhApi.delete(
      `/telephony/${billingAccount}/number/${serviceName}/sound/${soundId}`
    );
  },

  async downloadSound(
    billingAccount: string,
    serviceName: string,
    soundId: number
  ): Promise<string> {
    const result = await ovhApi.get<{ url: string }>(
      `/telephony/${billingAccount}/number/${serviceName}/sound/${soundId}/download`
    );
    return result.url;
  },

  // ---------- STATS ----------

  async getStats(
    billingAccount: string,
    serviceName: string,
    period: 'today' | 'week' | 'month' = 'today'
  ): Promise<NumberStats> {
    try {
      return await ovhApi.get<NumberStats>(
        `/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/statistics`,
        { params: { period } }
      );
    } catch {
      return {
        callsReceived: 0,
        callsAnswered: 0,
        callsLost: 0,
        avgWaitingTime: 0,
        avgTalkTime: 0,
        serviceLevel: 0,
        callsPerHour: 0,
      };
    }
  },

  async getStatsAgents(
    billingAccount: string,
    serviceName: string
  ): Promise<NumberStatsAgent[]> {
    try {
      return await ovhApi.get<NumberStatsAgent[]>(
        `/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/agent/statistics`
      );
    } catch {
      return [];
    }
  },

  async getStatsChart(
    billingAccount: string,
    serviceName: string,
    period: 'week' | 'month' = 'week'
  ): Promise<NumberStatsChart[]> {
    try {
      return await ovhApi.get<NumberStatsChart[]>(
        `/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/statistics/chart`,
        { params: { period } }
      );
    } catch {
      return [];
    }
  },

  async exportStatsCsv(
    billingAccount: string,
    serviceName: string,
    period: 'today' | 'week' | 'month'
  ): Promise<string> {
    const result = await ovhApi.post<{ url: string }>(
      `/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/statistics/export`,
      { period, format: 'csv' }
    );
    return result.url;
  },

  // ---------- SVI (IVR) ----------

  async getSVIMenus(billingAccount: string, serviceName: string): Promise<NumberSVIMenu[]> {
    try {
      const ids = await ovhApi.get<number[]>(
        `/telephony/${billingAccount}/svi/${serviceName}/menu`
      );
      const menus = await Promise.all(
        ids.map(async (id) => {
          try {
            const menu = await ovhApi.get<NumberSVIMenu>(
              `/telephony/${billingAccount}/svi/${serviceName}/menu/${id}`
            );
            // Fetch entries for each menu
            const entryIds = await ovhApi.get<number[]>(
              `/telephony/${billingAccount}/svi/${serviceName}/menu/${id}/entry`
            ).catch(() => []);
            const entries = await Promise.all(
              entryIds.map(async (entryId) => {
                try {
                  return await ovhApi.get<NumberSVIEntry>(
                    `/telephony/${billingAccount}/svi/${serviceName}/menu/${id}/entry/${entryId}`
                  );
                } catch {
                  return null;
                }
              })
            );
            return {
              ...menu,
              entries: entries.filter((e): e is NumberSVIEntry => e !== null),
            };
          } catch {
            return null;
          }
        })
      );
      return menus.filter((m): m is NumberSVIMenu => m !== null);
    } catch {
      return [];
    }
  },

  async createSVIMenu(
    billingAccount: string,
    serviceName: string,
    data: { name: string; greetSound?: string; timeout?: number }
  ): Promise<NumberSVIMenu> {
    return ovhApi.post<NumberSVIMenu>(
      `/telephony/${billingAccount}/svi/${serviceName}/menu`,
      data
    );
  },

  async updateSVIMenu(
    billingAccount: string,
    serviceName: string,
    menuId: number,
    data: Partial<NumberSVIMenu>
  ): Promise<void> {
    return ovhApi.put(
      `/telephony/${billingAccount}/svi/${serviceName}/menu/${menuId}`,
      data
    );
  },

  async deleteSVIMenu(
    billingAccount: string,
    serviceName: string,
    menuId: number
  ): Promise<void> {
    return ovhApi.delete(
      `/telephony/${billingAccount}/svi/${serviceName}/menu/${menuId}`
    );
  },

  async createSVIEntry(
    billingAccount: string,
    serviceName: string,
    menuId: number,
    data: { dtmf: string; action: string; actionParam?: string; position?: number }
  ): Promise<NumberSVIEntry> {
    return ovhApi.post<NumberSVIEntry>(
      `/telephony/${billingAccount}/svi/${serviceName}/menu/${menuId}/entry`,
      data
    );
  },

  async deleteSVIEntry(
    billingAccount: string,
    serviceName: string,
    menuId: number,
    entryId: number
  ): Promise<void> {
    return ovhApi.delete(
      `/telephony/${billingAccount}/svi/${serviceName}/menu/${menuId}/entry/${entryId}`
    );
  },
};
