// ============================================================
// CPANEL TYPES - Types spécifiques cPanel (ISOLÉS)
// ============================================================

export interface CpanelLicense {
  id: string;
  ip: string;
  version: string;
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
