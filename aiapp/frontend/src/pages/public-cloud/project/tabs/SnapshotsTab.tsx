import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as snapshotsService from "./SnapshotsTab.service";
import type { CloudSnapshot } from "../project.types";
import "./SnapshotsTab.css";

interface Props { projectId: string; }

export function SnapshotsTab({ projectId }: Props) {
  const { t } = useTranslation("public-cloud/project/snapshots");
  const [snapshots, setSnapshots] = useState<CloudSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const data = await snapshotsService.listSnapshots(projectId); setSnapshots(data); }
      finally { setLoading(false); }
    };
    load();
  }, [projectId]);

  if (loading) return <div className="snapshots-loading"><div className="snapshots-skeleton-block" /></div>;

  return (
    <div className="snapshots-tab">
      <div className="snapshots-header"><h3>{t("title")}</h3><span className="snapshots-count">{snapshots.length}</span></div>
      {snapshots.length === 0 ? (<div className="snapshots-empty-state"><p>{t("empty")}</p></div>) : (
        <table className="snapshots-data-table">
          <thead><tr><th>{t("name")}</th><th>{t("size")}</th><th>{t("region")}</th><th>{t("created")}</th><th>{t("status")}</th></tr></thead>
          <tbody>
            {snapshots.map(snap => (
              <tr key={snap.id}>
                <td className="snapshots-mono">{snap.name}</td>
                <td>{snap.size} GB</td>
                <td>{snap.region}</td>
                <td>{new Date(snap.creationDate).toLocaleDateString()}</td>
                <td><span className={`snapshots-badge ${snap.status === 'active' ? 'snapshots-badge-success' : 'snapshots-badge-warning'}`}>{snap.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default SnapshotsTab;
