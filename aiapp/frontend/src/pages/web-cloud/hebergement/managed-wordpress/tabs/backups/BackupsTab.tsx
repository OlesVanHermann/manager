import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { backupsService } from "./BackupsTab";
import type { ManagedWordPressBackup } from "../../managed-wordpress.types";
import "./BackupsTab.css";

interface Props { serviceName: string; }

export function BackupsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/managed-wordpress/index");
  const [backups, setBackups] = useState<ManagedWordPressBackup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  const loadBackups = useCallback(async () => {
    try { setLoading(true); const data = await backupsService.listBackups(serviceName); setBackups(data || []); }
    catch (err) { setError(String(err)); } finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadBackups(); }, [loadBackups]);

  const handleCreateBackup = async () => {
    setCreating(true);
    try { await backupsService.createBackup(serviceName); alert(t("backups.createSuccess")); loadBackups(); }
    catch (err) { alert(`Erreur: ${err}`); } finally { setCreating(false); }
  };

  const handleRestore = async (backupId: string) => {
    if (!confirm(t("backups.confirmRestore"))) return;
    setRestoring(backupId);
    try { await backupsService.restoreBackup(serviceName, backupId); alert(t("backups.restoreStarted")); }
    catch (err) { alert(`Erreur: ${err}`); } finally { setRestoring(null); }
  };

  const handleDelete = async (backupId: string) => {
    if (!confirm(t("backups.confirmDelete"))) return;
    try { await backupsService.deleteBackup(serviceName, backupId); loadBackups(); }
    catch (err) { alert(`Erreur: ${err}`); }
  };

  const formatDate = (d: string) => new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const formatSize = (b: number) => b < 1024*1024 ? `${(b/1024).toFixed(1)} KB` : b < 1024*1024*1024 ? `${(b/1024/1024).toFixed(1)} MB` : `${(b/1024/1024/1024).toFixed(2)} GB`;
  const getStatusBadge = (s: string) => ({ completed: { class: "success", label: "Terminé" }, in_progress: { class: "warning", label: "En cours" }, failed: { class: "error", label: "Échec" } }[s] || { class: "inactive", label: s });

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="backups-tab">
      <div className="backups-header">
        <div><h3>{t("backups.title")}</h3><p className="backups-description">{t("backups.description")}</p></div>
        <div className="backups-actions"><button className="btn btn-primary" onClick={handleCreateBackup} disabled={creating}>{creating ? "Création..." : `+ ${t("backups.create")}`}</button></div>
      </div>
      <div className="backups-info-banner"><span>ℹ</span><p>{t("backups.info")}</p></div>
      {backups.length === 0 ? (
        <div className="backups-empty"><span className="backups-empty-icon">💾</span><h4>{t("backups.empty")}</h4><p>{t("backups.emptyHint")}</p><button className="btn btn-primary" onClick={handleCreateBackup} disabled={creating}>{creating ? "..." : `+ ${t("backups.create")}`}</button></div>
      ) : (
        <table className="backups-table">
          <thead><tr><th>{t("backups.date")}</th><th>{t("backups.type")}</th><th>{t("backups.size")}</th><th>{t("backups.status")}</th><th>{t("common.actions")}</th></tr></thead>
          <tbody>
            {backups.map(b => (
              <tr key={b.id}>
                <td>{formatDate(b.date)}</td>
                <td><span className={`badge ${b.type === "automatic" ? "info" : "secondary"}`}>{b.type === "automatic" ? "Automatique" : "Manuel"}</span></td>
                <td>{formatSize(b.size)}</td>
                <td><span className={`badge ${getStatusBadge(b.status).class}`}>{getStatusBadge(b.status).label}</span></td>
                <td><div className="backups-action-buttons">
                  <button className="btn btn-xs btn-primary" onClick={() => handleRestore(b.id)} disabled={restoring === b.id || b.status !== "completed"} title={t("backups.restore")}>{restoring === b.id ? "..." : "↩️"}</button>
                  {b.type === "manual" && <button className="btn btn-xs btn-danger" onClick={() => handleDelete(b.id)} title={t("backups.delete")}>🗑️</button>}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BackupsTab;
