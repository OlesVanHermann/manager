// ============================================================
// SMS SEND TAB SERVICE - API calls isolés
// ============================================================

import { ovhApi } from '../../../../../../services/api';

interface SendSmsPayload {
  sender: string;
  receivers: string[];
  message: string;
  noStopClause?: boolean;
  differedPeriod?: number;
}

interface Template {
  id: string;
  name: string;
  content: string;
}

export const sendService = {
  async getSenders(serviceName: string): Promise<string[]> {
    try {
      return await ovhApi.get<string[]>(`/sms/${serviceName}/senders`);
    } catch {
      return [];
    }
  },

  async getTemplates(serviceName: string): Promise<Template[]> {
    try {
      // Note: OVH API doesn't have a templates endpoint by default
      // This would be custom implementation or stored locally
      return [];
    } catch {
      return [];
    }
  },

  async sendSms(serviceName: string, payload: SendSmsPayload): Promise<void> {
    await ovhApi.post(`/sms/${serviceName}/jobs`, {
      sender: payload.sender,
      receivers: payload.receivers,
      message: payload.message,
      noStopClause: payload.noStopClause || false,
      differedPeriod: payload.differedPeriod,
    });
  },

  async estimateCost(
    serviceName: string,
    message: string,
    receivers: string[]
  ): Promise<{ credits: number; quantity: number }> {
    try {
      return await ovhApi.post(`/sms/${serviceName}/jobs/estimate`, {
        message,
        receivers,
      });
    } catch {
      // Fallback calculation
      const smsPerMessage = Math.ceil(message.length / 160);
      return {
        credits: smsPerMessage * receivers.length,
        quantity: receivers.length,
      };
    }
  },
};
