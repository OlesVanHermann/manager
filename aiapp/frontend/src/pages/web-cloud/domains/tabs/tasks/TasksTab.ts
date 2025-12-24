// ============================================================
// SERVICE ISOLÉ : TasksTab - Gestion des tâches domaine + zone
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { DomainTask, ZoneTask } from "../../domains.types";

// ============ HELPERS LOCAUX (DUPLIQUÉS) ============

const formatDateTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ============ SERVICE ============

class TasksService {
  // -------- DOMAIN TASKS --------
  async listDomainTasks(domain: string): Promise<number[]> {
    return ovhGet<number[]>(`/domain/${domain}/task`);
  }

  async getDomainTask(domain: string, id: number): Promise<DomainTask> {
    return ovhGet<DomainTask>(`/domain/${domain}/task/${id}`);
  }

  // -------- ZONE TASKS --------
  async listZoneTasks(zone: string): Promise<number[]> {
    return ovhGet<number[]>(`/domain/zone/${zone}/task`);
  }

  async getZoneTask(zone: string, id: number): Promise<ZoneTask> {
    return ovhGet<ZoneTask>(`/domain/zone/${zone}/task/${id}`);
  }
}

export const tasksService = new TasksService();
export { formatDateTime };
