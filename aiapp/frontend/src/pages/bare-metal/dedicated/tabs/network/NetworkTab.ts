// ============================================================
// DEDICATED SERVICE ISOLÉ : NetworkTab
// ============================================================

import { ovhApi } from "../../../../../services/api";
import type { DedicatedServerVrack } from "../../dedicated.types";

class NetworkService {
  async listIps(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/dedicated/server/${serviceName}/ips`);
  }

  async listVracks(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/dedicated/server/${serviceName}/vrack`);
  }

  async getVrack(serviceName: string, vrack: string): Promise<DedicatedServerVrack> {
    return ovhApi.get<DedicatedServerVrack>(`/dedicated/server/${serviceName}/vrack/${vrack}`);
  }
}

export const networkService = new NetworkService();
