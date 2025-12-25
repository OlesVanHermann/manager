// ############################################################
// #  NASHA/SNAPSHOTS - COMPOSANT STRICTEMENT ISOLÉ           #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./SnapshotsTab.css                          #
// #  SERVICE LOCAL : ./SnapshotsTab.ts                       #
// #  I18N LOCAL : bare-metal/nasha/snapshots                 #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { snapshotsService } from "./SnapshotsTab.service";
import type { NashaSnapshot } from "../../nasha.types";
import "./SnapshotsTab.css";

// ============================================================
// Types LOCAUX à ce composant
// ============================================================
interface SnapshotsTabProps {
  serviceId: string;
}

// ============================================================
// Helpers LOCAUX - Dupliqués volontairement (défactorisation)
// NE JAMAIS importer depuis un autre tab
// ============================================================
const formatDate = (date: string): string => {
  return new Date(date).toLocaleString("fr-FR");
};

const getTypeClass = (type: string): string => {
  const map: Record<string, string> = {
    manual: "nasha-snapshots-manual",
    hourly: "nasha-snapshots-hourly",
    daily: "nasha-snapshots-daily",
    weekly: "nasha-snapshots-weekly",
  };
  return map[type] || "nasha-snapshots-manual";
};

// ============================================================
// Composant Principal
// ============================================================
export default function SnapshotsTab({ serviceId }: SnapshotsTabProps) {
  const { t } = useTranslation("bare-metal/nasha/snapshots");
  const { t: tCommon } = useTranslation("common");
  const [snapshots, setSnapshots] = useState<NashaSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement des snapshots
  const loadSnapshots = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await snapshotsService.getSnapshots(serviceId);
      setSnapshots(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSnapshots();
  }, [serviceId]);

  // État de chargement
  if (loading) {
    return <div className="nasha-snapshots-loading">{tCommon("loading")}</div>;
  }

  // État d'erreur
  if (error) {
    return (
      <div className="nasha-snapshots-error">
        <p>{error}</p>
        <button className="nasha-snapshots-btn nasha-snapshots-btn-primary" onClick={loadSnapshots}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="nasha-snapshots-tab">
      {/* Barre d'outils */}
      <div className="nasha-snapshots-toolbar">
        <h2>{t("title")}</h2>
        <button className="nasha-snapshots-btn nasha-snapshots-btn-primary">{t("create")}</button>
      </div>

      {/* Liste vide */}
      {snapshots.length === 0 ? (
        <div className="nasha-snapshots-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <table className="nasha-snapshots-table">
          <thead>
            <tr>
              <th>{t("columns.name")}</th>
              <th>{t("columns.partition")}</th>
              <th>{t("columns.type")}</th>
              <th>{t("columns.created")}</th>
              <th>{t("columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {snapshots.map((snapshot, idx) => (
              <tr key={idx}>
                <td className="nasha-snapshots-mono">{snapshot.name}</td>
                <td>{snapshot.partitionName}</td>
                <td>
                  <span className={`nasha-snapshots-type-badge ${getTypeClass(snapshot.type)}`}>
                    {snapshot.type}
                  </span>
                </td>
                <td>{formatDate(snapshot.createdAt)}</td>
                <td className="nasha-snapshots-actions">
                  <button className="nasha-snapshots-btn nasha-snapshots-btn-sm nasha-snapshots-btn-outline">{t("restore")}</button>
                  <button className="nasha-snapshots-btn nasha-snapshots-btn-sm nasha-snapshots-btn-outline nasha-snapshots-btn-danger">
                    {tCommon("actions.delete")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
