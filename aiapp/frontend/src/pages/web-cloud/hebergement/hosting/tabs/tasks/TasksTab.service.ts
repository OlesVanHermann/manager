// ============================================================
// TASKS TAB SERVICE - API calls for TasksTab
// ============================================================

import { ovhGet } from "../../../../../../services/api";
import type { HostingTask } from "../../hosting.types";

const BASE = "/hosting/web";

export const tasksService = {
  // --- Tasks ---
  listTasks: (sn: string) => 
    ovhGet<number[]>(`${BASE}/${sn}/tasks`),

  getTask: (sn: string, id: number) => 
    ovhGet<HostingTask>(`${BASE}/${sn}/tasks/${id}`),

  // --- Helper: Get all tasks with details ---
  getAllTasks: async (sn: string): Promise<HostingTask[]> => {
    const ids = await ovhGet<number[]>(`${BASE}/${sn}/tasks`);
    if (ids.length === 0) return [];
    return Promise.all(ids.map(id => ovhGet<HostingTask>(`${BASE}/${sn}/tasks/${id}`)));
  },

  // --- Helper: Get recent tasks (last N) ---
  getRecentTasks: async (sn: string, limit = 10): Promise<HostingTask[]> => {
    const ids = await ovhGet<number[]>(`${BASE}/${sn}/tasks`);
    const recentIds = ids.slice(-limit).reverse();
    if (recentIds.length === 0) return [];
    return Promise.all(recentIds.map(id => ovhGet<HostingTask>(`${BASE}/${sn}/tasks/${id}`)));
  },
};

export default tasksService;
