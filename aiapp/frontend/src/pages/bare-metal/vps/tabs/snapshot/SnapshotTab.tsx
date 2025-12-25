// ############################################################
// #  VPS/SNAPSHOT - COMPOSANT STRICTEMENT ISOLÉ              #
// ############################################################
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { snapshotService } from "./SnapshotTab";
import type { VpsSnapshot } from "../../vps.types";
import "./SnapshotTab.css";

interface Props { serviceName: string; }
const formatDateTime = (date: string): string => new Date(date).toLocaleString();

export function SnapshotTab({ serviceName }: Props) {
  const { t } = useTranslation("bare-metal/vps/index");
  const { t: tCommon } = useTranslation("common");
  const [snapshot, setSnapshot] = useState<VpsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const loadSnapshot = async () => { try { setLoading(true); setSnapshot(await snapshotService.getSnapshot(serviceName)); } finally { setLoading(false); } };
  useEffect(() => { loadSnapshot(); }, [serviceName]);

  const handleCreate = async () => { if (!confirm(t("snapshot.confirmCreate"))) return; try { setActing(true); await snapshotService.createSnapshot(serviceName); await loadSnapshot(); } finally { setActing(false); } };
  const handleRestore = async () => { if (!confirm(t("snapshot.confirmRestore"))) return; try { setActing(true); await snapshotService.restoreSnapshot(serviceName); } finally { setActing(false); } };
  const handleDelete = async () => { if (!confirm(t("snapshot.confirmDelete"))) return; try { setActing(true); await snapshotService.deleteSnapshot(serviceName); await loadSnapshot(); } finally { setActing(false); } };

  if (loading) return <div className="vps-snapshot-tab"><div className="vps-snapshot-loading"><div className="vps-snapshot-skeleton" style={{ width: "60%" }} /></div></div>;

  return (
    <div className="vps-snapshot-tab">
      <div className="vps-snapshot-header"><h3>{t("snapshot.title")}</h3><p className="vps-snapshot-description">{t("snapshot.description")}</p></div>
      <div className={`vps-snapshot-card ${snapshot ? "enabled" : "empty"}`}>
        <div className="vps-snapshot-status">
          <div className={`vps-snapshot-status-icon ${snapshot ? "enabled" : "disabled"}`}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg></div>
          <div className="vps-snapshot-status-text"><span className="vps-snapshot-status-label">{snapshot ? t("snapshot.available") : t("snapshot.none")}</span>{snapshot && <span className="vps-snapshot-status-date">{formatDateTime(snapshot.creationDate)}</span>}</div>
        </div>
        {snapshot?.description && <p className="vps-snapshot-desc">{snapshot.description}</p>}
        <div className="vps-snapshot-actions">
          {snapshot ? (<><button className="btn btn-outline" onClick={handleRestore} disabled={acting}>{t("snapshot.restore")}</button><button className="btn btn-outline btn-danger" onClick={handleDelete} disabled={acting}>{tCommon("actions.delete")}</button></>) : (<button className="btn btn-primary" onClick={handleCreate} disabled={acting}>{t("snapshot.create")}</button>)}
        </div>
      </div>
      <div className="vps-snapshot-info-box"><h4>{t("snapshot.info.title")}</h4><p>{t("snapshot.info.description")}</p></div>
    </div>
  );
}
export default SnapshotTab;
