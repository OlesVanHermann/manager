// ############################################################
// #  VPS/BACKUPS - COMPOSANT STRICTEMENT ISOLÉ               #
// ############################################################
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { backupsService } from "./BackupsTab";
import "./BackupsTab.css";

interface Backup { id: string; creationDate: string; }
interface BackupsTabProps { serviceId: string; }
const formatDateTime = (date: string): string => new Date(date).toLocaleString("fr-FR");

export default function BackupsTab({ serviceId }: BackupsTabProps) {
  const { t } = useTranslation("bare-metal/vps/index");
  const { t: tCommon } = useTranslation("common");
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadBackups(); }, [serviceId]);
  const loadBackups = async () => {
    try { setLoading(true); setError(null); setBackups(await backupsService.getBackups(serviceId)); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };
  const handleRestore = async (backupId: string) => {
    if (!confirm(t("backups.confirmRestore"))) return;
    try { await backupsService.restoreBackup(serviceId, backupId); alert(t("backups.restoreStarted")); }
    catch (err) { alert(err instanceof Error ? err.message : "Erreur"); }
  };

  if (loading) return <div className="vps-backups-loading">{tCommon("loading")}</div>;
  if (error) return <div className="vps-backups-error"><p>{error}</p><button className="btn btn-primary" onClick={loadBackups}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="vps-backups-tab">
      <div className="vps-backups-toolbar"><h2>{t("backups.title")}</h2><button className="btn btn-outline" onClick={loadBackups}>{tCommon("actions.refresh")}</button></div>
      <div className="vps-backups-info-card"><p>{t("backups.info")}</p></div>
      {backups.length === 0 ? <div className="vps-backups-empty"><h2>{t("backups.empty.title")}</h2></div> : (
        <table className="vps-backups-table">
          <thead><tr><th>{t("backups.columns.id")}</th><th>{t("backups.columns.date")}</th><th>{t("backups.columns.actions")}</th></tr></thead>
          <tbody>{backups.map((backup) => (<tr key={backup.id}><td>{backup.id}</td><td>{formatDateTime(backup.creationDate)}</td><td className="vps-backups-actions"><button className="btn btn-sm btn-outline" onClick={() => handleRestore(backup.id)}>{t("backups.restore")}</button></td></tr>))}</tbody>
        </table>
      )}
    </div>
  );
}
