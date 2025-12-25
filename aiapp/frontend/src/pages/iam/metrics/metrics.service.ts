// ============================================================
// METRICS SERVICE - Service pour la page principale
// ============================================================

import { ovhGet } from "../../../services/api";
import type { MetricsService } from "./metrics.types";

/** Récupère les détails d'un service Metrics. */
export async function getService(serviceName: string): Promise<MetricsService> {
  return ovhGet<MetricsService>(`/metrics/${serviceName}`);
}
