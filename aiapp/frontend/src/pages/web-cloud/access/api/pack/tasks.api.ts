// ============================================================
// API PACK TASKS - Tâches du pack
// Aligné avec old_manager: OvhApiPackXdslTask
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface PackTask {
  id: number;
  function: string;
  status: 'todo' | 'doing' | 'done' | 'error' | 'cancelled';
  todoDate: string;
  doneDate?: string;
  updateDate?: string;
}

// ---------- API ----------

export const packTasksApi = {
  /** Liste les IDs des tâches. */
  async list(packName: string, functionFilter?: string): Promise<number[]> {
    const url = functionFilter
      ? `/pack/xdsl/${packName}/tasks?function=${functionFilter}`
      : `/pack/xdsl/${packName}/tasks`;
    return ovhApi.get<number[]>(url);
  },

  /** Récupère une tâche spécifique. */
  async get(packName: string, taskId: number): Promise<PackTask> {
    return ovhApi.get<PackTask>(`/pack/xdsl/${packName}/tasks/${taskId}`);
  },

  /** Récupère toutes les tâches avec détails. */
  async getAll(packName: string): Promise<PackTask[]> {
    const ids = await this.list(packName);
    return Promise.all(ids.map(id => this.get(packName, id)));
  },

  /** Vérifie s'il y a un déménagement en attente. */
  async hasPendingAddressMove(packName: string): Promise<boolean> {
    const ids = await this.list(packName, 'pendingAddressMove');
    return ids.length > 0;
  },
};
