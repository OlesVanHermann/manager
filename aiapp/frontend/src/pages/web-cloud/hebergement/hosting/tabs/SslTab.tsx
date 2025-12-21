// ============================================================
// HOSTING TAB: SSL - Certificat SSL avec actions
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, SslCertificate } from "../../../../../services/web-cloud.hosting";

interface Props { serviceName: string; }

/** Onglet Certificat SSL avec actions. */
export function SslTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [ssl, setSsl] = useState<SslCertificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadSsl = useCallback(async () => {
    try {
      setLoading(true);
      const data = await hostingService.getSslCertificate(serviceName);
      setSsl(data);
    } catch {
      setSsl(null);
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => {
    loadSsl();
  }, [loadSsl]);

  // ---------- ACTIONS ----------
  const handleGenerateLetsEncrypt = async () => {
    if (!confirm(t("ssl.confirmGenerate"))) return;
    try {
      setActionLoading(true);
      await hostingService.createSslCertificate(serviceName);
      setTimeout(loadSsl, 2000);
    } catch (err) {
      alert(String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!confirm(t("ssl.confirmRegenerate"))) return;
    try {
      setActionLoading(true);
      await hostingService.regenerateSslCertificate(serviceName);
      setTimeout(loadSsl, 2000);
    } catch (err) {
      alert(String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t("ssl.confirmDelete"))) return;
    try {
      setActionLoading(true);
      await hostingService.deleteSslCertificate(serviceName);
      setTimeout(loadSsl, 2000);
    } catch (err) {
      alert(String(err));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="ssl-tab">
      <div className="tab-header">
        <div>
          <h3>{t("ssl.title")}</h3>
          <p className="tab-description">{t("ssl.description")}</p>
        </div>
        {!ssl && (
          <button className="btn btn-primary" onClick={handleGenerateLetsEncrypt} disabled={actionLoading}>
            {actionLoading ? "..." : t("ssl.generateLetsEncrypt")}
          </button>
        )}
      </div>

      {ssl ? (
        <div className="ssl-card">
          <div className="ssl-status">
            <div className="status-icon enabled">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            </div>
            <div className="status-text">
              <span className="status-label enabled">{t("ssl.active")}</span>
              <span className="status-description">{t("ssl.provider")}: {ssl.provider}</span>
            </div>
          </div>
          <div className="ssl-details">
            <div className="info-item"><label>{t("ssl.type")}</label><span className="badge success">{ssl.type}</span></div>
            <div className="info-item"><label>{t("ssl.status")}</label><span className="badge info">{ssl.status}</span></div>
            <div className="info-item"><label>{t("ssl.regenerable")}</label><span>{ssl.regenerable ? '✓' : '✗'}</span></div>
          </div>
          <div className="ssl-actions">
            {ssl.regenerable && (
              <button className="btn btn-secondary" onClick={handleRegenerate} disabled={actionLoading}>
                {t("ssl.regenerate")}
              </button>
            )}
            <button className="btn btn-danger" onClick={handleDelete} disabled={actionLoading}>
              {t("ssl.delete")}
            </button>
          </div>
        </div>
      ) : (
        <div className="ssl-card inactive">
          <div className="ssl-status">
            <div className="status-icon disabled">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            </div>
            <div className="status-text">
              <span className="status-label disabled">{t("ssl.inactive")}</span>
              <span className="status-description">{t("ssl.noSsl")}</span>
            </div>
          </div>
        </div>
      )}

      <div className="info-box">
        <h4>{t("ssl.whatIs")}</h4>
        <p>{t("ssl.explanation")}</p>
      </div>
    </div>
  );
}

export default SslTab;
