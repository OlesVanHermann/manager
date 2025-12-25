// ############################################################
// #  VPS/BACKUPS - COMPOSANT STRICTEMENT ISOLÉ               #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./BackupsTab.css                            #
// #  SERVICE LOCAL : ./BackupsTab.ts                         #
// #  I18N LOCAL : bare-metal/vps/backups                     #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { backupsService } from "./BackupsTab.service";
import "./BackupsTab.css";

// ============================================================
// Types LOCAUX à ce composant
// ============================================================
interface Backup {
  id: string;
  creationDate: string;
}

interface Props {
  serviceId: string;
}

// ============================================================
// Helpers LOCAUX - Dupliqués volontairement (défactorisation)
// NE JAMAIS importer depuis un autre tab
// ============================================================
const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString("fr-FR");
};

// ============================================================
// Composant Principal
// ============================================================
export default function BackupsTab({ serviceId }: Props) {
  const { t } = useTranslation("bare-metal/vps/backups");
  const { t: tCommon } = useTranslation("common");
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBackups();
  }, [serviceId]);

  const loadBackups = async () => {
    try {
      setLoading(true);
      setError(null);
      setBackups(await backupsService.getBackups(serviceId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (backupId: string) => {
    if (!confirm(t("confirmRestore"))) return;
    try {
      await backupsService.restoreBackup(serviceId, backupId);
      alert(t("restoreStarted"));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  // État de chargement
  if (loading) {
    return (
      <div className="vps-backups-loading">
        {tCommon("loading")}
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="vps-backups-error">
        <p>{error}</p>
        <button className="vps-backups-btn vps-backups-btn-primary" onClick={loadBackups}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="vps-backups-tab">
      {/* Toolbar */}
      <div className="vps-backups-toolbar">
        <h2>{t("title")}</h2>
        <button className="vps-backups-btn vps-backups-btn-outline" onClick={loadBackups}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      {/* Info card */}
      <div className="vps-backups-info-card">
        <p>{t("info")}</p>
      </div>

      {/* Liste vide ou tableau */}
      {backups.length === 0 ? (
        <div className="vps-backups-empty">
          <h2>{t("empty.title")}</h2>
        </div>
      ) : (
        <table className="vps-backups-table">
          <thead>
            <tr>
              <th>{t("columns.id")}</th>
              <th>{t("columns.date")}</th>
              <th>{t("columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {backups.map((backup) => (
              <tr key={backup.id}>
                <td>{backup.id}</td>
                <td>{formatDateTime(backup.creationDate)}</td>
                <td className="vps-backups-actions">
                  <button
                    className="vps-backups-btn vps-backups-btn-sm vps-backups-btn-outline"
                    onClick={() => handleRestore(backup.id)}
                  >
                    {t("restore")}
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
