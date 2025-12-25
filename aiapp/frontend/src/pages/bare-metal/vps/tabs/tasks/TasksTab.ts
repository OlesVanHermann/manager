// ============================================================
// VPS SERVICE ISOLÉ : TasksTab
// ============================================================

import { ovhApi } from "../../../../../services/api";
import type { VpsTask } from "../../vps.types";

class TasksService {
  async listTasks(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/vps/${serviceName}/tasks`);
  }

  async getTask(serviceName: string, id: number): Promise<VpsTask> {
    return ovhApi.get<VpsTask>(`/vps/${serviceName}/tasks/${id}`);
  }
}

export const tasksService = new TasksService();
