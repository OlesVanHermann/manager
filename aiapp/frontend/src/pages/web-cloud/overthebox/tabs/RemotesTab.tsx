import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as otbService from "../../../../services/web-cloud.overthebox";

interface Remote { remoteId: string; publicIp?: string; status: string; lastSeen?: string; exposedPort: number; }
interface RemotesTabProps { serviceId: string; }

export default function RemotesTab({ serviceId }: RemotesTabProps) {
  const { t } = useTranslation("web-cloud/overthebox/index");
  const { t: tCommon } = useTranslation("common");
  const [remotes, setRemotes] = useState<Remote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadRemotes(); }, [serviceId]);

  const loadRemotes = async () => {
    try { setLoading(true); setError(null); const data = await otbService.getRemotes(serviceId); setRemotes(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { active: "badge-success", inactive: "badge-error" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadRemotes}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="remotes-tab">
      <div className="tab-toolbar"><h2>{t("remotes.title")}</h2><button className="btn btn-primary">{t("remotes.add")}</button></div>
      {remotes.length === 0 ? (
        <div className="empty-state"><h2>{t("remotes.empty.title")}</h2><p>{t("remotes.empty.description")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("remotes.columns.id")}</th><th>{t("remotes.columns.ip")}</th><th>{t("remotes.columns.port")}</th><th>{t("remotes.columns.status")}</th><th>{t("remotes.columns.lastSeen")}</th><th>{t("remotes.columns.actions")}</th></tr></thead>
          <tbody>
            {remotes.map((remote) => (
              <tr key={remote.remoteId}>
                <td className="mono">{remote.remoteId}</td>
                <td className="mono">{remote.publicIp || "-"}</td>
                <td>{remote.exposedPort}</td>
                <td>{getStatusBadge(remote.status)}</td>
                <td>{remote.lastSeen ? new Date(remote.lastSeen).toLocaleString("fr-FR") : "-"}</td>
                <td className="item-actions"><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
