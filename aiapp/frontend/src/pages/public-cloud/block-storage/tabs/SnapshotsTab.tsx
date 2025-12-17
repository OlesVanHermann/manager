import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as blockStorageService from "../../../../services/public-cloud.block-storage";

interface VolumeSnapshot { id: string; name: string; description?: string; size: number; status: string; createdAt: string; }
interface SnapshotsTabProps { projectId: string; volumeId: string; }

export default function SnapshotsTab({ projectId, volumeId }: SnapshotsTabProps) {
  const { t } = useTranslation("public-cloud/block-storage/index");
  const { t: tCommon } = useTranslation("common");
  const [snapshots, setSnapshots] = useState<VolumeSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadSnapshots(); }, [projectId, volumeId]);

  const loadSnapshots = async () => {
    try { setLoading(true); setError(null); const data = await blockStorageService.getVolumeSnapshots(projectId, volumeId); setSnapshots(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { available: "badge-success", creating: "badge-warning", error: "badge-error" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  const handleCreate = async () => {
    const name = prompt(t("snapshots.promptName"));
    if (!name) return;
    try {
      await blockStorageService.createVolumeSnapshot(projectId, volumeId, name);
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
              <tr key={snap.id}><td>{snap.name}</td><td>{snap.size} GB</td><td>{getStatusBadge(snap.status)}</td><td>{new Date(snap.createdAt).toLocaleDateString("fr-FR")}</td><td className="item-actions"><button className="btn btn-sm btn-outline">{t("snapshots.actions.createVolume")}</button><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
