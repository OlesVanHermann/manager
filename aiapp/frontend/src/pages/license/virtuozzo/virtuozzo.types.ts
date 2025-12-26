// ============================================================
// VIRTUOZZO TYPES - Types spécifiques Virtuozzo (ISOLÉS)
// ============================================================

export interface VirtuozzoLicense {
  id: string;
  ip: string;
  version: string;
  containerNumber: number;
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
