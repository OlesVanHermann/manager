// ============================================================
// SERVICE WEB-CLOUD SMS - SMS OVHcloud
// ============================================================

import { ovhApi } from './api';

// ============================================================
// TYPES
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

// ============================================================
// SERVICE
// ============================================================

class SmsService {
  async listSmsAccounts(): Promise<string[]> {
    return ovhApi.get<string[]>('/sms');
  }

  async getSmsAccount(serviceName: string): Promise<SmsAccount> {
    return ovhApi.get<SmsAccount>(`/sms/${serviceName}`);
  }

  async getSmsServiceInfos(serviceName: string): Promise<SmsServiceInfos> {
    return ovhApi.get<SmsServiceInfos>(`/sms/${serviceName}/serviceInfos`);
  }

  async listSmsSenders(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/sms/${serviceName}/senders`);
  }

  async getSmsSender(serviceName: string, sender: string): Promise<SmsSender> {
    return ovhApi.get<SmsSender>(`/sms/${serviceName}/senders/${sender}`);
  }

  async listSmsOutgoing(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/sms/${serviceName}/outgoing`);
  }

  async getSmsOutgoing(serviceName: string, id: number): Promise<SmsOutgoing> {
    return ovhApi.get<SmsOutgoing>(`/sms/${serviceName}/outgoing/${id}`);
  }

  async listSmsIncoming(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/sms/${serviceName}/incoming`);
  }

  async getSmsIncoming(serviceName: string, id: number): Promise<SmsIncoming> {
    return ovhApi.get<SmsIncoming>(`/sms/${serviceName}/incoming/${id}`);
  }

  async sendSms(serviceName: string, message: string, receivers: string[], sender: string): Promise<{ ids: number[] }> {
    return ovhApi.post(`/sms/${serviceName}/jobs`, { message, receivers, sender, noStopClause: false });
  }
}

export const smsService = new SmsService();
