// ============================================================
// SERVICE ISOLÉ : TasksTab - Private Database
// ============================================================

import { apiClient } from "../../../../../../services/api";
import type { PdbTask } from "../../private-database.types";

const BASE_PATH = "/hosting/privateDatabase";

export const tasksService = {
  // ---------- LIST / GET ----------
  async listTasks(serviceName: string): Promise<number[]> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/tasks`);
  },

  async getTask(serviceName: string, taskId: number): Promise<PdbTask> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/tasks/${taskId}`);
  },
};
