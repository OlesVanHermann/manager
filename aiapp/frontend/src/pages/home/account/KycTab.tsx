// ============================================================
// KYC TAB - Vérification d'identité
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as proceduresService from "../../../services/procedures.service";

// ============ COMPOSANT ============

/** Affiche le statut de vérification d'identité (KYC) et les actions requises. */
export function KycTab() {
  const { t } = useTranslation('home/account/kyc');
  const { t: tCommon } = useTranslation('common');

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<proceduresService.FraudStatus | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => { loadStatus(); }, []);

  // ---------- LOADERS ----------
  const loadStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await proceduresService.getFraudStatus();
      setStatus(data);
    } catch (err) {
      setStatus({ status: "none" });
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const getStatusInfo = (statusVal: string) => {
    const map: Record<string, { label: string; className: string; description: string }> = {
      required: { label: t('status.required.label'), className: "badge-warning", description: t('status.required.description') },
      pending: { label: t('status.pending.label'), className: "badge-info", description: t('status.pending.description') },
      open: { label: t('status.open.label'), className: "badge-info", description: t('status.open.description') },
      closed: { label: t('status.closed.label'), className: "badge-success", description: t('status.closed.description') },
      none: { label: t('status.none.label'), className: "badge-neutral", description: t('status.none.description') },
    };
    return map[statusVal] || map.none;
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="tab-content"><div className="loading-state"><div className="spinner"></div><p>{t('loading')}</p></div></div>;
  }

  if (error) {
    return <div className="tab-content"><div className="error-banner">{error}<button onClick={loadStatus} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;
  }

  const statusInfo = getStatusInfo(status?.status || "none");

  return (
    <div className="tab-content">
      <div className="section-header">
        <h2>{t('title')}</h2>
        <p>{t('description')}</p>
      </div>

      <div className="kyc-status-card" style={{ padding: "2rem", background: "var(--color-background-subtle)", borderRadius: "12px", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <span className={"status-badge " + statusInfo.className} style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}>{statusInfo.label}</span>
        </div>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>{statusInfo.description}</p>

        {status?.status === "required" && (
          <div className="kyc-required-section">
            <h4 style={{ marginBottom: "1rem" }}>{t('required.documentsTitle')}</h4>
            <ul style={{ marginLeft: "1.5rem", marginBottom: "1.5rem", color: "var(--color-text-secondary)" }}>
              <li>{t('required.doc1')}</li>
              <li>{t('required.doc2')}</li>
              <li>{t('required.doc3')}</li>
            </ul>
            <a href="https://www.ovh.com/manager/#/dedicated/useraccount/kyc-documents" target="_blank" rel="noopener noreferrer" className="btn btn-primary">{t('required.submitButton')}</a>
          </div>
        )}

        {status?.status === "pending" && (
          <div className="kyc-pending-section">
            <p style={{ color: "var(--color-text-secondary)" }}>{t('pending.processingTime')}</p>
          </div>
        )}

        {status?.status === "none" && (
          <div className="kyc-none-section">
            <p style={{ color: "var(--color-text-secondary)" }}>{t('none.futureNotice')}</p>
          </div>
        )}
      </div>

      <div className="kyc-info" style={{ padding: "1.5rem", border: "1px solid var(--color-border)", borderRadius: "8px", background: "var(--color-background)" }}>
        <h4 style={{ marginBottom: "0.5rem" }}>{t('info.title')}</h4>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginBottom: "1rem" }}>{t('info.description')}</p>
        <a href="https://www.ovhcloud.com/fr/terms-and-conditions/privacy-policy/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", fontSize: "0.9rem" }}>{t('info.privacyLink')}</a>
      </div>
    </div>
  );
}
