// ============================================================
// LINES SERVICE - Appels API pour la gestion des lignes VoIP
// ============================================================

import { ovhApi } from '../../../../../services/api';
import type {
  TelephonyLine,
  TelephonyPhone,
  TelephonyLineOptions,
  TelephonyTimeConditionOptions,
  TelephonyTimeCondition,
  TelephonyTimeConditionCreate,
  TelephonyScreen,
  TelephonyScreenList,
  TelephonyScreenListCreate,
  TelephonyTrunk,
} from '../voip.types';
import type {
  LineServiceInfos,
  LineOptions,
  LineCall,
  LineConsumption,
  Click2CallUser,
  PhoneConfiguration,
} from './lines.types';

export const linesService = {
  // ---------- GENERAL ----------

  async getLine(billingAccount: string, serviceName: string): Promise<TelephonyLine> {
    return ovhApi.get<TelephonyLine>(`/telephony/${billingAccount}/line/${serviceName}`);
  },

  async updateLine(
    billingAccount: string,
    serviceName: string,
    data: Partial<TelephonyLine>
  ): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/line/${serviceName}`, data);
  },

  async getServiceInfos(billingAccount: string, serviceName: string): Promise<LineServiceInfos> {
    return ovhApi.get<LineServiceInfos>(
      `/telephony/${billingAccount}/line/${serviceName}/serviceInfos`
    );
  },

  // ---------- PHONE ----------

  async getPhone(billingAccount: string, serviceName: string): Promise<TelephonyPhone | null> {
    try {
      return await ovhApi.get<TelephonyPhone>(
        `/telephony/${billingAccount}/line/${serviceName}/phone`
      );
    } catch {
      return null;
    }
  },

  async getPhoneConfiguration(
    billingAccount: string,
    serviceName: string
  ): Promise<PhoneConfiguration | null> {
    try {
      const phone = await this.getPhone(billingAccount, serviceName);
      if (!phone) return null;
      return {
        macAddress: phone.macAddress,
        protocol: phone.protocol,
        ipAddress: phone.ip,
        firmwareVersion: phone.softwareVersion,
      };
    } catch {
      return null;
    }
  },

  async rebootPhone(billingAccount: string, serviceName: string): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/phone/reboot`);
  },

  async resetPhoneConfig(billingAccount: string, serviceName: string): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/phone/resetConfig`);
  },

  // ---------- OPTIONS ----------

  async getOptions(billingAccount: string, serviceName: string): Promise<TelephonyLineOptions> {
    return ovhApi.get<TelephonyLineOptions>(
      `/telephony/${billingAccount}/line/${serviceName}/options`
    );
  },

  async updateOptions(
    billingAccount: string,
    serviceName: string,
    options: Partial<TelephonyLineOptions>
  ): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/line/${serviceName}/options`, options);
  },

  // ---------- CALLS ----------

  async getCalls(billingAccount: string, serviceName: string): Promise<LineCall[]> {
    const ids = await ovhApi
      .get<string[]>(`/telephony/${billingAccount}/line/${serviceName}/calls`)
      .catch(() => []);
    const calls = await Promise.all(
      ids.slice(0, 50).map(async (id) => {
        try {
          return await ovhApi.get<LineCall>(
            `/telephony/${billingAccount}/line/${serviceName}/calls/${id}`
          );
        } catch {
          return null;
        }
      })
    );
    return calls.filter((c): c is LineCall => c !== null);
  },

  // ---------- CONSUMPTION ----------
  // API correcte: GET /telephony/{ba}/service/{sn}/voiceConsumption

  async getConsumption(billingAccount: string, serviceName: string): Promise<LineConsumption[]> {
    try {
      const ids = await ovhApi.get<number[]>(
        `/telephony/${billingAccount}/service/${serviceName}/voiceConsumption`
      );
      const consumptions = await Promise.all(
        ids.slice(0, 50).map(async (id) => {
          try {
            return await ovhApi.get<LineConsumption>(
              `/telephony/${billingAccount}/service/${serviceName}/voiceConsumption/${id}`
            );
          } catch {
            return null;
          }
        })
      );
      return consumptions.filter((c): c is LineConsumption => c !== null);
    } catch {
      return [];
    }
  },

  // ---------- CLICK2CALL ----------

  async getClick2CallUsers(billingAccount: string, serviceName: string): Promise<Click2CallUser[]> {
    const ids = await ovhApi
      .get<number[]>(`/telephony/${billingAccount}/line/${serviceName}/click2CallUser`)
      .catch(() => []);
    const users = await Promise.all(
      ids.map(async (id) => {
        try {
          return await ovhApi.get<Click2CallUser>(
            `/telephony/${billingAccount}/line/${serviceName}/click2CallUser/${id}`
          );
        } catch {
          return null;
        }
      })
    );
    return users.filter((u): u is Click2CallUser => u !== null);
  },

  async createClick2CallUser(
    billingAccount: string,
    serviceName: string,
    data: { login: string; password: string }
  ): Promise<Click2CallUser> {
    return ovhApi.post<Click2CallUser>(
      `/telephony/${billingAccount}/line/${serviceName}/click2CallUser`,
      data
    );
  },

  async deleteClick2CallUser(
    billingAccount: string,
    serviceName: string,
    userId: number
  ): Promise<void> {
    return ovhApi.delete(
      `/telephony/${billingAccount}/line/${serviceName}/click2CallUser/${userId}`
    );
  },

  async click2Call(
    billingAccount: string,
    serviceName: string,
    calledNumber: string
  ): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/click2Call`, {
      calledNumber,
    });
  },

  // ---------- VOICEMAIL ----------
  // Note: L'API voicemail utilise /telephony/{ba}/voicemail/{sn}/ et non /telephony/{ba}/line/{sn}/voicemail

  async getVoicemailConfig(
    billingAccount: string,
    serviceName: string
  ): Promise<{
    active: boolean;
    audioFormat: string;
    doNotRecord: boolean;
    forcePassword: boolean;
    fromEmail: string;
    keepMessage: boolean;
    redirectionEmails: string[];
  }> {
    try {
      // API correcte: GET /telephony/{ba}/voicemail/{sn}/settings
      return await ovhApi.get(`/telephony/${billingAccount}/voicemail/${serviceName}/settings`);
    } catch {
      return {
        active: false,
        audioFormat: 'wav',
        doNotRecord: false,
        forcePassword: false,
        fromEmail: '',
        keepMessage: true,
        redirectionEmails: [],
      };
    }
  },

  async updateVoicemailConfig(
    billingAccount: string,
    serviceName: string,
    config: Partial<{
      active: boolean;
      audioFormat: string;
      doNotRecord: boolean;
      forcePassword: boolean;
      keepMessage: boolean;
      redirectionEmails: string[];
    }>
  ): Promise<void> {
    // API correcte: PUT /telephony/{ba}/voicemail/{sn}/settings
    return ovhApi.put(`/telephony/${billingAccount}/voicemail/${serviceName}/settings`, config);
  },

  async changeVoicemailPassword(
    billingAccount: string,
    serviceName: string,
    password: string
  ): Promise<void> {
    // API correcte: POST /telephony/{ba}/voicemail/{sn}/settings/changePassword
    return ovhApi.post(`/telephony/${billingAccount}/voicemail/${serviceName}/settings/changePassword`, {
      password,
    });
  },

  async getVoicemailMessages(
    billingAccount: string,
    serviceName: string
  ): Promise<
    Array<{
      id: string;
      caller: string;
      datetime: string;
      duration: number;
      status: 'new' | 'read';
    }>
  > {
    try {
      const voicemailNumber = serviceName;
      const ids = await ovhApi.get<string[]>(
        `/telephony/${billingAccount}/voicemail/${voicemailNumber}/directories`
      );
      const messages = await Promise.all(
        ids.slice(0, 20).map(async (id) => {
          try {
            const msg = await ovhApi.get<{
              id: string;
              callerIdName: string;
              callerIdNumber: string;
              datetime: string;
              duration: number;
              dir: string;
            }>(`/telephony/${billingAccount}/voicemail/${voicemailNumber}/directories/${id}`);
            return {
              id: msg.id,
              caller: msg.callerIdNumber || msg.callerIdName || 'Inconnu',
              datetime: msg.datetime,
              duration: msg.duration,
              status: (msg.dir === 'inbox' ? 'new' : 'read') as 'new' | 'read',
            };
          } catch {
            return null;
          }
        })
      );
      return messages.filter((m): m is NonNullable<typeof m> => m !== null);
    } catch {
      return [];
    }
  },

  async getVoicemailMessageAudio(
    billingAccount: string,
    serviceName: string,
    messageId: string
  ): Promise<string> {
    const voicemailNumber = serviceName;
    const result = await ovhApi.get<{ url: string }>(
      `/telephony/${billingAccount}/voicemail/${voicemailNumber}/directories/${messageId}/download`
    );
    return result.url;
  },

  async deleteVoicemailMessage(
    billingAccount: string,
    serviceName: string,
    messageId: string
  ): Promise<void> {
    const voicemailNumber = serviceName;
    return ovhApi.delete(
      `/telephony/${billingAccount}/voicemail/${voicemailNumber}/directories/${messageId}`
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

  // ---------- SCREEN (filtrage appels) ----------

  async getScreen(
    billingAccount: string,
    serviceName: string
  ): Promise<TelephonyScreen | null> {
    try {
      return await ovhApi.get<TelephonyScreen>(
        `/telephony/${billingAccount}/screen/${serviceName}`
      );
    } catch {
      return null;
    }
  },

  async updateScreen(
    billingAccount: string,
    serviceName: string,
    data: Partial<TelephonyScreen>
  ): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/screen/${serviceName}`, data);
  },

  async getScreenLists(
    billingAccount: string,
    serviceName: string
  ): Promise<TelephonyScreenList[]> {
    try {
      const ids = await ovhApi.get<number[]>(
        `/telephony/${billingAccount}/screen/${serviceName}/screenLists`
      );
      const lists = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get<TelephonyScreenList>(
              `/telephony/${billingAccount}/screen/${serviceName}/screenLists/${id}`
            );
          } catch {
            return null;
          }
        })
      );
      return lists.filter((l): l is TelephonyScreenList => l !== null);
    } catch {
      return [];
    }
  },

  async createScreenList(
    billingAccount: string,
    serviceName: string,
    data: TelephonyScreenListCreate
  ): Promise<TelephonyScreenList> {
    return ovhApi.post<TelephonyScreenList>(
      `/telephony/${billingAccount}/screen/${serviceName}/screenLists`,
      data
    );
  },

  async deleteScreenList(
    billingAccount: string,
    serviceName: string,
    id: number
  ): Promise<void> {
    return ovhApi.delete(
      `/telephony/${billingAccount}/screen/${serviceName}/screenLists/${id}`
    );
  },

  // ---------- TRUNK ----------

  async getTrunk(
    billingAccount: string,
    serviceName: string
  ): Promise<TelephonyTrunk | null> {
    try {
      return await ovhApi.get<TelephonyTrunk>(
        `/telephony/${billingAccount}/trunk/${serviceName}`
      );
    } catch {
      return null;
    }
  },

  async getTrunkExternalNumbers(
    billingAccount: string,
    serviceName: string
  ): Promise<string[]> {
    try {
      return await ovhApi.get<string[]>(
        `/telephony/${billingAccount}/trunk/${serviceName}/externalDisplayedNumber`
      );
    } catch {
      return [];
    }
  },

  async addTrunkExternalNumber(
    billingAccount: string,
    serviceName: string,
    number: string
  ): Promise<void> {
    return ovhApi.post(
      `/telephony/${billingAccount}/trunk/${serviceName}/externalDisplayedNumber`,
      { number }
    );
  },

  async deleteTrunkExternalNumber(
    billingAccount: string,
    serviceName: string,
    number: string
  ): Promise<void> {
    return ovhApi.delete(
      `/telephony/${billingAccount}/trunk/${serviceName}/externalDisplayedNumber/${encodeURIComponent(number)}`
    );
  },

  // ---------- OFFER & CAPABILITIES (APIs manquantes ajoutées) ----------

  // GET /telephony/{ba}/line/{sn}/offer - Récupérer l'offre de la ligne
  async getOffer(billingAccount: string, serviceName: string): Promise<{
    name: string;
    description: string;
    price: { value: number; currencyCode: string };
  } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/line/${serviceName}/offer`);
    } catch {
      return null;
    }
  },

  // GET /telephony/{ba}/line/{sn}/canChangePassword - Vérifier si on peut changer le mdp
  async canChangePassword(billingAccount: string, serviceName: string): Promise<boolean> {
    try {
      return await ovhApi.get<boolean>(`/telephony/${billingAccount}/line/${serviceName}/canChangePassword`);
    } catch {
      return false;
    }
  },

  // GET /telephony/{ba}/line/{sn}/lastRegistrations - Dernières connexions SIP
  async getLastRegistrations(billingAccount: string, serviceName: string): Promise<{
    datetime: string;
    ip: string;
    localIp: string;
    userAgent: string;
  }[]> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/line/${serviceName}/lastRegistrations`);
    } catch {
      return [];
    }
  },

  // GET /telephony/{ba}/line/{sn}/ips - IPs autorisées
  async getIps(billingAccount: string, serviceName: string): Promise<string[]> {
    try {
      return await ovhApi.get<string[]>(`/telephony/${billingAccount}/line/${serviceName}/ips`);
    } catch {
      return [];
    }
  },

  // GET /telephony/{ba}/line/{sn}/availableSipDomains - Domaines SIP disponibles
  async getAvailableSipDomains(billingAccount: string, serviceName: string): Promise<string[]> {
    try {
      return await ovhApi.get<string[]>(`/telephony/${billingAccount}/line/${serviceName}/availableSipDomains`);
    } catch {
      return [];
    }
  },

  // ---------- TONES (sonneries personnalisées) ----------

  // GET /telephony/{ba}/line/{sn}/tones - Récupérer les sonneries
  async getTones(billingAccount: string, serviceName: string): Promise<{
    callWaiting: string;
    endCall: string;
    onHold: string;
    ringback: string;
  } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/line/${serviceName}/tones`);
    } catch {
      return null;
    }
  },

  // PUT /telephony/{ba}/line/{sn}/tones - Modifier les sonneries
  async updateTones(billingAccount: string, serviceName: string, data: {
    callWaiting?: string;
    endCall?: string;
    onHold?: string;
    ringback?: string;
  }): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/line/${serviceName}/tones`, data);
  },

  // POST /telephony/{ba}/line/{sn}/tones/toneUpload - Upload d'une sonnerie
  async uploadTone(billingAccount: string, serviceName: string, data: {
    type: 'callWaiting' | 'endCall' | 'onHold' | 'ringback';
    url: string;
  }): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/tones/toneUpload`, data);
  },

  // ---------- OPTIONS AVANCÉES ----------

  // GET /telephony/{ba}/line/{sn}/options/availableCodecs - Codecs disponibles
  async getAvailableCodecs(billingAccount: string, serviceName: string): Promise<string[]> {
    try {
      return await ovhApi.get<string[]>(`/telephony/${billingAccount}/line/${serviceName}/options/availableCodecs`);
    } catch {
      return [];
    }
  },

  // GET /telephony/{ba}/line/{sn}/options/defaultCodecs - Codecs par défaut
  async getDefaultCodecs(billingAccount: string, serviceName: string): Promise<string> {
    try {
      const result = await ovhApi.get<string>(`/telephony/${billingAccount}/line/${serviceName}/options/defaultCodecs`);
      return result;
    } catch {
      return '';
    }
  },

  // ---------- SIMULTANEOUS LINES ----------

  // GET /telephony/{ba}/line/{sn}/simultaneousChannelsDetails - Détails lignes simultanées
  async getSimultaneousChannelsDetails(billingAccount: string, serviceName: string): Promise<{
    current: number;
    basic: number;
    max: number;
  } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/line/${serviceName}/simultaneousChannelsDetails`);
    } catch {
      return null;
    }
  },

  // GET /telephony/{ba}/line/{sn}/maximumAvailableSimultaneousLines - Max lignes dispo
  async getMaxSimultaneousLines(billingAccount: string, serviceName: string): Promise<number> {
    try {
      return await ovhApi.get<number>(`/telephony/${billingAccount}/line/${serviceName}/maximumAvailableSimultaneousLines`);
    } catch {
      return 0;
    }
  },

  // ---------- CONVERSION & TERMINATION ----------

  // POST /telephony/{ba}/line/{sn}/convertToNumber - Convertir ligne en numéro
  async convertToNumber(billingAccount: string, serviceName: string): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/convertToNumber`, {});
  },

  // POST /telephony/{ba}/line/{sn}/cancelConvertToNumber - Annuler conversion
  async cancelConvertToNumber(billingAccount: string, serviceName: string): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/cancelConvertToNumber`, {});
  },

  // DELETE /telephony/{ba}/service/{sn} - Résilier le service
  async terminateService(billingAccount: string, serviceName: string): Promise<void> {
    return ovhApi.delete(`/telephony/${billingAccount}/service/${serviceName}`);
  },

  // POST /telephony/{ba}/service/{sn}/cancelTermination - Annuler résiliation
  async cancelTermination(billingAccount: string, serviceName: string): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/service/${serviceName}/cancelTermination`, {});
  },

  // ---------- PHONE ADVANCED ----------

  // GET /telephony/{ba}/line/{sn}/phone/supportsPhonebook - Supporte annuaire?
  async phoneSupportsPhonebook(billingAccount: string, serviceName: string): Promise<boolean> {
    try {
      const result = await ovhApi.get<{ data: boolean }>(`/telephony/${billingAccount}/line/${serviceName}/phone/supportsPhonebook`);
      return result.data;
    } catch {
      return false;
    }
  },

  // GET /telephony/{ba}/line/{sn}/phone/merchandiseAvailable - Téléphones disponibles à l'achat
  async getPhoneMerchandiseAvailable(billingAccount: string, serviceName: string): Promise<{
    name: string;
    price: { value: number; currencyCode: string };
  }[]> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/line/${serviceName}/phone/merchandiseAvailable`);
    } catch {
      return [];
    }
  },

  // POST /telephony/{ba}/line/{sn}/phone/changePhoneConfiguration - Changer config téléphone
  async changePhoneConfiguration(billingAccount: string, serviceName: string, data: {
    auto: boolean;
  }): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/phone/changePhoneConfiguration`, data);
  },

  // ---------- VOICEMAIL ADVANCED ----------

  // GET /telephony/{ba}/voicemail/{sn}/settings/voicemailNumbers - Numéros de messagerie
  async getVoicemailNumbers(billingAccount: string, serviceName: string): Promise<{
    internal: string;
    external: string;
  } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/voicemail/${serviceName}/settings/voicemailNumbers`);
    } catch {
      return null;
    }
  },

  // GET /telephony/{ba}/voicemail/{sn}/settings/routing - Routage messagerie
  async getVoicemailRouting(billingAccount: string, serviceName: string): Promise<{ data: string } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/voicemail/${serviceName}/settings/routing`);
    } catch {
      return null;
    }
  },

  // POST /telephony/{ba}/voicemail/{sn}/settings/changeRouting - Changer routage
  async changeVoicemailRouting(billingAccount: string, serviceName: string, routing: string): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/voicemail/${serviceName}/settings/changeRouting`, { routing });
  },

  // POST /telephony/{ba}/voicemail/{sn}/directories/{id}/move - Déplacer message
  async moveVoicemailMessage(billingAccount: string, serviceName: string, messageId: string, dir: string): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/voicemail/${serviceName}/directories/${messageId}/move`, { dir });
  },

  // ========== APIs MANQUANTES AJOUTÉES ==========

  // POST /telephony/{ba}/line/{sn}/changePassword - Changer le mot de passe SIP
  async changePassword(billingAccount: string, serviceName: string, password: string): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/changePassword`, { password });
  },

  // POST /telephony/{ba}/line/{sn}/activateTraffic - Activer le trafic
  async activateTraffic(billingAccount: string, serviceName: string): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/activateTraffic`, {});
  },

  // POST /telephony/{ba}/line/{sn}/deactivateTraffic - Désactiver le trafic
  async deactivateTraffic(billingAccount: string, serviceName: string): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/deactivateTraffic`, {});
  },

  // POST /telephony/{ba}/line/{sn}/associateDevice - Associer un équipement
  async associateDevice(billingAccount: string, serviceName: string, ipAddress: string, macAddress: string): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/associateDevice`, { ipAddress, macAddress });
  },

  // POST /telephony/{ba}/line/{sn}/dissociateDevice - Dissocier un équipement
  async dissociateDevice(billingAccount: string, serviceName: string, ipAddress: string, macAddress: string): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/dissociateDevice`, { ipAddress, macAddress });
  },

  // ---------- ABBREVIATED NUMBERS (Numéros abrégés) ----------

  // GET /telephony/{ba}/line/{sn}/abbreviatedNumber - Liste des numéros abrégés
  async getLineAbbreviatedNumbers(billingAccount: string, serviceName: string): Promise<{
    abbreviatedNumber: number;
    destinationNumber: string;
    name: string;
    surname: string;
  }[]> {
    try {
      const ids = await ovhApi.get<number[]>(`/telephony/${billingAccount}/line/${serviceName}/abbreviatedNumber`);
      const numbers = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get(`/telephony/${billingAccount}/line/${serviceName}/abbreviatedNumber/${id}`);
          } catch {
            return null;
          }
        })
      );
      return numbers.filter((n): n is NonNullable<typeof n> => n !== null);
    } catch {
      return [];
    }
  },

  // POST /telephony/{ba}/line/{sn}/abbreviatedNumber - Créer numéro abrégé
  async createLineAbbreviatedNumber(billingAccount: string, serviceName: string, data: {
    abbreviatedNumber: number;
    destinationNumber: string;
    name: string;
    surname: string;
  }): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/abbreviatedNumber`, data);
  },

  // PUT /telephony/{ba}/line/{sn}/abbreviatedNumber/{id} - Modifier numéro abrégé
  async updateLineAbbreviatedNumber(billingAccount: string, serviceName: string, id: number, data: {
    destinationNumber?: string;
    name?: string;
    surname?: string;
  }): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/line/${serviceName}/abbreviatedNumber/${id}`, data);
  },

  // DELETE /telephony/{ba}/line/{sn}/abbreviatedNumber/{id} - Supprimer numéro abrégé
  async deleteLineAbbreviatedNumber(billingAccount: string, serviceName: string, id: number): Promise<void> {
    return ovhApi.delete(`/telephony/${billingAccount}/line/${serviceName}/abbreviatedNumber/${id}`);
  },

  // ---------- PHONE PHONEBOOK (Annuaire téléphone) ----------

  // GET /telephony/{ba}/line/{sn}/phone/phonebook - Liste des annuaires
  async getPhonePhonebooks(billingAccount: string, serviceName: string): Promise<string[]> {
    try {
      return await ovhApi.get<string[]>(`/telephony/${billingAccount}/line/${serviceName}/phone/phonebook`);
    } catch {
      return [];
    }
  },

  // GET /telephony/{ba}/line/{sn}/phone/phonebook/{bookKey} - Détail annuaire
  async getPhonePhonebook(billingAccount: string, serviceName: string, bookKey: string): Promise<{
    bookKey: string;
    name: string;
    isReadonly: boolean;
  } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/line/${serviceName}/phone/phonebook/${bookKey}`);
    } catch {
      return null;
    }
  },

  // POST /telephony/{ba}/line/{sn}/phone/phonebook - Créer un annuaire
  async createPhonePhonebook(billingAccount: string, serviceName: string, name: string): Promise<{ bookKey: string }> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/phone/phonebook`, { name });
  },

  // DELETE /telephony/{ba}/line/{sn}/phone/phonebook/{bookKey} - Supprimer un annuaire
  async deletePhonePhonebook(billingAccount: string, serviceName: string, bookKey: string): Promise<void> {
    return ovhApi.delete(`/telephony/${billingAccount}/line/${serviceName}/phone/phonebook/${bookKey}`);
  },

  // ---------- PHONE FUNCTION KEYS (Touches programmables) ----------

  // GET /telephony/{ba}/line/{sn}/phone/functionKey - Liste des touches
  async getPhoneFunctionKeys(billingAccount: string, serviceName: string): Promise<{
    keyNum: number;
    function: string;
    label: string;
    parameter: string;
    type: string;
  }[]> {
    try {
      const ids = await ovhApi.get<number[]>(`/telephony/${billingAccount}/line/${serviceName}/phone/functionKey`);
      const keys = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get(`/telephony/${billingAccount}/line/${serviceName}/phone/functionKey/${id}`);
          } catch {
            return null;
          }
        })
      );
      return keys.filter((k): k is NonNullable<typeof k> => k !== null);
    } catch {
      return [];
    }
  },

  // PUT /telephony/{ba}/line/{sn}/phone/functionKey/{keyNum} - Modifier une touche
  async updatePhoneFunctionKey(billingAccount: string, serviceName: string, keyNum: number, data: {
    function?: string;
    label?: string;
    parameter?: string;
  }): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/line/${serviceName}/phone/functionKey/${keyNum}`, data);
  },

  // GET /telephony/{ba}/line/{sn}/phone/functionKey/{keyNum}/availableFunction - Fonctions disponibles
  async getAvailableFunctions(billingAccount: string, serviceName: string, keyNum: number): Promise<string[]> {
    try {
      return await ovhApi.get<string[]>(
        `/telephony/${billingAccount}/line/${serviceName}/phone/functionKey/${keyNum}/availableFunction`
      );
    } catch {
      return [];
    }
  },

  // ---------- AUTOMATIC CALL (Appels automatiques) ----------

  // POST /telephony/{ba}/line/{sn}/automaticCall - Lancer un appel automatique
  async makeAutomaticCall(billingAccount: string, serviceName: string, data: {
    bridgeNumberDialplan: string;
    calleeNumber: string;
    dialplan: string;
    isAnonymous: boolean;
    timeout: number;
    playbackAudioFileDialplan: string;
  }): Promise<{ taskId: number }> {
    return ovhApi.post(`/telephony/${billingAccount}/line/${serviceName}/automaticCall`, data);
  },
};
