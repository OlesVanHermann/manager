// ============================================================
// MANAGED WORDPRESS TAB: BACKUPS
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { managedWordPressService } from "../../../../../services/web-cloud.managed-wordpress";

interface Props { serviceName: string; }

interface Backup {
  id: string;
  date: string;
  type: "automatic" | "manual";
  size: number;
  status: "completed" | "in_progress" | "failed";
}

/** Onglet Sauvegardes WordPress Managé. */
export function BackupsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/managed-wordpress/index");
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  // ---------- LOAD ----------
  const loadBackups = useCallback(async () => {
    try {
      setLoading(true);
      const data = await managedWordPressService.listBackups(serviceName);
      setBackups(data || []);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadBackups(); }, [loadBackups]);

  // ---------- HANDLERS ----------
  const handleCreateBackup = async () => {
    setCreating(true);
    try {
      await managedWordPressService.createBackup(serviceName);
      alert(t("backups.createSuccess"));
      loadBackups();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setCreating(false);
    }
  };

  const handleRestore = async (backupId: string) => {
    if (!confirm(t("backups.confirmRestore"))) return;
    setRestoring(backupId);
    try {
      await managedWordPressService.restoreBackup(serviceName, backupId);
      alert(t("backups.restoreStarted"));
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setRestoring(null);
    }
  };

  const handleDelete = async (backupId: string) => {
    if (!confirm(t("backups.confirmDelete"))) return;
    try {
      await managedWordPressService.deleteBackup(serviceName, backupId);
      loadBackups();
    } catch (err) {
      alert(`Erreur: ${err}`);
    }
  };

  // ---------- HELPERS ----------
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { class: string; label: string }> = {
      completed: { class: "success", label: "Terminé" },
      in_progress: { class: "warning", label: "En cours" },
      failed: { class: "error", label: "Échec" },
    };
    return map[status] || { class: "inactive", label: status };
  };

  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
      </div>
    );
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  // ---------- RENDER ----------
  return (
    <div className="wp-backups-tab">
      <div className="tab-header">
        <div>
          <h3>{t("backups.title")}</h3>
          <p className="tab-description">{t("backups.description")}</p>
        </div>
        <div className="tab-actions">
          <button
            className="btn btn-primary"
            onClick={handleCreateBackup}
            disabled={creating}
          >
            {creating ? "Création..." : `+ ${t("backups.create")}`}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="info-banner">
        <span className="info-icon">ℹ</span>
        <div>
          <p>{t("backups.info")}</p>
        </div>
      </div>

      {/* Liste des sauvegardes */}
      {backups.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">💾</span>
          <h4>{t("backups.empty")}</h4>
          <p>{t("backups.emptyHint")}</p>
          <button className="btn btn-primary" onClick={handleCreateBackup} disabled={creating}>
            {creating ? "..." : `+ ${t("backups.create")}`}
          </button>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("backups.date")}</th>
              <th>{t("backups.type")}</th>
              <th>{t("backups.size")}</th>
              <th>{t("backups.status")}</th>
              <th>{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {backups.map(backup => (
              <tr key={backup.id}>
                <td>{formatDate(backup.date)}</td>
                <td>
                  <span className={`badge ${backup.type === "automatic" ? "info" : "secondary"}`}>
                    {backup.type === "automatic" ? "Automatique" : "Manuel"}
                  </span>
                </td>
                <td>{formatSize(backup.size)}</td>
                <td>
                  <span className={`badge ${getStatusBadge(backup.status).class}`}>
                    {getStatusBadge(backup.status).label}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-xs btn-primary"
                      onClick={() => handleRestore(backup.id)}
                      disabled={restoring === backup.id || backup.status !== "completed"}
                      title={t("backups.restore")}
                    >
                      {restoring === backup.id ? "..." : "↩️"}
                    </button>
                    {backup.type === "manual" && (
                      <button
                        className="btn btn-xs btn-danger"
                        onClick={() => handleDelete(backup.id)}
                        title={t("backups.delete")}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BackupsTab;
