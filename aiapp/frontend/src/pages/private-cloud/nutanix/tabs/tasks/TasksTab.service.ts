// ============================================================
// TASKS TAB SERVICE - Isolé pour Nutanix Tasks
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { NutanixTask } from "../../nutanix.types";

// ========================================
// HELPERS LOCAUX (dupliqués volontairement)
// ========================================

export const getTaskStatusBadgeClass = (status: string): string => {
  const classes: Record<string, string> = {
    COMPLETED: "badge-success",
    RUNNING: "badge-info",
    PENDING: "badge-warning",
    FAILED: "badge-error",
    CANCELLED: "badge-secondary",
  };
  return classes[status] || "";
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatProgress = (progress: number): string => {
  return `${Math.round(progress)}%`;
};

// ========================================
// SERVICE TASKS - ISOLÉ
// ========================================

export const tasksService = {
  /**
   * Liste toutes les tâches d'un cluster Nutanix
   */
  getTasks: async (serviceName: string): Promise<NutanixTask[]> => {
    const taskIds = await ovhGet<string[]>(`/nutanix/${serviceName}/tasks`);
    const tasks = await Promise.all(
      taskIds.slice(0, 50).map((taskId) =>
        ovhGet<NutanixTask>(`/nutanix/${serviceName}/tasks/${taskId}`)
      )
    );
    // Tri par date décroissante
    return tasks.sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  },

  /**
   * Récupère une tâche spécifique
   */
  getTask: (serviceName: string, taskId: string): Promise<NutanixTask> =>
    ovhGet<NutanixTask>(`/nutanix/${serviceName}/tasks/${taskId}`),
};
