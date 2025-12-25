// ============================================================
// DASHBOARDS TAB - Gestion des dashboards Graylog
// ============================================================
// ⚠️ DÉFACTORISÉ : Imports locaux uniquement
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as dashboardsService from "./DashboardsTab";
import type { Dashboard } from "../dbaas-logs.types";
import "./DashboardsTab.css";

interface DashboardsTabProps { serviceId: string; }

export default function DashboardsTab({ serviceId }: DashboardsTabProps) {
  const { t } = useTranslation("iam/dbaas-logs/index");
  const { t: tCommon } = useTranslation("common");

  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadDashboards(); }, [serviceId]);

  const loadDashboards = async () => {
    try { setLoading(true); setError(null); const data = await dashboardsService.getDashboards(serviceId); setDashboards(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur inconnue"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (dashboardId: string) => {
    if (!confirm(t("dashboards.confirmDelete"))) return;
    try { await dashboardsService.deleteDashboard(serviceId, dashboardId); loadDashboards(); }
    catch (err) { alert(err instanceof Error ? err.message : "Erreur"); }
  };

  if (loading) return <div className="dashboards-loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="dashboards-error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadDashboards}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="dashboards-tab">
      <div className="dashboards-toolbar"><h2>{t("dashboards.title")}</h2><button className="btn btn-primary">{t("dashboards.create")}</button></div>
      {dashboards.length === 0 ? (
        <div className="dashboards-empty-state"><h2>{t("dashboards.empty.title")}</h2><p>{t("dashboards.empty.description")}</p></div>
      ) : (
        <table className="dashboards-table">
          <thead><tr><th>{t("dashboards.columns.title")}</th><th>{t("dashboards.columns.description")}</th><th>{t("dashboards.columns.editable")}</th><th>{t("dashboards.columns.updated")}</th><th>{t("dashboards.columns.actions")}</th></tr></thead>
          <tbody>
            {dashboards.map((d) => (
              <tr key={d.dashboardId}>
                <td><div className="dashboards-title">{d.title}</div><div className="dashboards-id">{d.dashboardId}</div></td>
                <td>{d.description || "-"}</td><td>{d.isEditable ? "✅" : "🔒"}</td><td>{new Date(d.updatedAt).toLocaleDateString("fr-FR")}</td>
                <td className="dashboards-actions"><button className="btn btn-sm btn-outline">{t("dashboards.open")}</button>{d.isEditable && <button className="btn btn-sm btn-outline btn-danger" onClick={() => handleDelete(d.dashboardId)}>{tCommon("actions.delete")}</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
