// ============================================================
// DIRECTADMIN TASKS SERVICE - API isolée (DUPLIQUÉE VOLONTAIREMENT)
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { Task } from "../../directadmin.types";

/** Récupère les tâches d'une licence DirectAdmin */
export async function getTasks(licenseId: string): Promise<Task[]> {
  const ids = await ovhGet<number[]>(`/license/directadmin/${licenseId}/tasks`);
  const tasks = await Promise.all(
    ids.map((id) => ovhGet<Task>(`/license/directadmin/${licenseId}/tasks/${id}`))
  );
  return tasks.sort((a, b) => {
    const da = a.startDate ? new Date(a.startDate).getTime() : 0;
    const db = b.startDate ? new Date(b.startDate).getTime() : 0;
    return db - da;
  });
}

/** Formate une date pour l'affichage */
export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("fr-FR");
};

/** Retourne l'icône correspondant au statut */
export const getStatusIcon = (status: Task["status"]): string => {
  const icons: Record<string, string> = {
    done: "✅",
    doing: "⏳",
    todo: "📋",
    error: "❌",
    cancelled: "🚫",
  };
  return icons[status] || "❓";
};
