// ============================================================
// API XDSL TASKS - Tâches xDSL
// Aligné avec old_manager: OvhApiXdsl (tasks)
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface XdslTask {
  id: number;
  function: string;
  status: 'todo' | 'doing' | 'done' | 'error' | 'cancelled';
  todoDate: string;
  doneDate?: string;
  updateDate?: string;
}

// ---------- API ----------

export const xdslTasksApi = {
  /** Liste les IDs des tâches. */
  async list(accessName: string, functionFilter?: string): Promise<number[]> {
    const url = functionFilter
      ? `/xdsl/${accessName}/tasks?function=${functionFilter}`
      : `/xdsl/${accessName}/tasks`;
    return ovhApi.get<number[]>(url);
  },

  /** Récupère une tâche. */
  async get(accessName: string, taskId: number): Promise<XdslTask> {
    return ovhApi.get<XdslTask>(`/xdsl/${accessName}/tasks/${taskId}`);
  },

  /** Liste toutes les tâches avec détails. */
  async getAll(accessName: string): Promise<XdslTask[]> {
    const ids = await this.list(accessName);
    return Promise.all(ids.map(id => this.get(accessName, id)));
  },

  /** Vérifie les tâches de changement de statut mail. */
  async getMailSendingTasks(accessName: string): Promise<number[]> {
    return this.list(accessName, 'changeMailSendingStatus');
  },
};
