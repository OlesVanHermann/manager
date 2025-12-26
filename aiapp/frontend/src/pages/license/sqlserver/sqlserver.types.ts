// ============================================================
// SQLSERVER TYPES - Types spécifiques SQL Server (ISOLÉS)
// ============================================================

export interface SqlServerLicense {
  id: string;
  ip: string;
  version: string;
  licenseId: string;
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
