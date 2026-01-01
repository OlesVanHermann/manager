// ============================================================
// NUMBERS SERVICE - Appels API pour la gestion des numéros VoIP
// ============================================================

import { ovhApi } from '../../../../../services/api';
import type {
  TelephonyNumber,
  TelephonyTimeConditionOptions,
  TelephonyTimeCondition,
  TelephonyTimeConditionCreate,
} from '../voip.types';
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

  // ---------- TIME CONDITION ----------

  async getTimeConditionOptions(
    billingAccount: string,
    serviceName: string
  ): Promise<TelephonyTimeConditionOptions | null> {
    try {
      return await ovhApi.get<TelephonyTimeConditionOptions>(
        `/telephony/${billingAccount}/timeCondition/${serviceName}/options`
      );
    } catch {
      return null;
    }
  },

  async updateTimeConditionOptions(
    billingAccount: string,
    serviceName: string,
    data: Partial<TelephonyTimeConditionOptions>
  ): Promise<void> {
    return ovhApi.put(
      `/telephony/${billingAccount}/timeCondition/${serviceName}/options`,
      data
    );
  },

  async getTimeConditions(
    billingAccount: string,
    serviceName: string
  ): Promise<TelephonyTimeCondition[]> {
    try {
      const ids = await ovhApi.get<number[]>(
        `/telephony/${billingAccount}/timeCondition/${serviceName}/condition`
      );
      const conditions = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get<TelephonyTimeCondition>(
              `/telephony/${billingAccount}/timeCondition/${serviceName}/condition/${id}`
            );
          } catch {
            return null;
          }
        })
      );
      return conditions.filter((c): c is TelephonyTimeCondition => c !== null);
    } catch {
      return [];
    }
  },

  async createTimeCondition(
    billingAccount: string,
    serviceName: string,
    data: TelephonyTimeConditionCreate
  ): Promise<TelephonyTimeCondition> {
    return ovhApi.post<TelephonyTimeCondition>(
      `/telephony/${billingAccount}/timeCondition/${serviceName}/condition`,
      data
    );
  },

  async updateTimeCondition(
    billingAccount: string,
    serviceName: string,
    id: number,
    data: Partial<TelephonyTimeConditionCreate>
  ): Promise<void> {
    return ovhApi.put(
      `/telephony/${billingAccount}/timeCondition/${serviceName}/condition/${id}`,
      data
    );
  },

  async deleteTimeCondition(
    billingAccount: string,
    serviceName: string,
    id: number
  ): Promise<void> {
    return ovhApi.delete(
      `/telephony/${billingAccount}/timeCondition/${serviceName}/condition/${id}`
    );
  },

  // ---------- APIs MANQUANTES EASYHUNTING ----------

  // GET /telephony/{ba}/easyHunting/{sn} - Récupérer config easyHunting
  async getEasyHunting(billingAccount: string, serviceName: string): Promise<{
    featureType: string;
    serviceName: string;
    description: string;
    serviceType: string;
  } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/easyHunting/${serviceName}`);
    } catch {
      return null;
    }
  },

  // PUT /telephony/{ba}/easyHunting/{sn} - Modifier config easyHunting
  async updateEasyHunting(billingAccount: string, serviceName: string, data: {
    description?: string;
  }): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/easyHunting/${serviceName}`, data);
  },

  // GET /telephony/{ba}/easyHunting/{sn}/hunting - Config du hunting
  async getHuntingConfig(billingAccount: string, serviceName: string): Promise<{
    crmUrlTemplate: string;
    g729: boolean;
    name: string;
    statusIvrEnabled: boolean;
    toneOnClosing: number;
    toneOnHold: number;
    toneOnOpening: number;
    toneRingback: number;
    voicemail: string;
  } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/easyHunting/${serviceName}/hunting`);
    } catch {
      return null;
    }
  },

  // PUT /telephony/{ba}/easyHunting/{sn}/hunting - Modifier config hunting
  async updateHuntingConfig(billingAccount: string, serviceName: string, data: {
    crmUrlTemplate?: string;
    g729?: boolean;
    name?: string;
    statusIvrEnabled?: boolean;
    voicemail?: string;
  }): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/easyHunting/${serviceName}/hunting`, data);
  },

  // GET /telephony/{ba}/easyHunting/{sn}/hunting/queue - Liste des queues
  async getQueues(billingAccount: string, serviceName: string): Promise<{
    queueId: number;
    description: string;
    strategy: string;
    maxMember: number;
    maxWaitTime: number;
    soundOnHold: number;
  }[]> {
    try {
      const ids = await ovhApi.get<number[]>(`/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/queue`);
      const queues = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get(`/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/queue/${id}`);
          } catch {
            return null;
          }
        })
      );
      return queues.filter((q): q is NonNullable<typeof q> => q !== null);
    } catch {
      return [];
    }
  },

  // GET /telephony/{ba}/easyHunting/{sn}/hunting/queue/{queueId}/liveCalls - Appels en cours
  async getLiveCalls(billingAccount: string, serviceName: string, queueId: number): Promise<{
    id: number;
    agent: string;
    callerIdName: string;
    callerIdNumber: string;
    state: string;
    begin: string;
    answered: string | null;
  }[]> {
    try {
      const ids = await ovhApi.get<number[]>(
        `/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/queue/${queueId}/liveCalls`
      );
      const calls = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get(
              `/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/queue/${queueId}/liveCalls/${id}`
            );
          } catch {
            return null;
          }
        })
      );
      return calls.filter((c): c is NonNullable<typeof c> => c !== null);
    } catch {
      return [];
    }
  },

  // POST /telephony/{ba}/easyHunting/{sn}/soundUpload - Upload son
  async uploadEasyHuntingSound(billingAccount: string, serviceName: string, data: {
    name: string;
    url: string;
  }): Promise<{ taskId: number }> {
    return ovhApi.post(`/telephony/${billingAccount}/easyHunting/${serviceName}/soundUpload`, data);
  },

  // GET /telephony/{ba}/easyHunting/{sn}/records - Liste des enregistrements
  async getEasyHuntingRecords(billingAccount: string, serviceName: string): Promise<{
    id: number;
    callId: number;
    callerIdName: string;
    callerIdNumber: string;
    filename: string;
    creationDatetime: string;
  }[]> {
    try {
      const ids = await ovhApi.get<number[]>(`/telephony/${billingAccount}/easyHunting/${serviceName}/records`);
      const records = await Promise.all(
        ids.slice(0, 50).map(async (id) => {
          try {
            return await ovhApi.get(`/telephony/${billingAccount}/easyHunting/${serviceName}/records/${id}`);
          } catch {
            return null;
          }
        })
      );
      return records.filter((r): r is NonNullable<typeof r> => r !== null);
    } catch {
      return [];
    }
  },

  // GET /telephony/{ba}/easyHunting/{sn}/sound - Liste des sons
  async getEasyHuntingSounds(billingAccount: string, serviceName: string): Promise<{
    soundId: number;
    name: string;
    creationDatetime: string;
  }[]> {
    try {
      const ids = await ovhApi.get<number[]>(`/telephony/${billingAccount}/easyHunting/${serviceName}/sound`);
      const sounds = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get(`/telephony/${billingAccount}/easyHunting/${serviceName}/sound/${id}`);
          } catch {
            return null;
          }
        })
      );
      return sounds.filter((s): s is NonNullable<typeof s> => s !== null);
    } catch {
      return [];
    }
  },

  // GET /telephony/{ba}/easyHunting/{sn}/screenListConditions - Conditions de filtrage
  async getScreenListConditions(billingAccount: string, serviceName: string): Promise<{
    conditionId: number;
    callerIdNumber: string;
    destinationNumber: string;
    screenListType: string;
  }[]> {
    try {
      const ids = await ovhApi.get<number[]>(
        `/telephony/${billingAccount}/easyHunting/${serviceName}/screenListConditions/conditions`
      );
      const conditions = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get(
              `/telephony/${billingAccount}/easyHunting/${serviceName}/screenListConditions/conditions/${id}`
            );
          } catch {
            return null;
          }
        })
      );
      return conditions.filter((c): c is NonNullable<typeof c> => c !== null);
    } catch {
      return [];
    }
  },

  // GET /telephony/{ba}/easyHunting/{sn}/timeConditions - Conditions horaires
  async getEasyHuntingTimeConditions(billingAccount: string, serviceName: string): Promise<{
    conditionId: number;
    policy: string;
    timeFrom: string;
    timeTo: string;
    weekDay: string;
  }[]> {
    try {
      const ids = await ovhApi.get<number[]>(
        `/telephony/${billingAccount}/easyHunting/${serviceName}/timeConditions/conditions`
      );
      const conditions = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get(
              `/telephony/${billingAccount}/easyHunting/${serviceName}/timeConditions/conditions/${id}`
            );
          } catch {
            return null;
          }
        })
      );
      return conditions.filter((c): c is NonNullable<typeof c> => c !== null);
    } catch {
      return [];
    }
  },

  // ========== APIs MANQUANTES AJOUTÉES ==========

  // ---------- CONFERENCE PARTICIPANTS ----------

  // GET /telephony/{ba}/conference/{sn}/participants - Liste des participants
  async getConferenceParticipants(billingAccount: string, serviceName: string): Promise<{
    id: number;
    callerIdName: string;
    callerIdNumber: string;
    arrivalDateTime: string;
    floor: boolean;
    muted: boolean;
    deaf: boolean;
    energy: number;
  }[]> {
    try {
      const ids = await ovhApi.get<number[]>(
        `/telephony/${billingAccount}/conference/${serviceName}/participants`
      );
      const participants = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get(
              `/telephony/${billingAccount}/conference/${serviceName}/participants/${id}`
            );
          } catch {
            return null;
          }
        })
      );
      return participants.filter((p): p is NonNullable<typeof p> => p !== null);
    } catch {
      return [];
    }
  },

  // POST /telephony/{ba}/conference/{sn}/participants/{id}/kick - Exclure un participant
  async kickConferenceParticipant(billingAccount: string, serviceName: string, participantId: number): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/conference/${serviceName}/participants/${participantId}/kick`, {});
  },

  // POST /telephony/{ba}/conference/{sn}/participants/{id}/mute - Couper le micro
  async muteConferenceParticipant(billingAccount: string, serviceName: string, participantId: number): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/conference/${serviceName}/participants/${participantId}/mute`, {});
  },

  // POST /telephony/{ba}/conference/{sn}/participants/{id}/unmute - Rétablir le micro
  async unmuteConferenceParticipant(billingAccount: string, serviceName: string, participantId: number): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/conference/${serviceName}/participants/${participantId}/unmute`, {});
  },

  // POST /telephony/{ba}/conference/{sn}/participants/{id}/deaf - Rendre sourd
  async deafConferenceParticipant(billingAccount: string, serviceName: string, participantId: number): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/conference/${serviceName}/participants/${participantId}/deaf`, {});
  },

  // POST /telephony/{ba}/conference/{sn}/participants/{id}/undeaf - Rétablir l'audio
  async undeafConferenceParticipant(billingAccount: string, serviceName: string, participantId: number): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/conference/${serviceName}/participants/${participantId}/undeaf`, {});
  },

  // ---------- CONFERENCE WEBACCESS ----------

  // GET /telephony/{ba}/conference/{sn}/webAccess - Liste des accès web
  async getConferenceWebAccess(billingAccount: string, serviceName: string): Promise<{
    id: number;
    type: 'read' | 'write';
    url: string;
  }[]> {
    try {
      const ids = await ovhApi.get<number[]>(
        `/telephony/${billingAccount}/conference/${serviceName}/webAccess`
      );
      const accesses = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get(
              `/telephony/${billingAccount}/conference/${serviceName}/webAccess/${id}`
            );
          } catch {
            return null;
          }
        })
      );
      return accesses.filter((a): a is NonNullable<typeof a> => a !== null);
    } catch {
      return [];
    }
  },

  // POST /telephony/{ba}/conference/{sn}/webAccess - Créer un accès web
  async createConferenceWebAccess(billingAccount: string, serviceName: string, type: 'read' | 'write'): Promise<{
    id: number;
    url: string;
  }> {
    return ovhApi.post(`/telephony/${billingAccount}/conference/${serviceName}/webAccess`, { type });
  },

  // DELETE /telephony/{ba}/conference/{sn}/webAccess/{id} - Supprimer un accès web
  async deleteConferenceWebAccess(billingAccount: string, serviceName: string, accessId: number): Promise<void> {
    return ovhApi.delete(`/telephony/${billingAccount}/conference/${serviceName}/webAccess/${accessId}`);
  },

  // ---------- REDIRECT ----------

  // GET /telephony/{ba}/redirect/{sn} - Récupérer la redirection
  async getRedirect(billingAccount: string, serviceName: string): Promise<{
    serviceName: string;
    featureType: string;
    destination: string;
  } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/redirect/${serviceName}`);
    } catch {
      return null;
    }
  },

  // PUT /telephony/{ba}/redirect/{sn} - Modifier la redirection
  async updateRedirect(billingAccount: string, serviceName: string, destination: string): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/redirect/${serviceName}`, { destination });
  },

  // ---------- OVH PABX ----------

  // GET /telephony/{ba}/ovhPabx/{sn} - Récupérer le PABX
  async getOvhPabx(billingAccount: string, serviceName: string): Promise<{
    serviceName: string;
    featureType: string;
    description: string;
    isCCS: boolean;
  } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/ovhPabx/${serviceName}`);
    } catch {
      return null;
    }
  },

  // PUT /telephony/{ba}/ovhPabx/{sn} - Modifier le PABX
  async updateOvhPabx(billingAccount: string, serviceName: string, data: {
    description?: string;
  }): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/ovhPabx/${serviceName}`, data);
  },

  // GET /telephony/{ba}/ovhPabx/{sn}/hunting - Récupérer le hunting PABX
  async getOvhPabxHunting(billingAccount: string, serviceName: string): Promise<{
    crmUrlTemplate: string;
    g729: boolean;
    name: string;
    statusIvrEnabled: boolean;
  } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/ovhPabx/${serviceName}/hunting`);
    } catch {
      return null;
    }
  },

  // PUT /telephony/{ba}/ovhPabx/{sn}/hunting - Modifier le hunting PABX
  async updateOvhPabxHunting(billingAccount: string, serviceName: string, data: {
    crmUrlTemplate?: string;
    g729?: boolean;
    name?: string;
    statusIvrEnabled?: boolean;
  }): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/ovhPabx/${serviceName}/hunting`, data);
  },

  // GET /telephony/{ba}/ovhPabx/{sn}/dialplan - Liste des dialplans
  async getOvhPabxDialplans(billingAccount: string, serviceName: string): Promise<{
    dialplanId: number;
    name: string;
    showCallerNumber: string;
    transferTimeout: number;
  }[]> {
    try {
      const ids = await ovhApi.get<number[]>(
        `/telephony/${billingAccount}/ovhPabx/${serviceName}/dialplan`
      );
      const dialplans = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get(
              `/telephony/${billingAccount}/ovhPabx/${serviceName}/dialplan/${id}`
            );
          } catch {
            return null;
          }
        })
      );
      return dialplans.filter((d): d is NonNullable<typeof d> => d !== null);
    } catch {
      return [];
    }
  },

  // GET /telephony/{ba}/ovhPabx/{sn}/menu - Liste des menus IVR
  async getOvhPabxMenus(billingAccount: string, serviceName: string): Promise<{
    menuId: number;
    name: string;
    greetSound: number;
    greetSoundTts: number;
    invalidSound: number;
    invalidSoundTts: number;
  }[]> {
    try {
      const ids = await ovhApi.get<number[]>(
        `/telephony/${billingAccount}/ovhPabx/${serviceName}/menu`
      );
      const menus = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get(
              `/telephony/${billingAccount}/ovhPabx/${serviceName}/menu/${id}`
            );
          } catch {
            return null;
          }
        })
      );
      return menus.filter((m): m is NonNullable<typeof m> => m !== null);
    } catch {
      return [];
    }
  },

  // GET /telephony/{ba}/ovhPabx/{sn}/tts - Liste des TTS
  async getOvhPabxTts(billingAccount: string, serviceName: string): Promise<{
    id: number;
    text: string;
    voice: string;
  }[]> {
    try {
      const ids = await ovhApi.get<number[]>(
        `/telephony/${billingAccount}/ovhPabx/${serviceName}/tts`
      );
      const tts = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get(
              `/telephony/${billingAccount}/ovhPabx/${serviceName}/tts/${id}`
            );
          } catch {
            return null;
          }
        })
      );
      return tts.filter((t): t is NonNullable<typeof t> => t !== null);
    } catch {
      return [];
    }
  },

  // POST /telephony/{ba}/ovhPabx/{sn}/tts - Créer un TTS
  async createOvhPabxTts(billingAccount: string, serviceName: string, data: {
    text: string;
    voice: string;
  }): Promise<{ id: number }> {
    return ovhApi.post(`/telephony/${billingAccount}/ovhPabx/${serviceName}/tts`, data);
  },

  // ---------- MINI PABX ----------

  // GET /telephony/{ba}/miniPabx/{sn} - Récupérer le mini PABX
  async getMiniPabx(billingAccount: string, serviceName: string): Promise<{
    serviceName: string;
    featureType: string;
    description: string;
  } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/miniPabx/${serviceName}`);
    } catch {
      return null;
    }
  },

  // GET /telephony/{ba}/miniPabx/{sn}/hunting - Récupérer le hunting mini PABX
  async getMiniPabxHunting(billingAccount: string, serviceName: string): Promise<{
    anonymousCallRejection: boolean;
    name: string;
    numberOfCalls: number;
    onHoldMusic: string;
    pattern: string;
    strategy: string;
    toneOnClosure: boolean;
    toneOnClosureSoundId: number;
    toneOnHold: boolean;
    toneOnHoldSoundId: number;
    toneRingback: boolean;
    toneRingbackSoundId: number;
    voicemail: string;
  } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/miniPabx/${serviceName}/hunting`);
    } catch {
      return null;
    }
  },

  // PUT /telephony/{ba}/miniPabx/{sn}/hunting - Modifier le hunting mini PABX
  async updateMiniPabxHunting(billingAccount: string, serviceName: string, data: {
    anonymousCallRejection?: boolean;
    name?: string;
    numberOfCalls?: number;
    pattern?: string;
    strategy?: string;
    voicemail?: string;
  }): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/miniPabx/${serviceName}/hunting`, data);
  },

  // ---------- EASY PABX ----------

  // GET /telephony/{ba}/easyPabx/{sn} - Récupérer le easy PABX
  async getEasyPabx(billingAccount: string, serviceName: string): Promise<{
    serviceName: string;
    featureType: string;
    description: string;
  } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/easyPabx/${serviceName}`);
    } catch {
      return null;
    }
  },

  // GET /telephony/{ba}/easyPabx/{sn}/hunting - Récupérer le hunting easy PABX
  async getEasyPabxHunting(billingAccount: string, serviceName: string): Promise<{
    anonymousCallRejection: boolean;
    name: string;
    numberOfCalls: number;
    onHoldMusic: string;
    pattern: string;
    strategy: string;
    toneOnClosure: boolean;
    toneOnClosureSoundId: number;
    toneOnHold: boolean;
    toneOnHoldSoundId: number;
    toneRingback: boolean;
    toneRingbackSoundId: number;
    voicemail: string;
  } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/easyPabx/${serviceName}/hunting`);
    } catch {
      return null;
    }
  },
};
