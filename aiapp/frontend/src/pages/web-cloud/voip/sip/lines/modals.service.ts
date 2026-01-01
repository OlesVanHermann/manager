// ============================================================
// VOIP MODALS SERVICE - API calls isolés
// ============================================================

import { ovhApi } from '../../../../../services/api';

export const modalsService = {
  // ========== LINE PASSWORD ==========
  async changeLinePassword(
    billingAccount: string,
    serviceName: string,
    password: string
  ): Promise<void> {
    await ovhApi.post(
      `/telephony/${billingAccount}/line/${serviceName}/changePassword`,
      { password }
    );
  },

  // ========== FORWARD CONFIG ==========
  async getForwardConfig(
    billingAccount: string,
    serviceName: string
  ): Promise<{
    nature: string;
    destination: string;
    noReplyDelay: number;
  }> {
    return ovhApi.get(
      `/telephony/${billingAccount}/line/${serviceName}/options`
    );
  },

  async updateForwardConfig(
    billingAccount: string,
    serviceName: string,
    config: {
      forwardUnconditional?: string;
      forwardNoReply?: string;
      forwardBusy?: string;
      noReplyDelay?: number;
    }
  ): Promise<void> {
    await ovhApi.put(
      `/telephony/${billingAccount}/line/${serviceName}/options`,
      config
    );
  },

  // ========== VOICEMAIL GREETING ==========
  async uploadVoicemailGreeting(
    billingAccount: string,
    serviceName: string,
    file: File,
    type: 'unavailable' | 'busy' | 'temp'
  ): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(
      `/api/ovh/telephony/${billingAccount}/voicemail/${serviceName}/greetings`,
      {
        method: 'POST',
        body: formData,
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }
  },

  // ========== QUEUE AGENTS ==========
  async addQueueAgent(
    billingAccount: string,
    serviceName: string,
    agent: {
      agentNumber: string;
      position: number;
      simultaneousLines: number;
      status: 'available' | 'paused';
      wrapUpTime: number;
    }
  ): Promise<void> {
    await ovhApi.post(
      `/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/agent`,
      agent
    );
  },

  // ========== NUMBER CONFIG ==========
  async getNumberConfig(
    billingAccount: string,
    serviceName: string
  ): Promise<{
    featureType: string;
    description: string;
  }> {
    return ovhApi.get(
      `/telephony/${billingAccount}/number/${serviceName}`
    );
  },

  async updateNumberConfig(
    billingAccount: string,
    serviceName: string,
    config: {
      description?: string;
      featureType?: string;
    }
  ): Promise<void> {
    await ovhApi.put(
      `/telephony/${billingAccount}/number/${serviceName}`,
      config
    );
  },

  async changeNumberFeature(
    billingAccount: string,
    serviceName: string,
    featureType: string
  ): Promise<void> {
    await ovhApi.post(
      `/telephony/${billingAccount}/number/${serviceName}/changeFeatureType`,
      { featureType }
    );
  },
};
