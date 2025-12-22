// ============================================================
// MANAGED WORDPRESS TAB: GENERAL
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { managedWordPressService, ManagedWordPress } from "../../../../../services/web-cloud.managed-wordpress";

interface Props {
  serviceName: string;
  details: ManagedWordPress;
  onRefresh: () => void;
}

/** Onglet Informations générales WordPress Managé. */
export function GeneralTab({ serviceName, details, onRefresh }: Props) {
  const { t } = useTranslation("web-cloud/managed-wordpress/index");
  const [serviceInfos, setServiceInfos] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // ---------- LOAD ----------
  const loadServiceInfos = useCallback(async () => {
    try {
      setLoading(true);
      const infos = await managedWordPressService.getServiceInfos(serviceName);
      setServiceInfos(infos);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadServiceInfos(); }, [loadServiceInfos]);

  // ---------- HANDLERS ----------
  const handleResetPassword = async () => {
    if (!confirm(t("general.confirmResetPassword"))) return;
    setActionLoading("password");
    try {
      const newPassword = await managedWordPressService.resetAdminPassword(serviceName);
      alert(`${t("general.newPassword")}: ${newPassword}`);
      onRefresh();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateWordPress = async () => {
    if (!confirm(t("general.confirmUpdate"))) return;
    setActionLoading("update");
    try {
      await managedWordPressService.updateWordPress(serviceName);
      alert(t("general.updateStarted"));
      onRefresh();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleFlushCache = async () => {
    setActionLoading("cache");
    try {
      await managedWordPressService.flushCache(serviceName);
      alert(t("general.cacheCleared"));
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    const confirmText = prompt(t("general.confirmDeletePrompt", { name: serviceName }));
    if (confirmText !== serviceName) {
      alert(t("general.deleteAborted"));
      return;
    }
    setActionLoading("delete");
    try {
      await managedWordPressService.deleteInstance(serviceName);
      alert(t("general.deleteSuccess"));
      window.location.reload();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setActionLoading(null);
    }
  };

  // ---------- HELPERS ----------
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  const getStateBadge = (state: string) => {
    const map: Record<string, { class: string; label: string }> = {
      active: { class: "success", label: "Actif" },
      installing: { class: "warning", label: "Installation..." },
      updating: { class: "warning", label: "Mise à jour..." },
      suspended: { class: "error", label: "Suspendu" },
    };
    return map[state] || { class: "inactive", label: state };
  };

  // ---------- RENDER ----------
  return (
    <div className="wp-general-tab">
      {/* Quick Actions */}
      <div className="quick-actions">
        <a 
          href={`${details.url}/wp-admin`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          📝 {t("general.accessAdmin")}
        </a>
        <a 
          href={details.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-secondary"
        >
          🌐 {t("general.visitSite")}
        </a>
        <button 
          className="btn btn-secondary"
          onClick={handleFlushCache}
          disabled={actionLoading === "cache"}
        >
          {actionLoading === "cache" ? "..." : "🗑️"} {t("general.flushCache")}
        </button>
      </div>

      {/* Layout 2 colonnes */}
      <div className="general-grid-2col">
        {/* Colonne 1: Infos WordPress */}
        <section className="general-card">
          <h4>{t("general.wpInfo")}</h4>
          
          <div className="info-row">
            <span className="info-label">{t("general.state")}</span>
            <span className="info-value">
              <span className={`badge ${getStateBadge(details.state).class}`}>
                {getStateBadge(details.state).label}
              </span>
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">{t("general.wpVersion")}</span>
            <span className="info-value">
              WordPress {details.wpVersion}
              {details.updateAvailable && (
                <button 
                  className="btn btn-sm btn-warning ml-2"
                  onClick={handleUpdateWordPress}
                  disabled={actionLoading === "update"}
                >
                  {actionLoading === "update" ? "..." : "⬆️"} Mettre à jour
                </button>
              )}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">{t("general.phpVersion")}</span>
            <span className="info-value">PHP {details.phpVersion || "8.1"}</span>
          </div>

          <div className="info-row">
            <span className="info-label">{t("general.url")}</span>
            <span className="info-value copyable">
              <a href={details.url} target="_blank" rel="noopener noreferrer">{details.url}</a>
              <button className="copy-btn" onClick={() => copyToClipboard(details.url)} title="Copier">📋</button>
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">{t("general.adminUrl")}</span>
            <span className="info-value copyable">
              <a href={`${details.url}/wp-admin`} target="_blank" rel="noopener noreferrer">{details.url}/wp-admin</a>
              <button className="copy-btn" onClick={() => copyToClipboard(`${details.url}/wp-admin`)} title="Copier">📋</button>
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">{t("general.adminUser")}</span>
            <span className="info-value copyable">
              <code>{details.adminUser || "admin"}</code>
              <button className="copy-btn" onClick={() => copyToClipboard(details.adminUser || "admin")} title="Copier">📋</button>
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">{t("general.adminPassword")}</span>
            <span className="info-value">
              <button 
                className="btn btn-sm btn-secondary"
                onClick={handleResetPassword}
                disabled={actionLoading === "password"}
              >
                {actionLoading === "password" ? "..." : "🔑"} {t("general.resetPassword")}
              </button>
            </span>
          </div>
        </section>

        {/* Colonne 2: Infos techniques */}
        <section className="general-card">
          <h4>{t("general.technicalInfo")}</h4>
          
          <div className="info-row">
            <span className="info-label">{t("general.offer")}</span>
            <span className="info-value"><strong>{details.offer || "WordPress Standard"}</strong></span>
          </div>

          <div className="info-row">
            <span className="info-label">{t("general.datacenter")}</span>
            <span className="info-value">{details.datacenter || "-"}</span>
          </div>

          <div className="info-row">
            <span className="info-label">{t("general.ssl")}</span>
            <span className="info-value">
              <span className={`badge ${details.sslEnabled ? "success" : "inactive"}`}>
                {details.sslEnabled ? "Actif (Let's Encrypt)" : "Non activé"}
              </span>
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">{t("general.cdn")}</span>
            <span className="info-value">
              <span className={`badge ${details.cdnEnabled ? "success" : "inactive"}`}>
                {details.cdnEnabled ? "Actif" : "Non activé"}
              </span>
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">{t("general.autoUpdate")}</span>
            <span className="info-value">
              <span className={`badge ${details.autoUpdate ? "success" : "warning"}`}>
                {details.autoUpdate ? "Activé" : "Désactivé"}
              </span>
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">{t("general.creation")}</span>
            <span className="info-value">{formatDate(serviceInfos?.creation)}</span>
          </div>

          <div className="info-row">
            <span className="info-label">{t("general.expiration")}</span>
            <span className="info-value">{formatDate(serviceInfos?.expiration)}</span>
          </div>
        </section>
      </div>

      {/* Danger Zone */}
      <section className="danger-zone-section">
        <h4>{t("general.dangerZone")}</h4>
        <div className="danger-zone-content">
          <div className="danger-item">
            <div>
              <strong>{t("general.deleteInstance")}</strong>
              <p>{t("general.deleteWarning")}</p>
            </div>
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={actionLoading === "delete"}
            >
              {actionLoading === "delete" ? "..." : "🗑️"} {t("general.delete")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GeneralTab;
