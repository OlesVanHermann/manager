// ============================================================
// DIRECTADMIN TYPES - Types spécifiques DirectAdmin (ISOLÉS)
// ============================================================

export interface DirectAdminLicense {
  id: string;
  ip: string;
  version: string;
  os: string;
  status: string;
  createdAt: string;
}

/** Type Task DUPLIQUÉ pour isolation totale */
export interface Task {
  id: number;
  action: string;
  status: "done" | "doing" | "todo" | "error" | "cancelled";
  startDate?: string;
  doneDate?: string;
}
