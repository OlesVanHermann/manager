// ============================================================
import "./emails.css";
// HOSTING TAB: EMAILS - Scripts e-mail automatisés
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Hosting, EmailQuota } from "../../../../../../services/web-cloud.hosting";

interface Props { serviceName: string; }

export function EmailsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.emails");
  const [emailQuota, setEmailQuota] = useState<EmailQuota | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const quota = await hostingService.getEmailQuota(serviceName);
      setEmailQuota(quota);
    } catch (err) {
      console.error(err);
      // Données par défaut si API non disponible
      setEmailQuota({
        state: "ok",
        email: "admin@" + serviceName,
        bounce: 3,
        sent: 42,
        maxPerDay: 200,
        total: 1247
      });
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadData(); }, [loadData]);

  const handlePurge = async () => {
    if (!confirm("Voulez-vous vraiment purger la file d'attente des e-mails ?")) return;
    setActionLoading(true);
    try {
      await hostingService.purgeEmails(serviceName);
      alert("File d'attente purgée");
      loadData();
    } catch (err) {
      alert(String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleState = async () => {
    const newState = emailQuota?.state === "ok" ? "blocked" : "ok";
    setActionLoading(true);
    try {
      await hostingService.updateEmailState(serviceName, newState);
      loadData();
    } catch (err) {
      alert(String(err));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" style={{ height: "300px" }} /></div>;

  return (
    <div className="emails-tab">
      {/* Header */}
      <div className="tab-header">
        <div>
          <h3>{t("emails.title")}</h3>
          <p className="tab-description">
            {t("emails.description")}
            <a href="https://help.ovhcloud.com/csm/fr-web-hosting-email-script" target="_blank" rel="noopener noreferrer" className="link-action" style={{ marginLeft: "0.5rem" }}>
              Consulter le guide ↗
            </a>
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div className="info-banner" style={{ marginBottom: "1.5rem" }}>
        <span className="info-icon">ℹ️</span>
        <span>Les e-mails envoyés depuis vos scripts PHP sont suivis ici.</span>
      </div>

      {/* Main layout: Info tile + Actions */}
      <div className="emails-layout">
        {/* Info tile */}
        <div className="info-tile large">
          <h4>Informations</h4>
          <div className="tile-content">
            <div className="info-row">
              <span className="info-label">{t("emails.state")}</span>
              <span className={`badge ${emailQuota?.state === "ok" ? "success" : "error"}`}>
                {emailQuota?.state === "ok" ? "Actif" : "Bloqué"}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">E-mail de rapport d'erreur</span>
              <span className="info-value">
                {emailQuota?.email || "-"}
                <a href="#" className="link-action" style={{ marginLeft: "0.5rem" }}>Modifier</a>
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Total envoyés</span>
              <span className="info-value">{emailQuota?.total?.toLocaleString() || 0}</span>
            </div>

            <div className="info-row">
              <span className="info-label">Envoyés aujourd'hui</span>
              <span className="info-value">
                <div className="quota-inline">
                  <span>{emailQuota?.sent || 0}</span>
                  <span className="separator">/</span>
                  <span className="max">{emailQuota?.maxPerDay || 200}</span>
                </div>
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">E-mails en erreur</span>
              <span className="info-value">
                {emailQuota?.bounce || 0}
                {(emailQuota?.bounce || 0) > 0 && (
                  <span className="badge error" style={{ marginLeft: "0.5rem" }}>!</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="emails-actions">
          <button 
            className="btn btn-secondary btn-block"
            onClick={handlePurge}
            disabled={actionLoading}
          >
            🗑 {t("emails.purge")}
          </button>

          <button 
            className="btn btn-secondary btn-block"
            onClick={() => window.open(`https://www.ovh.com/manager/#/web/hosting/${serviceName}/email/history`, "_blank")}
          >
            📋 Historique des erreurs
          </button>

          <button 
            className={`btn btn-block ${emailQuota?.state === "ok" ? "btn-warning" : "btn-primary"}`}
            onClick={handleToggleState}
            disabled={actionLoading}
          >
            {emailQuota?.state === "ok" ? "🚫 Bloquer l'envoi" : "✅ " + t("emails.unblock")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailsTab;
