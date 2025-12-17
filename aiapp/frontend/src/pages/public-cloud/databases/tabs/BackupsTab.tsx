import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as dbService from "../../../../services/public-cloud.databases";

interface Backup { id: string; description?: string; status: string; createdAt: string; size: number; }
interface BackupsTabProps { projectId: string; engine: string; serviceId: string; }

export default function BackupsTab({ projectId, engine, serviceId }: BackupsTabProps) {
  const { t } = useTranslation("public-cloud/databases/index");
  const { t: tCommon } = useTranslation("common");
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadBackups(); }, [projectId, engine, serviceId]);

  const loadBackups = async () => {
    try { setLoading(true); setError(null); const data = await dbService.getBackups(projectId, engine, serviceId); setBackups(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
    return `${bytes} B`;
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { READY: "badge-success", CREATING: "badge-warning", ERROR: "badge-error" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadBackups}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="backups-tab">
      <div className="tab-toolbar"><h2>{t("backups.title")}</h2><button className="btn btn-primary">{t("backups.create")}</button></div>
      {backups.length === 0 ? (
        <div className="empty-state"><h2>{t("backups.empty.title")}</h2></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("backups.columns.date")}</th><th>{t("backups.columns.size")}</th><th>{t("backups.columns.status")}</th><th>{t("backups.columns.actions")}</th></tr></thead>
          <tbody>
            {backups.map((backup) => (
              <tr key={backup.id}><td>{new Date(backup.createdAt).toLocaleString("fr-FR")}</td><td>{formatSize(backup.size)}</td><td>{getStatusBadge(backup.status)}</td><td className="item-actions"><button className="btn btn-sm btn-outline">{t("backups.actions.restore")}</button><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
