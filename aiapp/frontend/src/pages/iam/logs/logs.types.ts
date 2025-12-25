// ============================================================
// LOGS TYPES - Types partagés pour tous les tabs Logs
// ============================================================

export type LogType = "access-policy" | "activity" | "audit";

export interface LogEntry {
  timestamp: string;
  message: string;
  level?: string;
  kind?: string;
  [key: string]: unknown;
}

export interface LogSubscription {
  subscriptionId: string;
  serviceName: string;
  streamId: string;
  kind: string;
  createdAt: string;
}
