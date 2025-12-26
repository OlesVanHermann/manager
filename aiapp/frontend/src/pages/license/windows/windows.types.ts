// ============================================================
// WINDOWS TYPES - Types spécifiques Windows (ISOLÉS)
// ============================================================

export interface WindowsLicense {
  id: string;
  ip: string;
  version: string;
  sqlVersion?: string;
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
