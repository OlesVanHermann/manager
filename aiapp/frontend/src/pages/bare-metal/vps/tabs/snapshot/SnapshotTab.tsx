// ############################################################
// #  VPS/SNAPSHOT - COMPOSANT STRICTEMENT ISOLÉ              #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./SnapshotTab.css                           #
// #  SERVICE LOCAL : ./SnapshotTab.ts                        #
// #  I18N LOCAL : bare-metal/vps/snapshot                    #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { snapshotService } from "./SnapshotTab.service";
import type { VpsSnapshot } from "../../vps.types";
import "./SnapshotTab.css";

// ============================================================
// Types LOCAUX à ce composant
// ============================================================
interface Props {
  serviceName: string;
}

// ============================================================
// Helpers LOCAUX - Dupliqués volontairement (défactorisation)
// NE JAMAIS importer depuis un autre tab
// ============================================================
const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString();
};

// ============================================================
// Composant Principal
// ============================================================
export function SnapshotTab({ serviceName }: Props) {
  const { t } = useTranslation("bare-metal/vps/snapshot");
  const { t: tCommon } = useTranslation("common");
  const [snapshot, setSnapshot] = useState<VpsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  // Chargement du snapshot
  const loadSnapshot = async () => {
    try {
      setLoading(true);
      setSnapshot(await snapshotService.getSnapshot(serviceName));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSnapshot();
  }, [serviceName]);

  // Actions
  const handleCreate = async () => {
    if (!confirm(t("confirmCreate"))) return;
    try {
      setActing(true);
      await snapshotService.createSnapshot(serviceName);
      await loadSnapshot();
    } finally {
      setActing(false);
    }
  };

  const handleRestore = async () => {
    if (!confirm(t("confirmRestore"))) return;
    try {
      setActing(true);
      await snapshotService.restoreSnapshot(serviceName);
    } finally {
      setActing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t("confirmDelete"))) return;
    try {
      setActing(true);
      await snapshotService.deleteSnapshot(serviceName);
      await loadSnapshot();
    } finally {
      setActing(false);
    }
  };

  // État de chargement
  if (loading) {
    return (
      <div className="vps-snapshot-tab">
        <div className="vps-snapshot-loading">
          <div className="vps-snapshot-skeleton" style={{ width: "60%" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="vps-snapshot-tab">
      {/* En-tête */}
      <div className="vps-snapshot-header">
        <h3>{t("title")}</h3>
        <p className="vps-snapshot-description">{t("description")}</p>
      </div>

      {/* Carte snapshot */}
      <div className={`vps-snapshot-card ${snapshot ? "vps-snapshot-enabled" : "vps-snapshot-empty"}`}>
        <div className="vps-snapshot-status">
          <div className={`vps-snapshot-status-icon ${snapshot ? "vps-snapshot-icon-enabled" : "vps-snapshot-icon-disabled"}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
              />
            </svg>
          </div>
          <div className="vps-snapshot-status-text">
            <span className="vps-snapshot-status-label">
              {snapshot ? t("available") : t("none")}
            </span>
            {snapshot && (
              <span className="vps-snapshot-status-date">
                {formatDateTime(snapshot.creationDate)}
              </span>
            )}
          </div>
        </div>

        {snapshot?.description && (
          <p className="vps-snapshot-desc">{snapshot.description}</p>
        )}

        <div className="vps-snapshot-actions">
          {snapshot ? (
            <>
              <button className="vps-snapshot-btn vps-snapshot-btn-outline" onClick={handleRestore} disabled={acting}>
                {t("restore")}
              </button>
              <button className="vps-snapshot-btn vps-snapshot-btn-outline vps-snapshot-btn-danger" onClick={handleDelete} disabled={acting}>
                {tCommon("actions.delete")}
              </button>
            </>
          ) : (
            <button className="vps-snapshot-btn vps-snapshot-btn-primary" onClick={handleCreate} disabled={acting}>
              {t("create")}
            </button>
          )}
        </div>
      </div>

      {/* Boîte d'info */}
      <div className="vps-snapshot-info-box">
        <h4>{t("info.title")}</h4>
        <p>{t("info.description")}</p>
      </div>
    </div>
  );
}

export default SnapshotTab;
