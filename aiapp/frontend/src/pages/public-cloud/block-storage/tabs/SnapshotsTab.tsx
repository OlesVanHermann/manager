// ============================================================
// PUBLIC-CLOUD / BLOCK-STORAGE / SNAPSHOTS - Composant ISOLÉ
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getSnapshots, formatSize, formatDate, getSnapshotsStatusClass } from "./SnapshotsTab.service";
import type { VolumeSnapshot } from "../block-storage.types";
import "./SnapshotsTab.css";

interface SnapshotsTabProps {
  projectId: string;
  volumeId: string;
}

export default function SnapshotsTab({ projectId, volumeId }: SnapshotsTabProps) {
  const { t } = useTranslation("public-cloud/block-storage/snapshots");
  const { t: tCommon } = useTranslation("common");
  const [snapshots, setSnapshots] = useState<VolumeSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSnapshots();
  }, [projectId, volumeId]);

  const loadSnapshots = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSnapshots(projectId, volumeId);
      setSnapshots(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="snapshots-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="snapshots-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadSnapshots}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="snapshots-tab">
      <div className="snapshots-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-primary">{t("create")}</button>
      </div>

      {snapshots.length === 0 ? (
        <div className="snapshots-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <table className="snapshots-table">
          <thead>
            <tr>
              <th>{t("columns.name")}</th>
              <th>{t("columns.size")}</th>
              <th>{t("columns.created")}</th>
              <th>{t("columns.status")}</th>
              <th>{t("columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {snapshots.map((snapshot) => (
              <tr key={snapshot.id}>
                <td>{snapshot.name}</td>
                <td>{formatSize(snapshot.size)}</td>
                <td>{formatDate(snapshot.creationDate)}</td>
                <td>
                  <span className={`snapshots-status-badge ${getSnapshotsStatusClass(snapshot.status)}`}>
                    {snapshot.status}
                  </span>
                </td>
                <td className="snapshots-actions">
                  <button className="btn btn-sm btn-outline">{t("actions.restore")}</button>
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
