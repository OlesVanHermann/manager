import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as netappService from "../../../../services/bare-metal.netapp";

interface Snapshot { id: string; name: string; volumeId: string; volumeName: string; createdAt: string; }
interface SnapshotsTabProps { serviceId: string; }

export default function SnapshotsTab({ serviceId }: SnapshotsTabProps) {
  const { t } = useTranslation("bare-metal/netapp/index");
  const { t: tCommon } = useTranslation("common");
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadSnapshots(); }, [serviceId]);

  const loadSnapshots = async () => {
    try { setLoading(true); setError(null); const data = await netappService.getSnapshots(serviceId); setSnapshots(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadSnapshots}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="snapshots-tab">
      <div className="tab-toolbar"><h2>{t("snapshots.title")}</h2><button className="btn btn-primary">{t("snapshots.create")}</button></div>
      {snapshots.length === 0 ? (
        <div className="empty-state"><h2>{t("snapshots.empty.title")}</h2><p>{t("snapshots.empty.description")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("snapshots.columns.name")}</th><th>{t("snapshots.columns.volume")}</th><th>{t("snapshots.columns.created")}</th><th>{t("snapshots.columns.actions")}</th></tr></thead>
          <tbody>
            {snapshots.map((snapshot) => (
              <tr key={snapshot.id}><td className="mono">{snapshot.name}</td><td>{snapshot.volumeName}</td><td>{new Date(snapshot.createdAt).toLocaleString("fr-FR")}</td><td className="item-actions"><button className="btn btn-sm btn-outline">{t("snapshots.restore")}</button><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
