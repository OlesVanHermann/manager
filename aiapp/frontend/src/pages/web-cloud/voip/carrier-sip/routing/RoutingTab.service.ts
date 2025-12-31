// ============================================================
// ROUTING TAB SERVICE - API calls isolés
// ============================================================

import { ovhApi } from '../../../../../../services/api';

interface RoutingRule {
  id: string;
  name: string;
  pattern: string;
  destination: string;
  priority: number;
  enabled: boolean;
}

interface RoutingConfig {
  defaultDestination: string;
  failoverDestination: string;
  timeout: number;
}

export const routingService = {
  async getRoutingRules(billingAccount: string, serviceName: string): Promise<RoutingRule[]> {
    try {
      const ids = await ovhApi.get<string[]>(
        `/telephony/${billingAccount}/carrierSip/${serviceName}/outboundRouting`
      );
      const rules = await Promise.all(
        ids.map(id =>
          ovhApi.get<RoutingRule>(
            `/telephony/${billingAccount}/carrierSip/${serviceName}/outboundRouting/${id}`
          )
        )
      );
      return rules;
    } catch {
      return [];
    }
  },

  async createRoutingRule(
    billingAccount: string,
    serviceName: string,
    rule: Omit<RoutingRule, 'id'>
  ): Promise<RoutingRule> {
    return ovhApi.post(
      `/telephony/${billingAccount}/carrierSip/${serviceName}/outboundRouting`,
      rule
    );
  },

  async updateRoutingRule(
    billingAccount: string,
    serviceName: string,
    ruleId: string,
    rule: Partial<RoutingRule>
  ): Promise<void> {
    await ovhApi.put(
      `/telephony/${billingAccount}/carrierSip/${serviceName}/outboundRouting/${ruleId}`,
      rule
    );
  },

  async deleteRoutingRule(
    billingAccount: string,
    serviceName: string,
    ruleId: string
  ): Promise<void> {
    await ovhApi.delete(
      `/telephony/${billingAccount}/carrierSip/${serviceName}/outboundRouting/${ruleId}`
    );
  },

  async getConfig(billingAccount: string, serviceName: string): Promise<RoutingConfig> {
    try {
      return await ovhApi.get<RoutingConfig>(
        `/telephony/${billingAccount}/carrierSip/${serviceName}/settings`
      );
    } catch {
      return {
        defaultDestination: '',
        failoverDestination: '',
        timeout: 30,
      };
    }
  },

  async updateConfig(
    billingAccount: string,
    serviceName: string,
    config: Partial<RoutingConfig>
  ): Promise<void> {
    await ovhApi.put(
      `/telephony/${billingAccount}/carrierSip/${serviceName}/settings`,
      config
    );
  },
};
