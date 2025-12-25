// ============================================================
// DEDICATED SERVICE ISOLÉ : IpmiTab
// ============================================================

import { ovhApi } from "../../../../../services/api";
import type { DedicatedServerIpmi, DedicatedServerTask } from "../../dedicated.types";

class IpmiService {
  async getIpmi(serviceName: string): Promise<DedicatedServerIpmi> {
    return ovhApi.get<DedicatedServerIpmi>(`/dedicated/server/${serviceName}/features/ipmi`);
  }

  async startIpmiSession(serviceName: string, type: "kvmipJnlp" | "kvmipHtml5URL" | "serialOverLanURL"): Promise<{ value: string }> {
    return ovhApi.post<{ value: string }>(`/dedicated/server/${serviceName}/features/ipmi/access`, { type });
  }

  async rebootIpmi(serviceName: string): Promise<DedicatedServerTask> {
    return ovhApi.post<DedicatedServerTask>(`/dedicated/server/${serviceName}/features/ipmi/resetInterface`, {});
  }
}

export const ipmiService = new IpmiService();
