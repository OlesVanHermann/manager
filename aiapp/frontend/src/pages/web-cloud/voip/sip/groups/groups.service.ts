// ============================================================
// GROUPS SERVICE - Appels API pour la gestion des groupes VoIP
// ============================================================

import { ovhApi } from '../../../../../services/api';
import type {
  TelephonyBillingAccount,
  TelephonyHistoryConsumption,
  TelephonyLine,
  TelephonyNumber,
  TelephonyFax,
  TelephonyAbbreviatedNumber,
  TelephonyPhonebook,
  TelephonyPhonebookContact,
  TelephonyPhonebookContactCreate,
  TelephonyOfferTask,
} from '../voip.types';
import type {
  GroupServiceInfos,
  GroupOrder,
  GroupPortability,
  GroupRepayment,
  GroupEventToken,
} from './groups.types';

export const groupsService = {
  // ---------- GENERAL ----------

  async getGroup(billingAccount: string): Promise<TelephonyBillingAccount> {
    return ovhApi.get<TelephonyBillingAccount>(`/telephony/${billingAccount}`);
  },

  async updateGroup(billingAccount: string, data: { description?: string }): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}`, data);
  },

  async getServiceInfos(billingAccount: string): Promise<GroupServiceInfos> {
    return ovhApi.get<GroupServiceInfos>(`/telephony/${billingAccount}/serviceInfos`);
  },

  // ---------- SERVICES (Lines, Numbers, Fax) ----------

  async getLines(billingAccount: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/telephony/${billingAccount}/line`);
  },

  async getLineDetails(billingAccount: string, serviceName: string): Promise<TelephonyLine> {
    return ovhApi.get<TelephonyLine>(`/telephony/${billingAccount}/line/${serviceName}`);
  },

  async getNumbers(billingAccount: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/telephony/${billingAccount}/number`);
  },

  async getNumberDetails(billingAccount: string, serviceName: string): Promise<TelephonyNumber> {
    return ovhApi.get<TelephonyNumber>(`/telephony/${billingAccount}/number/${serviceName}`);
  },

  async getFaxList(billingAccount: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/telephony/${billingAccount}/fax`);
  },

  async getAbbreviatedNumbers(billingAccount: string): Promise<TelephonyAbbreviatedNumber[]> {
    const ids = await ovhApi.get<number[]>(`/telephony/${billingAccount}/abbreviatedNumber`);
    const details = await Promise.all(
      ids.map((id) =>
        ovhApi.get<TelephonyAbbreviatedNumber>(
          `/telephony/${billingAccount}/abbreviatedNumber/${id}`
        )
      )
    );
    return details;
  },

  // ---------- ORDERS ----------

  async getOrders(billingAccount: string): Promise<GroupOrder[]> {
    // Note: API retourne liste d'IDs, on récupère les détails
    const orderIds = await ovhApi.get<number[]>(`/telephony/${billingAccount}/order`).catch(() => []);
    const orders = await Promise.all(
      orderIds.slice(0, 20).map(async (id) => {
        try {
          return await ovhApi.get<GroupOrder>(`/telephony/${billingAccount}/order/${id}`);
        } catch {
          return null;
        }
      })
    );
    return orders.filter((o): o is GroupOrder => o !== null);
  },

  // ---------- PORTABILITY ----------

  async getPortabilities(billingAccount: string): Promise<GroupPortability[]> {
    const ids = await ovhApi.get<number[]>(`/telephony/${billingAccount}/portability`).catch(() => []);
    const portabilities = await Promise.all(
      ids.map(async (id) => {
        try {
          return await ovhApi.get<GroupPortability>(`/telephony/${billingAccount}/portability/${id}`);
        } catch {
          return null;
        }
      })
    );
    return portabilities.filter((p): p is GroupPortability => p !== null);
  },

  // ---------- BILLING ----------

  async getHistoryConsumption(billingAccount: string): Promise<TelephonyHistoryConsumption[]> {
    return ovhApi
      .get<TelephonyHistoryConsumption[]>(`/telephony/${billingAccount}/historyConsumption`)
      .catch(() => []);
  },

  // ---------- REPAYMENTS ----------

  async getRepayments(billingAccount: string): Promise<GroupRepayment[]> {
    return ovhApi
      .get<GroupRepayment[]>(`/telephony/${billingAccount}/historyRepaymentConsumption`)
      .catch(() => []);
  },

  async requestRepayment(billingAccount: string, consumptionId: number): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/repaymentConsumption`, {
      consumptionId,
    });
  },

  // ---------- SECURITY ----------

  async getEventTokens(billingAccount: string): Promise<GroupEventToken[]> {
    const tokens = await ovhApi.get<string[]>(`/telephony/${billingAccount}/eventToken`).catch(() => []);
    const details = await Promise.all(
      tokens.map(async (token) => {
        try {
          return await ovhApi.get<GroupEventToken>(
            `/telephony/${billingAccount}/eventToken/${token}`
          );
        } catch {
          return null;
        }
      })
    );
    return details.filter((t): t is GroupEventToken => t !== null);
  },

  async createEventToken(
    billingAccount: string,
    data: { type: string; callbackUrl: string }
  ): Promise<GroupEventToken> {
    return ovhApi.post<GroupEventToken>(`/telephony/${billingAccount}/eventToken`, data);
  },

  async deleteEventToken(billingAccount: string, token: string): Promise<void> {
    return ovhApi.delete(`/telephony/${billingAccount}/eventToken/${token}`);
  },

  // ---------- PHONEBOOK ----------

  async getPhonebooks(billingAccount: string): Promise<TelephonyPhonebook[]> {
    try {
      const bookKeys = await ovhApi.get<string[]>(`/telephony/${billingAccount}/phonebook`);
      const phonebooks = await Promise.all(
        bookKeys.map(async (bookKey) => {
          try {
            return await ovhApi.get<TelephonyPhonebook>(
              `/telephony/${billingAccount}/phonebook/${bookKey}`
            );
          } catch {
            return null;
          }
        })
      );
      return phonebooks.filter((p): p is TelephonyPhonebook => p !== null);
    } catch {
      return [];
    }
  },

  async getPhonebook(billingAccount: string, bookKey: string): Promise<TelephonyPhonebook | null> {
    try {
      return await ovhApi.get<TelephonyPhonebook>(
        `/telephony/${billingAccount}/phonebook/${bookKey}`
      );
    } catch {
      return null;
    }
  },

  async createPhonebook(
    billingAccount: string,
    data: { name: string }
  ): Promise<{ bookKey: string }> {
    return ovhApi.post<{ bookKey: string }>(`/telephony/${billingAccount}/phonebook`, data);
  },

  async updatePhonebook(
    billingAccount: string,
    bookKey: string,
    data: { name: string }
  ): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/phonebook/${bookKey}`, data);
  },

  async deletePhonebook(billingAccount: string, bookKey: string): Promise<void> {
    return ovhApi.delete(`/telephony/${billingAccount}/phonebook/${bookKey}`);
  },

  async exportPhonebook(
    billingAccount: string,
    bookKey: string,
    format: 'csv' | 'goosip' = 'csv'
  ): Promise<{ url: string }> {
    return ovhApi.get<{ url: string }>(
      `/telephony/${billingAccount}/phonebook/${bookKey}/export?format=${format}`
    );
  },

  async importPhonebook(
    billingAccount: string,
    bookKey: string,
    documentId: string
  ): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/phonebook/${bookKey}/import`, {
      documentId,
    });
  },

  // ---------- PHONEBOOK CONTACTS ----------

  async getPhonebookContacts(
    billingAccount: string,
    bookKey: string
  ): Promise<TelephonyPhonebookContact[]> {
    try {
      const ids = await ovhApi.get<number[]>(
        `/telephony/${billingAccount}/phonebook/${bookKey}/phonebookContact`
      );
      const contacts = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get<TelephonyPhonebookContact>(
              `/telephony/${billingAccount}/phonebook/${bookKey}/phonebookContact/${id}`
            );
          } catch {
            return null;
          }
        })
      );
      return contacts.filter((c): c is TelephonyPhonebookContact => c !== null);
    } catch {
      return [];
    }
  },

  async createPhonebookContact(
    billingAccount: string,
    bookKey: string,
    data: TelephonyPhonebookContactCreate
  ): Promise<TelephonyPhonebookContact> {
    return ovhApi.post<TelephonyPhonebookContact>(
      `/telephony/${billingAccount}/phonebook/${bookKey}/phonebookContact`,
      data
    );
  },

  async updatePhonebookContact(
    billingAccount: string,
    bookKey: string,
    contactId: number,
    data: Partial<TelephonyPhonebookContactCreate>
  ): Promise<void> {
    return ovhApi.put(
      `/telephony/${billingAccount}/phonebook/${bookKey}/phonebookContact/${contactId}`,
      data
    );
  },

  async deletePhonebookContact(
    billingAccount: string,
    bookKey: string,
    contactId: number
  ): Promise<void> {
    return ovhApi.delete(
      `/telephony/${billingAccount}/phonebook/${bookKey}/phonebookContact/${contactId}`
    );
  },

  // ---------- OFFER TASK ----------

  async getOfferTasks(billingAccount: string): Promise<TelephonyOfferTask[]> {
    try {
      const ids = await ovhApi.get<number[]>(`/telephony/${billingAccount}/offerTask`);
      const tasks = await Promise.all(
        ids.map(async (id) => {
          try {
            return await ovhApi.get<TelephonyOfferTask>(
              `/telephony/${billingAccount}/offerTask/${id}`
            );
          } catch {
            return null;
          }
        })
      );
      return tasks.filter((t): t is TelephonyOfferTask => t !== null);
    } catch {
      return [];
    }
  },

  async getOfferTask(billingAccount: string, taskId: number): Promise<TelephonyOfferTask | null> {
    try {
      return await ovhApi.get<TelephonyOfferTask>(
        `/telephony/${billingAccount}/offerTask/${taskId}`
      );
    } catch {
      return null;
    }
  },

  // ---------- APIs MANQUANTES AJOUTÉES ----------

  // GET /telephony/{ba}/historyTollfreeConsumption - Conso numéros verts
  async getHistoryTollfreeConsumption(billingAccount: string): Promise<TelephonyHistoryConsumption[]> {
    return ovhApi
      .get<TelephonyHistoryConsumption[]>(`/telephony/${billingAccount}/historyTollfreeConsumption`)
      .catch(() => []);
  },

  // GET /telephony/{ba}/historyConsumption/{date} - Détail conso par date
  async getHistoryConsumptionByDate(billingAccount: string, date: string): Promise<{
    date: string;
    price: { value: number; currencyCode: string };
    outplan: { value: number; currencyCode: string };
  } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/historyConsumption/${date}`);
    } catch {
      return null;
    }
  },

  // GET /telephony/{ba}/historyConsumption/{date}/file - Télécharger fichier conso
  async getHistoryConsumptionFile(billingAccount: string, date: string): Promise<{ url: string } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/historyConsumption/${date}/file`);
    } catch {
      return null;
    }
  },

  // POST /telephony/{ba}/abbreviatedNumber - Créer numéro abrégé
  async createAbbreviatedNumber(billingAccount: string, data: {
    abbreviatedNumber: string;
    destinationNumber: string;
    name: string;
  }): Promise<TelephonyAbbreviatedNumber> {
    return ovhApi.post<TelephonyAbbreviatedNumber>(`/telephony/${billingAccount}/abbreviatedNumber`, data);
  },

  // PUT /telephony/{ba}/abbreviatedNumber/{id} - Modifier numéro abrégé
  async updateAbbreviatedNumber(billingAccount: string, id: number, data: {
    destinationNumber?: string;
    name?: string;
  }): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/abbreviatedNumber/${id}`, data);
  },

  // DELETE /telephony/{ba}/abbreviatedNumber/{id} - Supprimer numéro abrégé
  async deleteAbbreviatedNumber(billingAccount: string, id: number): Promise<void> {
    return ovhApi.delete(`/telephony/${billingAccount}/abbreviatedNumber/${id}`);
  },

  // POST /telephony/{ba}/portability - Créer demande portabilité
  async createPortability(billingAccount: string, data: {
    desiredExecutionDate: string;
    building?: string;
    city?: string;
    door?: string;
    floor?: string;
    lineToRedirectAliasTo?: string;
    name: string;
    rio?: string;
    siret?: string;
    socialReason?: string;
    stair?: string;
    streetName?: string;
    streetNumber?: string;
    streetNumberExtra?: string;
    streetType?: string;
    zip?: string;
    numbers: string[];
  }): Promise<GroupPortability> {
    return ovhApi.post<GroupPortability>(`/telephony/${billingAccount}/portability`, data);
  },

  // ========== APIs MANQUANTES AJOUTÉES ==========

  // ---------- SPARE (Téléphones de spare) ----------

  // GET /telephony/spare - Liste des téléphones de spare
  async getSparePhones(): Promise<string[]> {
    try {
      return await ovhApi.get<string[]>('/telephony/spare');
    } catch {
      return [];
    }
  },

  // GET /telephony/spare/{spare} - Détail d'un téléphone de spare
  async getSparePhone(spare: string): Promise<{
    spare: string;
    brand: string;
    macAddress: string;
    protocol: string;
  } | null> {
    try {
      return await ovhApi.get(`/telephony/spare/${spare}`);
    } catch {
      return null;
    }
  },

  // DELETE /telephony/spare/{spare} - Supprimer un téléphone de spare
  async deleteSparePhone(spare: string): Promise<void> {
    return ovhApi.delete(`/telephony/spare/${spare}`);
  },

  // POST /telephony/spare/{spare}/replace - Remplacer un téléphone
  async replaceSparePhone(spare: string, data: {
    domain: string;
    ip: string;
  }): Promise<void> {
    return ovhApi.post(`/telephony/spare/${spare}/replace`, data);
  },

  // ---------- TASK ----------

  // GET /telephony/{ba}/task - Liste des tâches
  async getTasks(billingAccount: string): Promise<{
    taskId: number;
    action: string;
    status: string;
    creationDatetime: string;
    finishDatetime: string | null;
    serviceName: string;
  }[]> {
    try {
      const ids = await ovhApi.get<number[]>(`/telephony/${billingAccount}/task`);
      const tasks = await Promise.all(
        ids.slice(0, 50).map(async (id) => {
          try {
            return await ovhApi.get(`/telephony/${billingAccount}/task/${id}`);
          } catch {
            return null;
          }
        })
      );
      return tasks.filter((t): t is NonNullable<typeof t> => t !== null);
    } catch {
      return [];
    }
  },

  // GET /telephony/{ba}/task/{taskId} - Détail d'une tâche
  async getTask(billingAccount: string, taskId: number): Promise<{
    taskId: number;
    action: string;
    status: string;
    creationDatetime: string;
    finishDatetime: string | null;
    serviceName: string;
    objectCreated: string;
  } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/task/${taskId}`);
    } catch {
      return null;
    }
  },

  // ---------- CREDIT THRESHOLD ----------

  // GET /telephony/{ba}/allowedCreditThreshold - Seuils de crédit autorisés
  async getAllowedCreditThreshold(billingAccount: string): Promise<{
    value: number;
    currencyCode: string;
  }[]> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/allowedCreditThreshold`);
    } catch {
      return [];
    }
  },

  // ---------- SECURITY DEPOSIT ----------

  // POST /telephony/{ba}/transferSecurityDeposit - Transférer le dépôt de garantie
  async transferSecurityDeposit(billingAccount: string, data: {
    amount: number;
    billingAccountDestination: string;
  }): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/transferSecurityDeposit`, data);
  },

  // ---------- TERMINATION ----------

  // POST /telephony/{ba}/cancelTermination - Annuler la résiliation
  async cancelTermination(billingAccount: string): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/cancelTermination`, {});
  },

  // DELETE /telephony/{ba} - Résilier le groupe
  async terminateGroup(billingAccount: string): Promise<void> {
    return ovhApi.delete(`/telephony/${billingAccount}`);
  },

  // ---------- CHANGE CONTACT ----------

  // POST /telephony/{ba}/changeContact - Changer les contacts
  async changeContact(billingAccount: string, data: {
    contactAdmin?: string;
    contactTech?: string;
    contactBilling?: string;
  }): Promise<number[]> {
    return ovhApi.post<number[]>(`/telephony/${billingAccount}/changeContact`, data);
  },

  // ---------- AVAILABLE DOMAINS ----------

  // GET /telephony/availableDefaultSipDomains - Domaines SIP disponibles
  async getAvailableDefaultSipDomains(): Promise<{
    country: string;
    domain: string;
    type: string;
  }[]> {
    try {
      return await ovhApi.get('/telephony/availableDefaultSipDomains');
    } catch {
      return [];
    }
  },

  // POST /telephony/setDefaultSipDomain - Définir le domaine SIP par défaut
  async setDefaultSipDomain(data: {
    country: string;
    domain: string;
    type: string;
  }): Promise<void> {
    return ovhApi.post('/telephony/setDefaultSipDomain', data);
  },

  // ---------- ACCESSORIES ----------

  // GET /telephony/accessories - Liste des accessoires disponibles
  async getAccessories(country: string): Promise<{
    name: string;
    price: { value: number; currencyCode: string };
  }[]> {
    try {
      return await ovhApi.get('/telephony/accessories', { params: { country } });
    } catch {
      return [];
    }
  },

  // ---------- VOICEMAIL GLOBAL ----------

  // GET /telephony/{ba}/voicemail - Liste des messageries vocales
  async getVoicemails(billingAccount: string): Promise<string[]> {
    try {
      return await ovhApi.get<string[]>(`/telephony/${billingAccount}/voicemail`);
    } catch {
      return [];
    }
  },

  // GET /telephony/{ba}/voicemail/{voicemail} - Détail d'une messagerie
  async getVoicemail(billingAccount: string, voicemail: string): Promise<{
    serviceName: string;
    serviceType: string;
    description: string;
    offers: string[];
  } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/voicemail/${voicemail}`);
    } catch {
      return null;
    }
  },

  // ---------- SERVICE ----------

  // GET /telephony/{ba}/service - Liste des services
  async getServices(billingAccount: string): Promise<string[]> {
    try {
      return await ovhApi.get<string[]>(`/telephony/${billingAccount}/service`);
    } catch {
      return [];
    }
  },

  // GET /telephony/{ba}/service/{serviceName} - Détail d'un service
  async getService(billingAccount: string, serviceName: string): Promise<{
    serviceName: string;
    serviceType: string;
    description: string;
    featureType: string;
    offers: string[];
    simultaneousLines: number;
    country: string;
    countryCode: string;
  } | null> {
    try {
      return await ovhApi.get(`/telephony/${billingAccount}/service/${serviceName}`);
    } catch {
      return null;
    }
  },

  // PUT /telephony/{ba}/service/{serviceName} - Modifier un service
  async updateService(billingAccount: string, serviceName: string, data: {
    description?: string;
  }): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/service/${serviceName}`, data);
  },

  // DELETE /telephony/{ba}/service/{serviceName} - Résilier un service
  async terminateService(billingAccount: string, serviceName: string): Promise<void> {
    return ovhApi.delete(`/telephony/${billingAccount}/service/${serviceName}`);
  },

  // POST /telephony/{ba}/service/{serviceName}/cancelTermination - Annuler la résiliation d'un service
  async cancelServiceTermination(billingAccount: string, serviceName: string): Promise<void> {
    return ovhApi.post(`/telephony/${billingAccount}/service/${serviceName}/cancelTermination`, {});
  },
};
