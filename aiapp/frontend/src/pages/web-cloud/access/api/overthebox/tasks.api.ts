// ============================================================
// API OVERTHEBOX TASKS - Tâches
// Aligné avec old_manager: OvhApiOverTheBox (tasks)
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface OtbTask {
  taskId: string;
  name: string;
  status: 'todo' | 'doing' | 'done' | 'error' | 'cancelled';
  todoDate: string;
  doneDate?: string;
  lastUpdate?: string;
  progress?: number;
}

// ---------- API ----------

export const otbTasksApi = {
  /** Liste les IDs des tâches. */
  async list(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/overTheBox/${serviceName}/tasks`);
  },

  /** Récupère une tâche. */
  async get(serviceName: string, taskId: string): Promise<OtbTask> {
    return ovhApi.get<OtbTask>(`/overTheBox/${serviceName}/tasks/${taskId}`);
  },

  /** Liste toutes les tâches avec détails (limité à 50). */
  async getAll(serviceName: string, limit: number = 50): Promise<OtbTask[]> {
    const ids = await this.list(serviceName);
    const limitedIds = ids.slice(0, limit);
    const tasks = await Promise.all(limitedIds.map(id => this.get(serviceName, id)));
    return tasks.sort((a, b) => new Date(b.todoDate).getTime() - new Date(a.todoDate).getTime());
  },
};
