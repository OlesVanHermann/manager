// ============================================================
// DASHBOARDS TAB - Gestion des dashboards Graylog
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as logsService from "../../../../services/iam.dbaas-logs";

// ============================================================
// TYPES
// ============================================================

interface Dashboard {
  dashboardId: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isEditable: boolean;
}

interface DashboardsTabProps {
  serviceId: string;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Gestion des dashboards Graylog. */
export default function DashboardsTab({ serviceId }: DashboardsTabProps) {
  const { t } = useTranslation("iam/dbaas-logs/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadDashboards();
  }, [serviceId]);

  // ---------- LOADERS ----------
  const loadDashboards = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await logsService.getDashboards(serviceId);
      setDashboards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleDelete = async (dashboardId: string) => {
    if (!confirm(t("dashboards.confirmDelete"))) return;
    try {
      await logsService.deleteDashboard(serviceId, dashboardId);
      loadDashboards();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadDashboards}>{tCommon("actions.retry")}</button>
      </div>
    );
  }

  return (
    <div className="dashboards-tab">
      <div className="tab-toolbar">
        <h2>{t("dashboards.title")}</h2>
        <button className="btn btn-primary">{t("dashboards.create")}</button>
      </div>

      {dashboards.length === 0 ? (
        <div className="empty-state">
          <h2>{t("dashboards.empty.title")}</h2>
          <p>{t("dashboards.empty.description")}</p>
        </div>
      ) : (
        <table className="logs-table">
          <thead>
            <tr>
              <th>{t("dashboards.columns.title")}</th>
              <th>{t("dashboards.columns.description")}</th>
              <th>{t("dashboards.columns.editable")}</th>
              <th>{t("dashboards.columns.updated")}</th>
              <th>{t("dashboards.columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {dashboards.map((dashboard) => (
              <tr key={dashboard.dashboardId}>
                <td>
                  <div className="dashboard-title">{dashboard.title}</div>
                  <div className="dashboard-id" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>{dashboard.dashboardId}</div>
                </td>
                <td>{dashboard.description || "-"}</td>
                <td>{dashboard.isEditable ? "✅" : "🔒"}</td>
                <td>{new Date(dashboard.updatedAt).toLocaleDateString("fr-FR")}</td>
                <td className="item-actions">
                  <button className="btn btn-sm btn-outline">{t("dashboards.open")}</button>
                  {dashboard.isEditable && (
                    <button className="btn btn-sm btn-outline btn-danger" onClick={() => handleDelete(dashboard.dashboardId)}>{tCommon("actions.delete")}</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
