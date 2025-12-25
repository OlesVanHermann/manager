// ############################################################
// #  NETAPP/SNAPSHOTS - COMPOSANT STRICTEMENT ISOLÉ          #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./SnapshotsTab.css                          #
// #  SERVICE LOCAL : ./SnapshotsTab.ts                       #
// #  I18N LOCAL : bare-metal/netapp/snapshots                #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { snapshotsService } from "./SnapshotsTab.service";
import type { NetAppSnapshot } from "../../netapp.types";
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

// ============================================================
// Composant Principal
// ============================================================
export default function SnapshotsTab({ serviceId }: SnapshotsTabProps) {
  const { t } = useTranslation("bare-metal/netapp/snapshots");
  const { t: tCommon } = useTranslation("common");
  const [snapshots, setSnapshots] = useState<NetAppSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement des snapshots
  const loadSnapshots = async () => {
    try {
      setLoading(true);
      setError(null);
      setSnapshots(await snapshotsService.getSnapshots(serviceId));
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
    return <div className="netapp-snapshots-loading">{tCommon("loading")}</div>;
  }

  // État d'erreur
  if (error) {
    return (
      <div className="netapp-snapshots-error">
        <p>{error}</p>
        <button className="netapp-snapshots-btn netapp-snapshots-btn-primary" onClick={loadSnapshots}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="netapp-snapshots-tab">
      {/* Barre d'outils */}
      <div className="netapp-snapshots-toolbar">
        <h2>{t("title")}</h2>
        <button className="netapp-snapshots-btn netapp-snapshots-btn-primary">{t("create")}</button>
      </div>

      {/* Liste vide */}
      {snapshots.length === 0 ? (
        <div className="netapp-snapshots-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <table className="netapp-snapshots-table">
          <thead>
            <tr>
              <th>{t("columns.name")}</th>
              <th>{t("columns.volume")}</th>
              <th>{t("columns.created")}</th>
              <th>{t("columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {snapshots.map((s) => (
              <tr key={s.id}>
                <td className="netapp-snapshots-mono">{s.name}</td>
                <td>{s.volumeName}</td>
                <td>{formatDate(s.createdAt)}</td>
                <td className="netapp-snapshots-actions">
                  <button className="netapp-snapshots-btn netapp-snapshots-btn-sm netapp-snapshots-btn-outline">{t("restore")}</button>
                  <button className="netapp-snapshots-btn netapp-snapshots-btn-sm netapp-snapshots-btn-outline netapp-snapshots-btn-danger">
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
