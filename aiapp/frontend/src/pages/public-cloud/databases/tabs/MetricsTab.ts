// ============================================================
// PUBLIC-CLOUD / DATABASES / METRICS - Service ISOLÉ
// ============================================================

import { ovhGet } from "../../../../services/api";

// ======================== Types locaux ========================

export interface MetricsData {
  cpu: number;
  memory: number;
  storage: number;
  connections: number;
}

// ======================== API ========================

export async function getMetrics(projectId: string, engine: string, serviceId: string): Promise<MetricsData> {
  return ovhGet<MetricsData>(`/cloud/project/${projectId}/database/${engine}/${serviceId}/metrics`).catch(() => ({
    cpu: 0,
    memory: 0,
    storage: 0,
    connections: 0,
  }));
}

// ======================== Helpers (DUPLIQUÉS) ========================

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatMetricValue(value: number, unit: string): string {
  if (value === 0) return "--";
  return `${value}${unit}`;
}
