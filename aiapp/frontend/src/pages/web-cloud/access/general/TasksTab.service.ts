// ============================================================
// SERVICE TASKS TAB - Isolé pour historique des tâches
// ============================================================

import { ovhApi } from '../../../../services/api';
import type { Task } from '../connections.types';

// ---------- SERVICE ----------

export const tasksService = {
  /** Tâches connexion. */
  async getTasks(connectionId: string): Promise<Task[]> {
    const ids = await ovhApi.get<number[]>(`/pack/xdsl/${connectionId}/tasks`);
    return Promise.all(ids.map(id =>
      ovhApi.get<Task>(`/pack/xdsl/${connectionId}/tasks/${id}`)
    ));
  },
};
