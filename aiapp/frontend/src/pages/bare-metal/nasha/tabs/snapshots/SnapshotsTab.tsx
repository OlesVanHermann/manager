// ############################################################
// #  NASHA/SNAPSHOTS - COMPOSANT STRICTEMENT ISOLÉ           #
// #  CSS LOCAL : ./SnapshotsTab.css                          #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { snapshotsService } from "./SnapshotsTab";
import type { NashaSnapshot } from "../../nasha.types";
import "./SnapshotsTab.css";

interface SnapshotsTabProps { serviceId: string; }

const formatDate = (date: string): string => new Date(date).toLocaleString("fr-FR");

export default function SnapshotsTab({ serviceId }: SnapshotsTabProps) {
  const { t } = useTranslation("bare-metal/nasha/index");
  const { t: tCommon } = useTranslation("common");
  const [snapshots, setSnapshots] = useState<NashaSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadSnapshots(); }, [serviceId]);

  const loadSnapshots = async () => {
    try {
      setLoading(true); setError(null);
      const data = await snapshotsService.getSnapshots(serviceId);
      setSnapshots(data);
    } catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="nasha-snapshots-loading">{tCommon("loading")}</div>;
  if (error) return <div className="nasha-snapshots-error"><p>{error}</p><button className="btn btn-primary" onClick={loadSnapshots}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="nasha-snapshots-tab">
      <div className="nasha-snapshots-toolbar">
        <h2>{t("snapshots.title")}</h2>
        <button className="btn btn-primary">{t("snapshots.create")}</button>
      </div>

      {snapshots.length === 0 ? (
        <div className="nasha-snapshots-empty"><h2>{t("snapshots.empty.title")}</h2><p>{t("snapshots.empty.description")}</p></div>
      ) : (
        <table className="nasha-snapshots-table">
          <thead><tr><th>{t("snapshots.columns.name")}</th><th>{t("snapshots.columns.partition")}</th><th>{t("snapshots.columns.type")}</th><th>{t("snapshots.columns.created")}</th><th>{t("snapshots.columns.actions")}</th></tr></thead>
          <tbody>
            {snapshots.map((snapshot, idx) => (
              <tr key={idx}>
                <td className="mono">{snapshot.name}</td>
                <td>{snapshot.partitionName}</td>
                <td><span className={`nasha-snapshots-type-badge ${snapshot.type}`}>{snapshot.type}</span></td>
                <td>{formatDate(snapshot.createdAt)}</td>
                <td className="nasha-snapshots-actions">
                  <button className="btn btn-sm btn-outline">{t("snapshots.restore")}</button>
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
