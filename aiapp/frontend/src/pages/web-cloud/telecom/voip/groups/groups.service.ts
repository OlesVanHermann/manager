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
};
