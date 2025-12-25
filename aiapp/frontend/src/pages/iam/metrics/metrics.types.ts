// ============================================================
// METRICS TYPES - Types partagés pour le module Metrics
// ============================================================

/** Informations générales d'un service Metrics */
export interface MetricsService {
  serviceName: string;
  displayName?: string;
  region: string;
  type: string;
  status: string;
  quota: {
    current: number;
    max: number;
  };
  createdAt: string;
}

/** Token d'accès Metrics */
export interface Token {
  id: string;
  description?: string;
  type: "read" | "write";
  access: string;
  isRevoked: boolean;
  createdAt: string;
  expiresAt?: string;
}

/** Tâche Metrics */
export interface Task {
  id: number;
  function: string;
  status: "done" | "doing" | "todo" | "error" | "cancelled";
  startDate?: string;
  doneDate?: string;
}
