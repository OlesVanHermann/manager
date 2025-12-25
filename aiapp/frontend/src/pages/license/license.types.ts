// ============================================================
// LICENSE TYPES - Types communs à toutes les licences
// ============================================================

/** Compteur pour le dashboard */
export interface LicenseCount {
  type: string;
  count: number;
  icon: string;
}

/** Tâche asynchrone */
export interface Task {
  id: number;
  action: string;
  status: "done" | "doing" | "todo" | "error" | "cancelled";
  startDate?: string;
  doneDate?: string;
}
