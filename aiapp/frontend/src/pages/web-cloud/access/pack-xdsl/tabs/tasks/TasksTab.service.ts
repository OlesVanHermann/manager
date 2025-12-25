// ============================================================
// SERVICE TASKS - Isolé pour TasksTab (Pack xDSL)
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { Task } from '../../pack-xdsl.types';

class TasksService {
  /** Récupère les tâches d'un pack xDSL. */
  async getTasks(packName: string): Promise<Task[]> {
    const ids = await ovhApi.get<number[]>(`/pack/xdsl/${packName}/tasks`);
    const tasks = await Promise.all(
      ids.slice(0, 50).map(id => ovhApi.get<Task>(`/pack/xdsl/${packName}/tasks/${id}`))
    );
    return tasks.sort((a, b) => new Date(b.todoDate).getTime() - new Date(a.todoDate).getTime());
  }
}

export const tasksService = new TasksService();
