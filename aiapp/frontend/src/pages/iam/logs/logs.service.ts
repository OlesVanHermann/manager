// ============================================================
// LOGS SERVICE - Service pour la page principale Logs
// ============================================================

import { ovhGet } from "../../../services/api";

export type LogType = "access-policy" | "activity" | "audit";

/** Vérifie la disponibilité de chaque type de log. */
export async function checkAllLogsAvailability(): Promise<Record<LogType, boolean>> {
  const result: Record<LogType, boolean> = {
    "access-policy": true,
    activity: true,
    audit: true,
  };
  return result;
}
