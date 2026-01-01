// ============================================================
// TASKS TAB SERVICE - API calls for TasksTab
// ============================================================

import { ovhGet, ovhIceberg, type IcebergResult } from "../../../../../services/api";
import type { HostingTask } from "../../hosting.types";

const BASE = "/hosting/web";

export const tasksService = {
  // --- Tasks ---
  listTasks: (sn: string) =>
    ovhGet<number[]>(`${BASE}/${sn}/tasks`),

  getTask: (sn: string, id: number) =>
    ovhGet<HostingTask>(`${BASE}/${sn}/tasks/${id}`),

  // --- Iceberg pagination (from old_manager) ---
  getTasksIceberg: (sn: string, page = 1, pageSize = 25): Promise<IcebergResult<HostingTask>> =>
    ovhIceberg<HostingTask>(`${BASE}/${sn}/tasks`, { page, pageSize }),

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

  // --- Tasks by function and status (from old_manager) ---
  getTasksByFunction: (sn: string, func: string, status?: string) =>
    ovhGet<number[]>(`${BASE}/${sn}/tasks`, {
      params: { function: func, ...(status && { status }) },
    } as any),

  // --- Polling helper (from old_manager) ---
  pollTask: async (
    sn: string,
    taskId: number,
    options: { interval?: number; maxAttempts?: number; onProgress?: (task: HostingTask) => void } = {}
  ): Promise<HostingTask> => {
    const { interval = 5000, maxAttempts = 120, onProgress } = options;

    for (let i = 0; i < maxAttempts; i++) {
      const task = await ovhGet<HostingTask>(`${BASE}/${sn}/tasks/${taskId}`);

      if (onProgress) onProgress(task);

      if (task.state === "done" || task.state === "cancelled") {
        return task;
      }

      if (task.state === "error") {
        throw new Error(`Task ${taskId} failed`);
      }

      await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error(`Timeout waiting for task ${taskId}`);
  },

  // --- Check if unique task exists (from old_manager) ---
  checkTaskUnique: async (sn: string, func: string): Promise<number[]> => {
    const statuses = ["init", "doing", "todo"];
    const results = await Promise.all(
      statuses.map(status =>
        ovhGet<number[]>(`${BASE}/${sn}/tasks`, {
          params: { function: func, status },
        } as any).catch(() => [])
      )
    );
    return results.flat();
  },
};

export default tasksService;
