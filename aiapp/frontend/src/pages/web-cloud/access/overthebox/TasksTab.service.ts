// ============================================================
// SERVICE TASKS - Isolé pour TasksTab (OverTheBox)
// ============================================================

import { ovhApi } from '../../../../services/api';
import type { Task } from '../overthebox.types';

class TasksService {
  /** Récupère les tâches d'un service OverTheBox. */
  async getTasks(serviceName: string): Promise<Task[]> {
    const ids = await ovhApi.get<string[]>(`/overTheBox/${serviceName}/tasks`);
    const tasks = await Promise.all(
      ids.slice(0, 50).map(id => ovhApi.get<Task>(`/overTheBox/${serviceName}/tasks/${id}`))
    );
    return tasks.sort((a, b) => new Date(b.todoDate).getTime() - new Date(a.todoDate).getTime());
  }
}

export const tasksService = new TasksService();
