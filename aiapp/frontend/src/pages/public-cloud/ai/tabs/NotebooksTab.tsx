import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as aiService from "../../../../services/public-cloud.ai";

interface Notebook { id: string; name?: string; framework: string; status: string; url?: string; createdAt: string; }
interface NotebooksTabProps { projectId: string; }

export default function NotebooksTab({ projectId }: NotebooksTabProps) {
  const { t } = useTranslation("public-cloud/ai/index");
  const { t: tCommon } = useTranslation("common");
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadNotebooks(); }, [projectId]);

  const loadNotebooks = async () => {
    try { setLoading(true); setError(null); const data = await aiService.getNotebooks(projectId); setNotebooks(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { RUNNING: "badge-success", STARTING: "badge-warning", STOPPED: "badge-secondary", ERROR: "badge-error" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadNotebooks}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="notebooks-tab">
      <div className="tab-toolbar"><h2>{t("notebooks.title")}</h2><button className="btn btn-primary">{t("notebooks.create")}</button></div>
      {notebooks.length === 0 ? (
        <div className="empty-state"><h2>{t("notebooks.empty.title")}</h2><p>{t("notebooks.empty.description")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("notebooks.columns.name")}</th><th>{t("notebooks.columns.framework")}</th><th>{t("notebooks.columns.status")}</th><th>{t("notebooks.columns.created")}</th><th>{t("notebooks.columns.actions")}</th></tr></thead>
          <tbody>
            {notebooks.map((nb) => (
              <tr key={nb.id}>
                <td>{nb.name || nb.id}</td><td>{nb.framework}</td><td>{getStatusBadge(nb.status)}</td><td>{new Date(nb.createdAt).toLocaleDateString("fr-FR")}</td>
                <td className="item-actions">
                  {nb.url && <a href={nb.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">{t("notebooks.actions.open")}</a>}
                  <button className="btn btn-sm btn-outline">{nb.status === "RUNNING" ? t("notebooks.actions.stop") : t("notebooks.actions.start")}</button>
                  <button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
