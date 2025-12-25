// ############################################################
// #  DEDICATED/NETWORK - SERVICE STRICTEMENT ISOLÉ           #
// #  AUCUN IMPORT DEPUIS UN AUTRE TAB                        #
// #  AUCUN IMPORT DEPUIS LE NIVEAU PAGE                      #
// ############################################################

import { ovhApi } from "../../../../../services/api";
import type { DedicatedServerVrack } from "../../dedicated.types";

// ============================================================
// Service LOCAL - Usage INTERNE au tab network uniquement
// NE JAMAIS exporter vers un autre tab ou vers index.tsx
// ============================================================

class NetworkService {
  // Liste toutes les IPs associées au serveur
  async listIps(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/dedicated/server/${serviceName}/ips`);
  }

  // Liste tous les vRacks associés au serveur
  async listVracks(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/dedicated/server/${serviceName}/vrack`);
  }

  // Récupère les détails d'un vRack
  async getVrack(serviceName: string, vrack: string): Promise<DedicatedServerVrack> {
    return ovhApi.get<DedicatedServerVrack>(
      `/dedicated/server/${serviceName}/vrack/${vrack}`
    );
  }
}

// Export UNIQUEMENT pour usage dans NetworkTab.tsx
export const networkService = new NetworkService();
