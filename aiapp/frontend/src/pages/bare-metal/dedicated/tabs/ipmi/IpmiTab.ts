// ############################################################
// #  DEDICATED/IPMI - SERVICE STRICTEMENT ISOLÉ              #
// #  AUCUN IMPORT DEPUIS UN AUTRE TAB                        #
// #  AUCUN IMPORT DEPUIS LE NIVEAU PAGE                      #
// ############################################################

import { ovhApi } from "../../../../../services/api";
import type { DedicatedServerIpmi, DedicatedServerTask } from "../../dedicated.types";

// ============================================================
// Service LOCAL - Usage INTERNE au tab ipmi uniquement
// NE JAMAIS exporter vers un autre tab ou vers index.tsx
// ============================================================

class IpmiService {
  // Récupère les informations IPMI du serveur
  async getIpmi(serviceName: string): Promise<DedicatedServerIpmi> {
    return ovhApi.get<DedicatedServerIpmi>(
      `/dedicated/server/${serviceName}/features/ipmi`
    );
  }

  // Démarre une session IPMI (KVM ou Serial over LAN)
  async startIpmiSession(
    serviceName: string,
    type: "kvmipJnlp" | "kvmipHtml5URL" | "serialOverLanURL"
  ): Promise<{ value: string }> {
    return ovhApi.post<{ value: string }>(
      `/dedicated/server/${serviceName}/features/ipmi/access`,
      { type }
    );
  }

  // Redémarre l'interface IPMI
  async rebootIpmi(serviceName: string): Promise<DedicatedServerTask> {
    return ovhApi.post<DedicatedServerTask>(
      `/dedicated/server/${serviceName}/features/ipmi/resetInterface`,
      {}
    );
  }
}

// Export UNIQUEMENT pour usage dans IpmiTab.tsx
export const ipmiService = new IpmiService();
