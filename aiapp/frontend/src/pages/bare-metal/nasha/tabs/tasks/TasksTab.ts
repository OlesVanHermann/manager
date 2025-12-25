// ============================================================
// NASHA SERVICE ISOLÉ : TasksTab
// ============================================================

import { ovhApi } from "../../../../../services/api";
import type { NashaTask } from "../../nasha.types";

class TasksService {
  async getTasks(serviceName: string): Promise<NashaTask[]> {
    const ids = await ovhApi.get<number[]>(`/dedicated/nasha/${serviceName}/task`);
    return Promise.all(ids.slice(0, 50).map((id) => ovhApi.get<NashaTask>(`/dedicated/nasha/${serviceName}/task/${id}`)));
  }
}

export const tasksService = new TasksService();
