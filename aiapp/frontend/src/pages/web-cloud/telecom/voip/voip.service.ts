// ============================================================
// VOIP SERVICE - Appels API pour le dashboard VoIP
// ============================================================

import { ovhApi } from '../../../../services/api';
import type {
  TelephonyBillingAccount,
  TelephonyGroupSummary,
  TelephonyHistoryConsumption,
  TelephonyPhone,
} from './voip.types';

export const voipService = {
  // ---------- GROUPES ----------

  async listBillingAccounts(): Promise<string[]> {
    return ovhApi.get<string[]>('/telephony');
  },

  async getBillingAccount(billingAccount: string): Promise<TelephonyBillingAccount> {
    return ovhApi.get<TelephonyBillingAccount>(`/telephony/${billingAccount}`);
  },

  async updateBillingAccount(
    billingAccount: string,
    data: { description?: string }
  ): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}`, data);
  },

  // ---------- COMPTEURS ----------

  async countLines(billingAccount: string): Promise<number> {
    const lines = await ovhApi.get<string[]>(`/telephony/${billingAccount}/line`);
    return lines.length;
  },

  async countNumbers(billingAccount: string): Promise<number> {
    const numbers = await ovhApi.get<string[]>(`/telephony/${billingAccount}/number`);
    return numbers.length;
  },

  async countFax(billingAccount: string): Promise<number> {
    const faxList = await ovhApi.get<string[]>(`/telephony/${billingAccount}/fax`);
    return faxList.length;
  },

  // ---------- SUMMARY (agrégé) ----------

  async getGroupSummary(billingAccount: string): Promise<TelephonyGroupSummary> {
    const [account, lines, numbers, faxList] = await Promise.all([
      this.getBillingAccount(billingAccount),
      ovhApi.get<string[]>(`/telephony/${billingAccount}/line`).catch(() => []),
      ovhApi.get<string[]>(`/telephony/${billingAccount}/number`).catch(() => []),
      ovhApi.get<string[]>(`/telephony/${billingAccount}/fax`).catch(() => []),
    ]);

    return {
      billingAccount: account.billingAccount,
      description: account.description,
      status: account.status,
      linesCount: lines.length,
      numbersCount: numbers.length,
      faxCount: faxList.length,
      creditThreshold: account.creditThreshold || 0,
    };
  },

  async getAllGroupsSummaries(): Promise<TelephonyGroupSummary[]> {
    const billingAccounts = await this.listBillingAccounts();
    const summaries = await Promise.all(
      billingAccounts.map((ba) => this.getGroupSummary(ba).catch(() => null))
    );
    return summaries.filter((s): s is TelephonyGroupSummary => s !== null);
  },

  // ---------- CONSOMMATION ----------

  async getHistoryConsumption(billingAccount: string): Promise<TelephonyHistoryConsumption[]> {
    return ovhApi
      .get<TelephonyHistoryConsumption[]>(`/telephony/${billingAccount}/historyConsumption`)
      .catch(() => []);
  },

  // ---------- PARC TÉLÉPHONES ----------

  async getPhoneDetails(billingAccount: string, serviceName: string): Promise<TelephonyPhone | null> {
    return ovhApi
      .get<TelephonyPhone>(`/telephony/${billingAccount}/line/${serviceName}/phone`)
      .catch(() => null);
  },

  async getAllPhones(billingAccount: string): Promise<Array<{ serviceName: string; phone: TelephonyPhone | null }>> {
    const lines = await ovhApi.get<string[]>(`/telephony/${billingAccount}/line`).catch(() => []);
    const phones = await Promise.all(
      lines.map(async (serviceName) => ({
        serviceName,
        phone: await this.getPhoneDetails(billingAccount, serviceName),
      }))
    );
    return phones;
  },
};
