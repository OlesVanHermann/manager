import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as snapshotsService from "./SnapshotsTab.service";
import type { CloudSnapshot } from "../project.types";
import "./SnapshotsTab.css";

interface Props { projectId: string; }

export function SnapshotsTab({ projectId }: Props) {
  const { t } = useTranslation("public-cloud/project/index");
  const [snapshots, setSnapshots] = useState<CloudSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const data = await snapshotsService.listSnapshots(projectId); setSnapshots(data); }
      finally { setLoading(false); }
    };
    load();
  }, [projectId]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="snapshots-tab">
      <div className="tab-header"><h3>{t("snapshots.title")}</h3><span className="records-count">{snapshots.length}</span></div>
      {snapshots.length === 0 ? (<div className="empty-state"><p>{t("snapshots.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("snapshots.name")}</th><th>{t("snapshots.size")}</th><th>{t("snapshots.region")}</th><th>{t("snapshots.created")}</th><th>{t("snapshots.status")}</th></tr></thead>
          <tbody>
            {snapshots.map(snap => (
              <tr key={snap.id}>
                <td className="font-mono">{snap.name}</td>
                <td>{snap.size} GB</td>
                <td>{snap.region}</td>
                <td>{new Date(snap.creationDate).toLocaleDateString()}</td>
                <td><span className={`badge ${snap.status === 'active' ? 'success' : 'warning'}`}>{snap.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default SnapshotsTab;
