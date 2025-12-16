// ============================================================
// SERVICE WEB-CLOUD VOIP - Telephonie VoIP OVHcloud
// ============================================================

import { ovhApi } from './api';

// ============================================================
// TYPES
// ============================================================

export interface TelephonyBillingAccount {
  billingAccount: string;
  description: string;
  status: 'enabled' | 'expired';
  trusted: boolean;
  version: number;
  securityDeposit: number;
  currentOutplan: number;
  allowedOutplan: number;
}

export interface TelephonyLine {
  serviceName: string;
  serviceType: 'line' | 'trunk';
  description: string;
  simultaneousLines: number;
  offers: string[];
  getPublicOffer: { name: string; description: string };
}

export interface TelephonyNumber {
  serviceName: string;
  serviceType: 'alias' | 'ddi';
  description: string;
  featureType: 'conference' | 'contactCenterSolution' | 'ddi' | 'easyHunting' | 'easyPabx' | 'empty' | 'fax' | 'miniPabx' | 'redirect' | 'svi' | 'voicemail';
  country: string;
}

export interface TelephonyVoicemail {
  serviceName: string;
  offers: string[];
  description: string;
}

export interface TelephonyServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew: { automatic: boolean; deleteAtExpiration: boolean; period: number | null };
}

// ============================================================
// SERVICE
// ============================================================

class VoipService {
  async listBillingAccounts(): Promise<string[]> {
    return ovhApi.get<string[]>('/telephony');
  }

  async getBillingAccount(billingAccount: string): Promise<TelephonyBillingAccount> {
    return ovhApi.get<TelephonyBillingAccount>(`/telephony/${billingAccount}`);
  }

  async getBillingAccountServiceInfos(billingAccount: string): Promise<TelephonyServiceInfos> {
    return ovhApi.get<TelephonyServiceInfos>(`/telephony/${billingAccount}/serviceInfos`);
  }

  async listLines(billingAccount: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/telephony/${billingAccount}/line`);
  }

  async getLine(billingAccount: string, serviceName: string): Promise<TelephonyLine> {
    return ovhApi.get<TelephonyLine>(`/telephony/${billingAccount}/line/${serviceName}`);
  }

  async listNumbers(billingAccount: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/telephony/${billingAccount}/number`);
  }

  async getNumber(billingAccount: string, serviceName: string): Promise<TelephonyNumber> {
    return ovhApi.get<TelephonyNumber>(`/telephony/${billingAccount}/number/${serviceName}`);
  }

  async listVoicemails(billingAccount: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/telephony/${billingAccount}/voicemail`);
  }

  async getVoicemail(billingAccount: string, serviceName: string): Promise<TelephonyVoicemail> {
    return ovhApi.get<TelephonyVoicemail>(`/telephony/${billingAccount}/voicemail/${serviceName}`);
  }
}

export const voipService = new VoipService();
