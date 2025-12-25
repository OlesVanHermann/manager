// ============================================================
// VPS TAB ISOLÉ : SnapshotTab
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { snapshotService } from "./SnapshotTab";
import type { VpsSnapshot } from "../../vps.types";
import "./SnapshotTab.css";

interface Props {
  serviceName: string;
}

export function SnapshotTab({ serviceName }: Props) {
  const { t } = useTranslation("bare-metal/vps/index");
  const { t: tCommon } = useTranslation("common");
  const [snapshot, setSnapshot] = useState<VpsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const loadSnapshot = async () => {
    try {
      setLoading(true);
      const data = await snapshotService.getSnapshot(serviceName);
      setSnapshot(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSnapshot();
  }, [serviceName]);

  const handleCreate = async () => {
    if (!confirm(t("snapshot.confirmCreate"))) return;
    try {
      setActing(true);
      await snapshotService.createSnapshot(serviceName);
      await loadSnapshot();
    } finally {
      setActing(false);
    }
  };

  const handleRestore = async () => {
    if (!confirm(t("snapshot.confirmRestore"))) return;
    try {
      setActing(true);
      await snapshotService.restoreSnapshot(serviceName);
    } finally {
      setActing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t("snapshot.confirmDelete"))) return;
    try {
      setActing(true);
      await snapshotService.deleteSnapshot(serviceName);
      setSnapshot(null);
    } finally {
      setActing(false);
    }
  };

  if (loading) {
    return (
      <div className="snapshot-tab">
        <div className="tab-loading">
          <div className="skeleton-block" />
        </div>
      </div>
    );
  }

  return (
    <div className="snapshot-tab">
      <div className="tab-header">
        <h3>{t("snapshot.title")}</h3>
        <p className="tab-description">{t("snapshot.description")}</p>
      </div>

      {snapshot ? (
        <div className="snapshot-card">
          <div className="snapshot-status">
            <div className="status-icon enabled">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </div>
            <div className="status-text">
              <span className="status-label">{t("snapshot.exists")}</span>
              <span className="status-date">{new Date(snapshot.creationDate).toLocaleString()}</span>
            </div>
          </div>
          {snapshot.description && <p className="snapshot-desc">{snapshot.description}</p>}
          <div className="snapshot-actions">
            <button className="btn-secondary" onClick={handleRestore} disabled={acting}>
              {acting ? tCommon("loading") : t("snapshot.restore")}
            </button>
            <button className="btn-danger" onClick={handleDelete} disabled={acting}>
              {acting ? tCommon("loading") : t("snapshot.delete")}
            </button>
          </div>
        </div>
      ) : (
        <div className="snapshot-card empty">
          <div className="snapshot-status">
            <div className="status-icon disabled">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              </svg>
            </div>
            <div className="status-text">
              <span className="status-label">{t("snapshot.noSnapshot")}</span>
            </div>
          </div>
          <button className="btn-primary" onClick={handleCreate} disabled={acting}>
            {acting ? tCommon("loading") : t("snapshot.create")}
          </button>
        </div>
      )}

      <div className="info-box">
        <h4>{t("snapshot.info")}</h4>
        <p>{t("snapshot.infoDesc")}</p>
      </div>
    </div>
  );
}

export default SnapshotTab;
