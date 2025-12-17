import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as instancesService from "../../../../services/public-cloud.instances";

interface Snapshot { id: string; name: string; status: string; size: number; createdAt: string; }
interface SnapshotsTabProps { projectId: string; instanceId: string; }

export default function SnapshotsTab({ projectId, instanceId }: SnapshotsTabProps) {
  const { t } = useTranslation("public-cloud/instances/index");
  const { t: tCommon } = useTranslation("common");
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadSnapshots(); }, [projectId, instanceId]);

  const loadSnapshots = async () => {
    try { setLoading(true); setError(null); const data = await instancesService.getSnapshots(projectId, instanceId); setSnapshots(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const formatSize = (bytes: number) => bytes >= 1e9 ? `${(bytes / 1e9).toFixed(2)} GB` : bytes >= 1e6 ? `${(bytes / 1e6).toFixed(2)} MB` : `${bytes} B`;

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { active: "badge-success", queued: "badge-warning", saving: "badge-info" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  const handleCreate = async () => {
    const name = prompt(t("snapshots.promptName"));
    if (!name) return;
    try {
      await instancesService.createSnapshot(projectId, instanceId, name);
      loadSnapshots();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadSnapshots}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="snapshots-tab">
      <div className="tab-toolbar"><h2>{t("snapshots.title")}</h2><button className="btn btn-primary" onClick={handleCreate}>{t("snapshots.create")}</button></div>
      {snapshots.length === 0 ? (
        <div className="empty-state"><h2>{t("snapshots.empty.title")}</h2><p>{t("snapshots.empty.description")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("snapshots.columns.name")}</th><th>{t("snapshots.columns.size")}</th><th>{t("snapshots.columns.status")}</th><th>{t("snapshots.columns.created")}</th><th>{t("snapshots.columns.actions")}</th></tr></thead>
          <tbody>
            {snapshots.map((snap) => (
              <tr key={snap.id}><td>{snap.name}</td><td>{formatSize(snap.size)}</td><td>{getStatusBadge(snap.status)}</td><td>{new Date(snap.createdAt).toLocaleDateString("fr-FR")}</td><td className="item-actions"><button className="btn btn-sm btn-outline">{t("snapshots.actions.createInstance")}</button><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
