// ============================================================
// VPS TAB ISOLÉ : BackupsTab
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { backupsService } from "./BackupsTab";
import "./BackupsTab.css";

interface Backup {
  id: string;
  creationDate: string;
}

interface BackupsTabProps {
  serviceId: string;
}

export default function BackupsTab({ serviceId }: BackupsTabProps) {
  const { t } = useTranslation("bare-metal/vps/index");
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
      const data = await backupsService.getBackups(serviceId);
      setBackups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadBackups}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="backups-tab">
      <div className="tab-toolbar">
        <h2>{t("backups.title")}</h2>
      </div>

      <div className="backups-info-card" style={{ marginBottom: "var(--space-4)" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>{t("backups.description")}</p>
      </div>

      {backups.length === 0 ? (
        <div className="empty-state">
          <h2>{t("backups.empty.title")}</h2>
          <p>{t("backups.empty.description")}</p>
        </div>
      ) : (
        <table className="backups-data-table">
          <thead>
            <tr>
              <th>{t("backups.columns.date")}</th>
              <th>{t("backups.columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {backups.map((backup) => (
              <tr key={backup.id}>
                <td>{new Date(backup.creationDate).toLocaleString("fr-FR")}</td>
                <td className="backups-item-actions">
                  <button className="btn btn-sm btn-outline">{t("backups.actions.restore")}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
