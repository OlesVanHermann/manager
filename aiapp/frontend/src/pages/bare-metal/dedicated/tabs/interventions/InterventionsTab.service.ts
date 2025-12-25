// ############################################################
// #  DEDICATED/INTERVENTIONS - SERVICE STRICTEMENT ISOLÉ     #
// #  AUCUN IMPORT DEPUIS UN AUTRE TAB                        #
// #  AUCUN IMPORT DEPUIS LE NIVEAU PAGE                      #
// ############################################################

import { ovhApi } from "../../../../../services/api";
import type { DedicatedServerIntervention } from "../../dedicated.types";

// ============================================================
// Service LOCAL - Usage INTERNE au tab interventions uniquement
// NE JAMAIS exporter vers un autre tab ou vers index.tsx
// ============================================================

class InterventionsService {
  // Liste les IDs de toutes les interventions du serveur
  async listInterventions(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/dedicated/server/${serviceName}/intervention`);
  }

  // Récupère les détails d'une intervention
  async getIntervention(
    serviceName: string,
    interventionId: number
  ): Promise<DedicatedServerIntervention> {
    return ovhApi.get<DedicatedServerIntervention>(
      `/dedicated/server/${serviceName}/intervention/${interventionId}`
    );
  }
}

// Export UNIQUEMENT pour usage dans InterventionsTab.tsx
export const interventionsService = new InterventionsService();
