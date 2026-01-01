// ============================================================
import "./DnssecTab.css";
// TAB: DNSSEC - DS Records et statut DNSSEC
// Aligné sur target SVG dnssec.svg
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { dnssecService, type DsRecord } from "./DnssecTab.service";

interface Props {
  domain: string;
}

// ============ ICONS ============

const ShieldIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ============ ALGORITHM NAMES ============

const ALGORITHM_NAMES: Record<number, string> = {
  8: "RSASHA256",
  10: "RSASHA512",
  13: "ECDSAP256SHA256",
  14: "ECDSAP384SHA384",
  15: "ED25519",
};

const FLAG_NAMES: Record<number, string> = {
  256: "ZSK (Zone Signing Key)",
  257: "KSK (Key Signing Key)",
};

/** Onglet DNSSEC avec table DS records. */
export function DnssecTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- DEBUG LOGGING ----------
  const logAction = (action: string, data?: Record<string, unknown>) => {
  };

  // ---------- STATE STATUS ----------
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  // ---------- STATE DS RECORDS ----------
  const [dsRecords, setDsRecords] = useState<DsRecord[]>([]);
  const [dsLoading, setDsLoading] = useState(true);

  // ---------- STATE DELETE MODAL ----------
  const [deleteRecord, setDeleteRecord] = useState<DsRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ---------- LOAD STATUS ----------
  const loadStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dnssecService.getDnssecStatus(domain);
      setStatus(result.status);
    } catch (err) {
      const errMsg = String(err);
      if (errMsg.includes("404") || errMsg.includes("not found")) {
        setStatus("disabled");
      } else {
        setError(errMsg);
        setStatus(null);
      }
    } finally {
      setLoading(false);
    }
  }, [domain]);

  // ---------- LOAD DS RECORDS ----------
  const loadDsRecords = useCallback(async () => {
    try {
      setDsLoading(true);
      const ids = await dnssecService.listDsRecords(domain);
      if (ids.length === 0) {
        setDsRecords([]);
        return;
      }
      const records = await Promise.all(ids.map((id) => dnssecService.getDsRecord(domain, id)));
      setDsRecords(records);
    } catch {
      setDsRecords([]);
    } finally {
      setDsLoading(false);
    }
  }, [domain]);

  useEffect(() => {
    loadStatus();
    loadDsRecords();
  }, [loadStatus, loadDsRecords]);

  // ---------- TOGGLE DNSSEC ----------
  const handleToggle = async () => {
    const targetStatus = status === "enabled" ? "disabled" : "enabled";
    logAction("TOGGLE_DNSSEC_START", { currentStatus: status, targetStatus });
    try {
      setToggling(true);
      setError(null);
      if (status === "enabled") {
        await dnssecService.disableDnssec(domain);
        logAction("DISABLE_DNSSEC_SUCCESS");
      } else {
        await dnssecService.enableDnssec(domain);
        logAction("ENABLE_DNSSEC_SUCCESS");
      }
      await loadStatus();
    } catch (err) {
      logAction("TOGGLE_DNSSEC_ERROR", { error: String(err) });
      setError(String(err));
    } finally {
      setToggling(false);
    }
  };

  // ---------- REFRESH ----------
  const handleRefresh = () => {
    logAction("REFRESH");
    loadStatus();
    loadDsRecords();
  };

  // ---------- DELETE DS RECORD ----------
  const handleDeleteClick = (record: DsRecord) => {
    logAction("DELETE_DS_RECORD_CLICK", { recordId: record.id, tag: record.tag });
    setDeleteRecord(record);
  };

  const handleDeleteCancel = () => {
    logAction("DELETE_DS_RECORD_CANCEL", { recordId: deleteRecord?.id });
    setDeleteRecord(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteRecord) return;
    logAction("DELETE_DS_RECORD_CONFIRM", { recordId: deleteRecord.id, tag: deleteRecord.tag });
    try {
      setDeleting(true);
      await dnssecService.deleteDsRecord(domain, deleteRecord.id);
      logAction("DELETE_DS_RECORD_SUCCESS", { recordId: deleteRecord.id });
      setDeleteRecord(null);
      await loadDsRecords();
    } catch (err) {
      logAction("DELETE_DS_RECORD_ERROR", { recordId: deleteRecord.id, error: String(err) });
      alert(String(err));
    } finally {
      setDeleting(false);
    }
  };

  // ---------- TRUNCATE KEY ----------
  const truncateKey = (key: string, maxLen = 40) => {
    if (key.length <= maxLen) return key;
    return key.substring(0, maxLen) + "...";
  };

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="dnssec-loading">
        <div className="dnssec-skeleton" style={{ height: "200px" }} />
      </div>
    );
  }

  const isEnabled = status === "enabled";
  const isInProgress = status === "enableInProgress" || status === "disableInProgress";
  const isSupported = status !== null && status !== "unsupported";

  return (
    <div className="dnssec-tab">
      {/* Header */}
      <div className="dnssec-header">
        <div>
          <h3>{t("dnssec.title")}</h3>
          <p className="dnssec-description">{t("dnssec.description")}</p>
        </div>
        <div className="dnssec-header-actions">
          <button className="dnssec-btn-secondary" onClick={handleRefresh}>
            <RefreshIcon /> {tCommon("actions.refresh")}
          </button>
          {isSupported && !isInProgress && (
            <button
              className={isEnabled ? "dnssec-btn-secondary" : "dnssec-btn-primary"}
              onClick={handleToggle}
              disabled={toggling}
            >
              {toggling ? tCommon("loading") : isEnabled ? t("dnssec.disable") : t("dnssec.enable")}
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && <div className="dnssec-error-banner">{error}</div>}

      {/* Status card */}
      <div className={`dnssec-status-card ${isEnabled ? "enabled" : "disabled"}`}>
        <div className="dnssec-icon">
          {isEnabled ? <ShieldCheckIcon /> : <ShieldIcon />}
        </div>
        <div className="dnssec-content">
          <h3 className={isEnabled ? "text-success" : "text-warning"}>
            {isEnabled ? t("dnssec.enabled") : t("dnssec.disabled")}
          </h3>
          <p>
            {isEnabled
              ? t("dnssec.enabledDesc")
              : isSupported
              ? t("dnssec.disabledDesc")
              : t("dnssec.unsupportedDesc")}
          </p>
          {isInProgress && (
            <p className="status-progress">
              {status === "enableInProgress" ? t("dnssec.enabling") : t("dnssec.disabling")}
            </p>
          )}
        </div>
      </div>

      {/* DS Records Table */}
      <div className="dnssec-section">
        <h4>{t("dnssec.dsRecordsTitle")}</h4>
        {dsLoading ? (
          <div className="dnssec-skeleton" style={{ height: "100px" }} />
        ) : dsRecords.length === 0 ? (
          <div className="dnssec-empty-ds">
            <p>{t("dnssec.noDsRecords")}</p>
          </div>
        ) : (
          <table className="dnssec-table">
            <thead>
              <tr>
                <th>{t("dnssec.tag")}</th>
                <th>{t("dnssec.flags")}</th>
                <th>{t("dnssec.algorithm")}</th>
                <th>{t("dnssec.publicKey")}</th>
                <th>{t("dnssec.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {dsRecords.map((record) => (
                <tr key={record.id}>
                  <td><span className="dnssec-tag">{record.tag}</span></td>
                  <td>
                    <span className="dnssec-flag">{record.flags}</span>
                    <span className="dnssec-flag-name">{FLAG_NAMES[record.flags] || ""}</span>
                  </td>
                  <td>
                    <span className="dnssec-algo">{record.algorithm}</span>
                    <span className="dnssec-algo-name">{ALGORITHM_NAMES[record.algorithm] || ""}</span>
                  </td>
                  <td>
                    <code className="dnssec-key" title={record.publicKey}>{truncateKey(record.publicKey)}</code>
                  </td>
                  <td>
                    <button className="dnssec-btn-icon danger" onClick={() => handleDeleteClick(record)} title={tCommon("actions.delete")}>
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Info box */}
      <div className="dnssec-info-box">
        <h4>{t("dnssec.info")}</h4>
        <p>{t("dnssec.infoDesc")}</p>
      </div>

      {/* Delete Confirm Modal */}
      {deleteRecord && (
        <div className="dnssec-modal-overlay" onClick={handleDeleteCancel}>
          <div className="dnssec-modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="dnssec-modal-header">
              <h3>{t("dnssec.confirmDeleteTitle")}</h3>
              <button className="dnssec-btn-icon" onClick={handleDeleteCancel}><CloseIcon /></button>
            </div>
            <div className="dnssec-modal-body">
              <p>{t("dnssec.confirmDeleteMessage")}</p>
              <div className="dnssec-delete-preview">
                Tag: <strong>{deleteRecord.tag}</strong> | Algorithme: <strong>{deleteRecord.algorithm}</strong>
              </div>
            </div>
            <div className="dnssec-modal-footer">
              <button className="dnssec-btn-secondary" onClick={handleDeleteCancel}>{tCommon("actions.cancel")}</button>
              <button className="dnssec-btn-danger" onClick={handleDeleteConfirm} disabled={deleting}>
                {deleting ? tCommon("loading") : tCommon("actions.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DnssecTab;
