// ============================================================
// SERVICE TELECOM - VoIP, SMS, Fax OVHcloud
// ============================================================

import { ovhApi } from './api.service';

// ============================================================
// TYPES - TELEPHONY (VoIP)
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

export interface TelephonyFax {
  serviceName: string;
  description: string;
  offers: string[];
  notifications: { email: string; type: string }[];
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
// TYPES - SMS
// ============================================================

export interface SmsAccount {
  name: string;
  description: string;
  creditsLeft: number;
  status: 'disable' | 'enable';
  smsResponse: { cgiUrl: string | null; responseType: string; text: string | null; trackingDefaultSmsSender: string | null };
  creditThresholdForAutomaticRecredit: number;
  automaticRecreditAmount: { quantity: number; amount: number } | null;
  callBack: string | null;
  templates: { customizedEmailMode: boolean; customizedSmsMode: boolean };
}

export interface SmsServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew: { automatic: boolean; deleteAtExpiration: boolean; period: number | null };
}

export interface SmsSender {
  sender: string;
  status: 'disable' | 'enable' | 'waitingValidation';
  type: 'alpha' | 'numeric' | 'shortcode' | 'virtual';
  comment: string | null;
  validationMedia: string | null;
}

export interface SmsOutgoing {
  id: number;
  creationDatetime: string;
  credits: number;
  deliveryReceipt: number;
  differedDelivery: number;
  message: string;
  numberOfSms: number;
  ptt: number;
  receiver: string;
  sender: string;
  tag: string | null;
  tariffCode: string;
}

export interface SmsIncoming {
  id: number;
  creationDatetime: string;
  credits: number;
  message: string;
  sender: string;
  tag: string | null;
}

export interface SmsJob {
  id: number;
  creationDatetime: string;
  credits: number;
  deliveryReceipt: number;
  differedDelivery: number;
  message: string;
  messageLength: number;
  name: string;
  numberOfSms: number;
  ptt: number;
  receiver: string;
  sender: string;
}

// ============================================================
// TYPES - FAX
// ============================================================

export interface FreefaxAccount {
  number: string;
  fromName: string;
  fromEmail: string;
  redirectionEmail: string[];
  faxQuality: 'best' | 'high' | 'normal';
  faxMaxCall: number;
  faxTagLine: string;
}

// ============================================================
// SERVICE
// ============================================================

class TelecomService {
  // ==================== TELEPHONY ====================
  async listBillingAccounts(): Promise<string[]> {
    return ovhApi.get<string[]>('/telephony');
  }

  async getBillingAccount(billingAccount: string): Promise<TelephonyBillingAccount> {
    return ovhApi.get<TelephonyBillingAccount>(`/telephony/${billingAccount}`);
  }

  async getBillingAccountServiceInfos(billingAccount: string): Promise<TelephonyServiceInfos> {
    return ovhApi.get<TelephonyServiceInfos>(`/telephony/${billingAccount}/serviceInfos`);
  }

  // Lines
  async listLines(billingAccount: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/telephony/${billingAccount}/line`);
  }

  async getLine(billingAccount: string, serviceName: string): Promise<TelephonyLine> {
    return ovhApi.get<TelephonyLine>(`/telephony/${billingAccount}/line/${serviceName}`);
  }

  // Numbers
  async listNumbers(billingAccount: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/telephony/${billingAccount}/number`);
  }

  async getNumber(billingAccount: string, serviceName: string): Promise<TelephonyNumber> {
    return ovhApi.get<TelephonyNumber>(`/telephony/${billingAccount}/number/${serviceName}`);
  }

  // Voicemail
  async listVoicemails(billingAccount: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/telephony/${billingAccount}/voicemail`);
  }

  async getVoicemail(billingAccount: string, serviceName: string): Promise<TelephonyVoicemail> {
    return ovhApi.get<TelephonyVoicemail>(`/telephony/${billingAccount}/voicemail/${serviceName}`);
  }

  // Fax (in telephony)
  async listTelephonyFax(billingAccount: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/telephony/${billingAccount}/fax`);
  }

  async getTelephonyFax(billingAccount: string, serviceName: string): Promise<TelephonyFax> {
    return ovhApi.get<TelephonyFax>(`/telephony/${billingAccount}/fax/${serviceName}`);
  }

  // ==================== SMS ====================
  async listSmsAccounts(): Promise<string[]> {
    return ovhApi.get<string[]>('/sms');
  }

  async getSmsAccount(serviceName: string): Promise<SmsAccount> {
    return ovhApi.get<SmsAccount>(`/sms/${serviceName}`);
  }

  async getSmsServiceInfos(serviceName: string): Promise<SmsServiceInfos> {
    return ovhApi.get<SmsServiceInfos>(`/sms/${serviceName}/serviceInfos`);
  }

  // Senders
  async listSmsSenders(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/sms/${serviceName}/senders`);
  }

  async getSmsSender(serviceName: string, sender: string): Promise<SmsSender> {
    return ovhApi.get<SmsSender>(`/sms/${serviceName}/senders/${sender}`);
  }

  // Outgoing
  async listSmsOutgoing(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/sms/${serviceName}/outgoing`);
  }

  async getSmsOutgoing(serviceName: string, id: number): Promise<SmsOutgoing> {
    return ovhApi.get<SmsOutgoing>(`/sms/${serviceName}/outgoing/${id}`);
  }

  // Incoming
  async listSmsIncoming(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/sms/${serviceName}/incoming`);
  }

  async getSmsIncoming(serviceName: string, id: number): Promise<SmsIncoming> {
    return ovhApi.get<SmsIncoming>(`/sms/${serviceName}/incoming/${id}`);
  }

  // Jobs
  async listSmsJobs(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/sms/${serviceName}/jobs`);
  }

  async getSmsJob(serviceName: string, id: number): Promise<SmsJob> {
    return ovhApi.get<SmsJob>(`/sms/${serviceName}/jobs/${id}`);
  }

  // Send SMS
  async sendSms(serviceName: string, message: string, receivers: string[], sender: string): Promise<{ ids: number[] }> {
    return ovhApi.post(`/sms/${serviceName}/jobs`, { message, receivers, sender, noStopClause: false });
  }

  // ==================== FREEFAX ====================
  async listFreefax(): Promise<string[]> {
    return ovhApi.get<string[]>('/freefax');
  }

  async getFreefax(serviceName: string): Promise<FreefaxAccount> {
    return ovhApi.get<FreefaxAccount>(`/freefax/${serviceName}`);
  }
}

export const telecomService = new TelecomService();
