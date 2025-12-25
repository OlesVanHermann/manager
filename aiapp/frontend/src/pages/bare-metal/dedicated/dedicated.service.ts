// ============================================================
// DEDICATED - Service NIVEAU PAGE (pas niveau tab)
// Utilisé uniquement par index.tsx pour charger les données
// ============================================================

import { ovhApi } from "../../../services/api";
import type {
  DedicatedServer,
  DedicatedServerServiceInfos,
  DedicatedServerHardware,
  DedicatedServerTask,
} from "./dedicated.types";

class DedicatedPageService {
  async listServers(): Promise<string[]> {
    return ovhApi.get<string[]>("/dedicated/server");
  }

  async getServer(serviceName: string): Promise<DedicatedServer> {
    return ovhApi.get<DedicatedServer>(`/dedicated/server/${serviceName}`);
  }

  async getServiceInfos(serviceName: string): Promise<DedicatedServerServiceInfos> {
    return ovhApi.get<DedicatedServerServiceInfos>(
      `/dedicated/server/${serviceName}/serviceInfos`
    );
  }

  async getHardware(serviceName: string): Promise<DedicatedServerHardware> {
    return ovhApi.get<DedicatedServerHardware>(
      `/dedicated/server/${serviceName}/specifications/hardware`
    );
  }

  async reboot(serviceName: string): Promise<DedicatedServerTask> {
    return ovhApi.post<DedicatedServerTask>(`/dedicated/server/${serviceName}/reboot`, {});
  }
}

export const dedicatedPageService = new DedicatedPageService();
