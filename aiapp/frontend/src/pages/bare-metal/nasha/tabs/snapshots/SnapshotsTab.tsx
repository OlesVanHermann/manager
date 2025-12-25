import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { snapshotsService } from "./SnapshotsTab";
import type { NashaSnapshot } from "../../nasha.types";
import "./SnapshotsTab.css";

interface SnapshotsTabProps { serviceId: string; }

export default function SnapshotsTab({ serviceId }: SnapshotsTabProps) {
  const { t } = useTranslation("bare-metal/nasha/index");
  const { t: tCommon } = useTranslation("common");
  const [snapshots, setSnapshots] = useState<NashaSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadSnapshots(); }, [serviceId]);

  const loadSnapshots = async () => {
    try { setLoading(true); setError(null); const data = await snapshotsService.getSnapshots(serviceId); setSnapshots(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = { manual: "badge-info", hourly: "badge-secondary", daily: "badge-primary", weekly: "badge-success" };
    return <span className={`status-badge ${colors[type] || ""}`}>{type}</span>;
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
          <thead><tr><th>{t("snapshots.columns.name")}</th><th>{t("snapshots.columns.partition")}</th><th>{t("snapshots.columns.type")}</th><th>{t("snapshots.columns.created")}</th><th>{t("snapshots.columns.actions")}</th></tr></thead>
          <tbody>
            {snapshots.map((snapshot, idx) => (
              <tr key={idx}><td className="mono">{snapshot.name}</td><td>{snapshot.partitionName}</td><td>{getTypeBadge(snapshot.type)}</td><td>{new Date(snapshot.createdAt).toLocaleString("fr-FR")}</td><td className="item-actions"><button className="btn btn-sm btn-outline">{t("snapshots.restore")}</button><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
