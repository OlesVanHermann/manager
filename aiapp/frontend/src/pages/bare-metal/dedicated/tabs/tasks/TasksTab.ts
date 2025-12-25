// ############################################################
// #  DEDICATED/TASKS - SERVICE STRICTEMENT ISOLÉ             #
// #  AUCUN IMPORT DEPUIS UN AUTRE TAB                        #
// #  AUCUN IMPORT DEPUIS LE NIVEAU PAGE                      #
// ############################################################

import { ovhApi } from "../../../../../services/api";
import type { DedicatedServerTask } from "../../dedicated.types";

// ============================================================
// Service LOCAL - Usage INTERNE au tab tasks uniquement
// NE JAMAIS exporter vers un autre tab ou vers index.tsx
// ============================================================

class TasksService {
  // Liste les IDs de toutes les tâches du serveur
  async listTasks(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/dedicated/server/${serviceName}/task`);
  }

  // Récupère les détails d'une tâche
  async getTask(serviceName: string, taskId: number): Promise<DedicatedServerTask> {
    return ovhApi.get<DedicatedServerTask>(
      `/dedicated/server/${serviceName}/task/${taskId}`
    );
  }
}

// Export UNIQUEMENT pour usage dans TasksTab.tsx
export const tasksService = new TasksService();
