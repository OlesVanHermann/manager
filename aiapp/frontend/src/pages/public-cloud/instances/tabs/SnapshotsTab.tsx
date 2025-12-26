import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as snapshotsService from "./SnapshotsTab.service";
import "./SnapshotsTab.css";

interface Snapshot { id: string; name: string; status: string; size: number; createdAt: string; }
interface SnapshotsTabProps { projectId: string; instanceId: string; }

export default function SnapshotsTab({ projectId, instanceId }: SnapshotsTabProps) {
  const { t } = useTranslation("public-cloud/instances/snapshots");
  const { t: tCommon } = useTranslation("common");
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadSnapshots(); }, [projectId, instanceId]);

  const loadSnapshots = async () => {
    try { setLoading(true); setError(null); const data = await snapshotsService.getSnapshots(projectId, instanceId); setSnapshots(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const formatSize = (bytes: number) => bytes >= 1e9 ? `${(bytes / 1e9).toFixed(2)} GB` : bytes >= 1e6 ? `${(bytes / 1e6).toFixed(2)} MB` : `${bytes} B`;

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { active: "snapshots-badge-success", queued: "snapshots-badge-warning", saving: "snapshots-badge-info" };
    return <span className={`snapshots-status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  const handleCreate = async () => {
    const name = prompt(t("promptName"));
    if (!name) return;
    try {
      await snapshotsService.createSnapshot(projectId, instanceId, name);
      loadSnapshots();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  if (loading) return <div className="snapshots-loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="snapshots-error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadSnapshots}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="snapshots-tab">
      <div className="snapshots-toolbar"><h2>{t("title")}</h2><button className="btn btn-primary" onClick={handleCreate}>{t("create")}</button></div>
      {snapshots.length === 0 ? (
        <div className="snapshots-empty-state"><h2>{t("empty.title")}</h2><p>{t("empty.description")}</p></div>
      ) : (
        <table className="snapshots-data-table">
          <thead><tr><th>{t("columns.name")}</th><th>{t("columns.size")}</th><th>{t("columns.status")}</th><th>{t("columns.created")}</th><th>{t("columns.actions")}</th></tr></thead>
          <tbody>
            {snapshots.map((snap) => (
              <tr key={snap.id}><td>{snap.name}</td><td>{formatSize(snap.size)}</td><td>{getStatusBadge(snap.status)}</td><td>{new Date(snap.createdAt).toLocaleDateString("fr-FR")}</td><td className="snapshots-actions"><button className="btn btn-sm btn-outline">{t("actions.createInstance")}</button><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
