// ############################################################
// #  HOUSING/TASKS - SERVICE STRICTEMENT ISOLÉ               #
// #  AUCUN IMPORT DEPUIS UN AUTRE TAB                        #
// #  AUCUN IMPORT DEPUIS LE NIVEAU PAGE                      #
// ############################################################

import { ovhApi } from "../../../../../services/api";
import type { HousingTask } from "../../housing.types";

// ============================================================
// Service LOCAL - Usage INTERNE au tab tasks uniquement
// NE JAMAIS exporter vers un autre tab ou vers index.tsx
// ============================================================

class TasksService {
  // Récupère toutes les tâches du housing
  async getTasks(serviceName: string): Promise<HousingTask[]> {
    const ids = await ovhApi.get<number[]>(`/dedicated/housing/${serviceName}/task`);
    return Promise.all(
      ids.slice(0, 50).map((id) =>
        ovhApi.get<HousingTask>(`/dedicated/housing/${serviceName}/task/${id}`)
      )
    );
  }
}

// Export UNIQUEMENT pour usage dans TasksTab.tsx
export const tasksService = new TasksService();
