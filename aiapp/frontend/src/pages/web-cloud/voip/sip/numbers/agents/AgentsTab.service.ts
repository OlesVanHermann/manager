// ============================================================
// AGENTS TAB SERVICE - Appels API isolés pour Numbers Agents
// DEFACTORISATION: Ce service est ISOLÉ et ne doit pas être partagé
// ============================================================

import { ovhApi } from '../../../../../../services/api';

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
  // GET /telephony/{ba}/easyHunting/{sn}/hunting/agent - Retourne number[] (agentId)
  async getAgents(billingAccount: string, serviceName: string): Promise<NumberAgent[]> {
    try {
      // API correcte: retourne un tableau de number (agentId), pas de string
      const agentIds = await ovhApi.get<number[]>(`/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/agent`);
      const agents = await Promise.all(
        agentIds.map(async (agentId) => {
          try {
            return await ovhApi.get<NumberAgent>(`/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/agent/${agentId}`);
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

  // PUT /telephony/{ba}/easyHunting/{sn}/hunting/agent/{agentId}
  async updateAgent(billingAccount: string, serviceName: string, agentId: number, data: Partial<NumberAgent>): Promise<void> {
    return ovhApi.put(`/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/agent/${agentId}`, data);
  },

  // POST /telephony/{ba}/easyHunting/{sn}/hunting/agent
  async addAgent(billingAccount: string, serviceName: string, data: Partial<NumberAgent>): Promise<NumberAgent> {
    return ovhApi.post<NumberAgent>(`/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/agent`, data);
  },

  // DELETE /telephony/{ba}/easyHunting/{sn}/hunting/agent/{agentId}
  async deleteAgent(billingAccount: string, serviceName: string, agentId: number): Promise<void> {
    return ovhApi.delete(`/telephony/${billingAccount}/easyHunting/${serviceName}/hunting/agent/${agentId}`);
  },
};
