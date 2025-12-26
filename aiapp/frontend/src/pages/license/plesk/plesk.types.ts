// ============================================================
// PLESK TYPES - Types spécifiques Plesk (ISOLÉS)
// ============================================================

export interface PleskLicense {
  id: string;
  ip: string;
  version: string;
  domainNumber: number;
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
