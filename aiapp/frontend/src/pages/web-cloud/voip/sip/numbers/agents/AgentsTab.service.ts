// ============================================================
// AGENTS TAB SERVICE - Appels API isolés pour Numbers Agents
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../../services/api';

export interface NumberAgent {
  agentNumber: string;
  description: string;
  logged: boolean;
  noReplyTimer: number;
  position: number;
  simultaneousLines: number;
  status: 'available' | 'away' | 'busy';
  wrapUpTime: number;
}

export const agentsTabService = {
  async getAgents(billingAccount: string, serviceName: string): Promise<NumberAgent[]> {
    try {
      const numbers = await ovhApi.get<string[]>(`/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/agent`);
      const agents = await Promise.all(
        numbers.map(async (agentNumber) => {
          try {
            return await ovhApi.get<NumberAgent>(`/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/agent/${agentNumber}`);
          } catch {
            return null;
          }
        })
      );
      return agents.filter((a): a is NumberAgent => a !== null);
    } catch {
      return [];
    }
  },

  async updateAgent(billingAccount: string, serviceName: string, agentNumber: string, data: Partial<NumberAgent>): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/agent/${agentNumber}`, data);
  },

  async addAgent(billingAccount: string, serviceName: string, data: Partial<NumberAgent>): Promise<NumberAgent> {
    return ovhApi.post<NumberAgent>(`/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/agent`, data);
  },

  async deleteAgent(billingAccount: string, serviceName: string, agentNumber: string): Promise<void> {
    return ovhApi.delete(`/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/agent/${agentNumber}`);
  },
};
