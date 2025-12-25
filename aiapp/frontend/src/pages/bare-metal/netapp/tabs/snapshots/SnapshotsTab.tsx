import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { snapshotsService } from "./SnapshotsTab";
import type { NetAppSnapshot } from "../../netapp.types";
import "./SnapshotsTab.css";
interface SnapshotsTabProps { serviceId: string; }
export default function SnapshotsTab({ serviceId }: SnapshotsTabProps) {
  const { t } = useTranslation("bare-metal/netapp/index");
  const { t: tCommon } = useTranslation("common");
  const [snapshots, setSnapshots] = useState<NetAppSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { loadSnapshots(); }, [serviceId]);
  const loadSnapshots = async () => {
    try { setLoading(true); setError(null); const data = await snapshotsService.getSnapshots(serviceId); setSnapshots(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };
  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadSnapshots}>{tCommon("actions.retry")}</button></div>;
  return (
    <div className="snapshots-tab">
      <div className="tab-toolbar"><h2>{t("snapshots.title")}</h2><button className="btn btn-primary">{t("snapshots.create")}</button></div>
      {snapshots.length === 0 ? (<div className="empty-state"><h2>{t("snapshots.empty.title")}</h2></div>) : (
        <table className="snapshots-data-table">
          <thead><tr><th>{t("snapshots.columns.name")}</th><th>{t("snapshots.columns.volume")}</th><th>{t("snapshots.columns.created")}</th><th>{t("snapshots.columns.actions")}</th></tr></thead>
          <tbody>{snapshots.map((s) => (<tr key={s.id}><td className="mono">{s.name}</td><td>{s.volumeName}</td><td>{new Date(s.createdAt).toLocaleString("fr-FR")}</td><td className="snapshots-item-actions"><button className="btn btn-sm btn-outline">{t("snapshots.restore")}</button><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></td></tr>))}</tbody>
        </table>
      )}
    </div>
  );
}
