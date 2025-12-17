import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as aiService from "../../../../services/public-cloud.ai";

interface App { id: string; name?: string; image: string; status: string; url?: string; replicas: number; createdAt: string; }
interface AppsTabProps { projectId: string; }

export default function AppsTab({ projectId }: AppsTabProps) {
  const { t } = useTranslation("public-cloud/ai/index");
  const { t: tCommon } = useTranslation("common");
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadApps(); }, [projectId]);

  const loadApps = async () => {
    try { setLoading(true); setError(null); const data = await aiService.getApps(projectId); setApps(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { RUNNING: "badge-success", SCALING: "badge-info", STOPPED: "badge-secondary", ERROR: "badge-error" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadApps}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="apps-tab">
      <div className="tab-toolbar"><h2>{t("apps.title")}</h2><button className="btn btn-primary">{t("apps.create")}</button></div>
      {apps.length === 0 ? (
        <div className="empty-state"><h2>{t("apps.empty.title")}</h2><p>{t("apps.empty.description")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("apps.columns.name")}</th><th>{t("apps.columns.replicas")}</th><th>{t("apps.columns.status")}</th><th>{t("apps.columns.actions")}</th></tr></thead>
          <tbody>
            {apps.map((app) => (
              <tr key={app.id}><td>{app.name || app.id}</td><td>{app.replicas}</td><td>{getStatusBadge(app.status)}</td><td className="item-actions">{app.url && <a href={app.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">{t("apps.actions.open")}</a>}<button className="btn btn-sm btn-outline">{t("apps.actions.scale")}</button><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
