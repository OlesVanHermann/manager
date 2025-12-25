// ============================================================
// DASHBOARDS TAB SERVICE - Service API isolé pour l'onglet Dashboards
// ============================================================
// ⚠️ DÉFACTORISÉ : Ce service est ISOLÉ et ne doit JAMAIS être
// importé par un autre tab. Duplication volontaire.
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";
import type { Dashboard } from "../dbaas-logs.types";

// ============================================================
// API DASHBOARDS
// ============================================================

/** Récupère la liste des dashboards d'un service. */
export async function getDashboards(serviceName: string): Promise<Dashboard[]> {
  const ids = await ovhGet<string[]>(`/dbaas/logs/${serviceName}/output/graylog/dashboard`);
  const dashboards = await Promise.all(
    ids.map((id) => ovhGet<Dashboard>(`/dbaas/logs/${serviceName}/output/graylog/dashboard/${id}`))
  );
  return dashboards;
}

/** Crée un nouveau dashboard. */
export async function createDashboard(
  serviceName: string,
  data: { title: string; description?: string }
): Promise<Dashboard> {
  return ovhPost<Dashboard>(`/dbaas/logs/${serviceName}/output/graylog/dashboard`, data);
}

/** Supprime un dashboard. */
export async function deleteDashboard(serviceName: string, dashboardId: string): Promise<void> {
  return ovhDelete(`/dbaas/logs/${serviceName}/output/graylog/dashboard/${dashboardId}`);
}

// ============================================================
// SERVICE OBJECT
// ============================================================

export const dashboardsService = {
  getDashboards,
  createDashboard,
  deleteDashboard,
};
