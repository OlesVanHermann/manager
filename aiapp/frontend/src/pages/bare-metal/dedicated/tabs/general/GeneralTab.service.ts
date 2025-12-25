// ############################################################
// #  DEDICATED/GENERAL - SERVICE STRICTEMENT ISOLÉ           #
// #  AUCUN IMPORT DEPUIS UN AUTRE TAB                        #
// #  AUCUN IMPORT DEPUIS LE NIVEAU PAGE                      #
// ############################################################

import { ovhApi } from "../../../../../services/api";
import type {
  DedicatedServer,
  DedicatedServerServiceInfos,
  DedicatedServerHardware,
  DedicatedServerTask,
} from "../../dedicated.types";

// ============================================================
// Service LOCAL - Usage INTERNE au tab general uniquement
// NE JAMAIS exporter vers un autre tab ou vers index.tsx
// ============================================================

class GeneralService {
  // Liste tous les serveurs dédiés
  async listServers(): Promise<string[]> {
    return ovhApi.get<string[]>("/dedicated/server");
  }

  // Récupère les détails d'un serveur
  async getServer(serviceName: string): Promise<DedicatedServer> {
    return ovhApi.get<DedicatedServer>(`/dedicated/server/${serviceName}`);
  }

  // Récupère les infos de service (expiration, renouvellement)
  async getServiceInfos(serviceName: string): Promise<DedicatedServerServiceInfos> {
    return ovhApi.get<DedicatedServerServiceInfos>(
      `/dedicated/server/${serviceName}/serviceInfos`
    );
  }

  // Récupère les spécifications hardware
  async getHardware(serviceName: string): Promise<DedicatedServerHardware> {
    return ovhApi.get<DedicatedServerHardware>(
      `/dedicated/server/${serviceName}/specifications/hardware`
    );
  }

  // Liste les IPs du serveur
  async listIps(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/dedicated/server/${serviceName}/ips`);
  }

  // Reboot le serveur
  async reboot(serviceName: string): Promise<DedicatedServerTask> {
    return ovhApi.post<DedicatedServerTask>(`/dedicated/server/${serviceName}/reboot`, {});
  }
}

// Export UNIQUEMENT pour usage dans GeneralTab.tsx
export const generalService = new GeneralService();
