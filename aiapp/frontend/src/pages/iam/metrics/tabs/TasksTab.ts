// ============================================================
// TASKS TAB SERVICE - Service API isolé pour l'onglet Tasks
// ============================================================
// ⚠️ DÉFACTORISÉ : Ce service est ISOLÉ et ne doit JAMAIS être
// importé par un autre tab. Duplication volontaire.
// ============================================================

import { ovhGet } from "../../../../services/api";
import type { Task } from "../metrics.types";

// ============================================================
// API TASKS
// ============================================================

/** Récupère la liste des tâches d'un service. */
export async function getTasks(serviceName: string): Promise<Task[]> {
  const ids = await ovhGet<number[]>(`/metrics/${serviceName}/task`);
  const tasks = await Promise.all(
    ids.map((id) => ovhGet<Task>(`/metrics/${serviceName}/task/${id}`))
  );
  return tasks.sort((a, b) => {
    const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
    const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
    return dateB - dateA;
  });
}

/** Récupère les détails d'une tâche. */
export async function getTask(serviceName: string, taskId: number): Promise<Task> {
  return ovhGet<Task>(`/metrics/${serviceName}/task/${taskId}`);
}

// ============================================================
// HELPERS (isolés pour ce tab)
// ============================================================

/** Retourne l'icône pour un statut de tâche. */
export function getStatusIcon(status: Task["status"]): string {
  const icons: Record<string, string> = {
    done: "✅",
    doing: "⏳",
    todo: "📋",
    error: "❌",
    cancelled: "🚫",
  };
  return icons[status] || "❓";
}

/** Formate une date en français avec heure. */
export function formatDateTime(dateStr?: string): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("fr-FR");
}

// ============================================================
// SERVICE OBJECT (alternative export)
// ============================================================

export const tasksService = {
  getTasks,
  getTask,
  getStatusIcon,
  formatDateTime,
};
