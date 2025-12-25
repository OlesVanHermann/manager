// ============================================================
// DEDICATED SERVICE ISOLÉ : TasksTab
// ============================================================

import { ovhApi } from "../../../../../services/api";
import type { DedicatedServerTask } from "../../dedicated.types";

class TasksService {
  async listTasks(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/dedicated/server/${serviceName}/task`);
  }

  async getTask(serviceName: string, taskId: number): Promise<DedicatedServerTask> {
    return ovhApi.get<DedicatedServerTask>(`/dedicated/server/${serviceName}/task/${taskId}`);
  }
}

export const tasksService = new TasksService();
