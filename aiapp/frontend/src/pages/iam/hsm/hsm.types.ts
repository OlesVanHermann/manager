// ============================================================
// HSM TYPES - Types partagés pour le module HSM
// ============================================================

/** Informations générales d'un HSM */
export interface Hsm {
  id: string;
  name: string;
  model: string;
  region: string;
  state: string;
  ip: string;
  createdAt: string;
}

/** Partition HSM */
export interface Partition {
  id: string;
  name: string;
  serialNumber: string;
  state: "active" | "inactive" | "error";
  usedStorage: number;
  totalStorage: number;
  objectCount: number;
  createdAt: string;
}

/** Tâche HSM */
export interface Task {
  id: string;
  function: string;
  status: "done" | "doing" | "todo" | "error" | "cancelled";
  startDate?: string;
  doneDate?: string;
  comment?: string;
}
