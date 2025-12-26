// ============================================================
// PUBLIC-CLOUD / DATABASES / BACKUPS - Composant ISOLÉ
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getBackups, formatDate, formatSize, getBackupStatusClass } from "./BackupsTab.service";
import type { Backup } from "../databases.types";
import "./BackupsTab.css";

interface BackupsTabProps {
  projectId: string;
  engine: string;
  serviceId: string;
}

export default function BackupsTab({ projectId, engine, serviceId }: BackupsTabProps) {
  const { t } = useTranslation("public-cloud/databases/backups");
  const { t: tCommon } = useTranslation("common");
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBackups();
  }, [projectId, engine, serviceId]);

  const loadBackups = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBackups(projectId, engine, serviceId);
      setBackups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="backups-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="backups-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadBackups}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="backups-tab">
      <div className="backups-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-primary">{t("create")}</button>
      </div>

      {backups.length === 0 ? (
        <div className="backups-empty">
          <h2>{t("empty.title")}</h2>
        </div>
      ) : (
        <table className="backups-table">
          <thead>
            <tr>
              <th>{t("columns.date")}</th>
              <th>{t("columns.size")}</th>
              <th>{t("columns.status")}</th>
              <th>{t("columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {backups.map((backup) => (
              <tr key={backup.id}>
                <td>{formatDate(backup.createdAt)}</td>
                <td className="backups-size">{formatSize(backup.size)}</td>
                <td>
                  <span className={`backups-status-badge ${getBackupStatusClass(backup.status)}`}>
                    {backup.status}
                  </span>
                </td>
                <td className="backups-actions">
                  <button className="btn btn-sm btn-outline">
                    {t("actions.restore")}
                  </button>
                  <button className="btn btn-sm btn-outline btn-danger">
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
