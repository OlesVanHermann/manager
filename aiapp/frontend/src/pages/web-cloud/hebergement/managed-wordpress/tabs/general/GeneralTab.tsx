// ============================================================
// MANAGED WORDPRESS TAB: GENERAL
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { generalService } from "./GeneralTab";
import type { ManagedWordPress } from "../../managed-wordpress.types";
import "./GeneralTab.css";

interface Props {
  serviceName: string;
  details: ManagedWordPress;
  onRefresh: () => void;
}

export function GeneralTab({ serviceName, details, onRefresh }: Props) {
  const { t } = useTranslation("web-cloud/managed-wordpress/index");
  const [serviceInfos, setServiceInfos] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadServiceInfos = useCallback(async () => {
    try {
      setLoading(true);
      const infos = await generalService.getServiceInfos(serviceName);
      setServiceInfos(infos);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadServiceInfos(); }, [loadServiceInfos]);

  const handleResetPassword = async () => {
    if (!confirm(t("general.confirmResetPassword"))) return;
    setActionLoading("password");
    try {
      const newPassword = await generalService.resetAdminPassword(serviceName);
      alert(`${t("general.newPassword")}: ${newPassword}`);
      onRefresh();
    } catch (err) { alert(`Erreur: ${err}`); }
    finally { setActionLoading(null); }
  };

  const handleUpdateWordPress = async () => {
    if (!confirm(t("general.confirmUpdate"))) return;
    setActionLoading("update");
    try {
      await generalService.updateWordPress(serviceName);
      alert(t("general.updateStarted"));
      onRefresh();
    } catch (err) { alert(`Erreur: ${err}`); }
    finally { setActionLoading(null); }
  };

  const handleFlushCache = async () => {
    setActionLoading("cache");
    try {
      await generalService.flushCache(serviceName);
      alert(t("general.cacheCleared"));
    } catch (err) { alert(`Erreur: ${err}`); }
    finally { setActionLoading(null); }
  };

  const handleDelete = async () => {
    const confirmText = prompt(t("general.confirmDeletePrompt", { name: serviceName }));
    if (confirmText !== serviceName) { alert(t("general.deleteAborted")); return; }
    setActionLoading("delete");
    try {
      await generalService.deleteInstance(serviceName);
      alert(t("general.deleteSuccess"));
      window.location.reload();
    } catch (err) { alert(`Erreur: ${err}`); }
    finally { setActionLoading(null); }
  };

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);
  const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "-";
  const getStateBadge = (state: string) => {
    const map: Record<string, { class: string; label: string }> = {
      active: { class: "success", label: "Actif" },
      installing: { class: "warning", label: "Installation..." },
      updating: { class: "warning", label: "Mise à jour..." },
      suspended: { class: "error", label: "Suspendu" },
    };
    return map[state] || { class: "inactive", label: state };
  };

  return (
    <div className="general-tab">
      <div className="general-quick-actions">
        <a href={`${details.url}/wp-admin`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">📝 {t("general.accessAdmin")}</a>
        <a href={details.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">🌐 {t("general.visitSite")}</a>
        <button className="btn btn-secondary" onClick={handleFlushCache} disabled={actionLoading === "cache"}>
          {actionLoading === "cache" ? "..." : "🗑️"} {t("general.flushCache")}
        </button>
      </div>

      <div className="general-grid-2col">
        <section className="general-card">
          <h4>{t("general.wpInfo")}</h4>
          <div className="general-info-row">
            <span className="general-info-label">{t("general.state")}</span>
            <span className="general-info-value"><span className={`badge ${getStateBadge(details.state).class}`}>{getStateBadge(details.state).label}</span></span>
          </div>
          <div className="general-info-row">
            <span className="general-info-label">{t("general.wpVersion")}</span>
            <span className="general-info-value">
              WordPress {details.wpVersion || details.wordpressVersion}
              {details.updateAvailable && <button className="btn btn-sm btn-warning" onClick={handleUpdateWordPress} disabled={actionLoading === "update"}>{actionLoading === "update" ? "..." : "⬆️"} Mettre à jour</button>}
            </span>
          </div>
          <div className="general-info-row">
            <span className="general-info-label">{t("general.phpVersion")}</span>
            <span className="general-info-value">PHP {details.phpVersion || "8.1"}</span>
          </div>
          <div className="general-info-row">
            <span className="general-info-label">{t("general.url")}</span>
            <span className="general-info-value general-copyable">
              <a href={details.url} target="_blank" rel="noopener noreferrer">{details.url}</a>
              <button className="general-copy-btn" onClick={() => copyToClipboard(details.url)} title="Copier">📋</button>
            </span>
          </div>
          <div className="general-info-row">
            <span className="general-info-label">{t("general.adminUser")}</span>
            <span className="general-info-value general-copyable">
              <code>{details.adminUser || "admin"}</code>
              <button className="general-copy-btn" onClick={() => copyToClipboard(details.adminUser || "admin")} title="Copier">📋</button>
            </span>
          </div>
          <div className="general-info-row">
            <span className="general-info-label">{t("general.adminPassword")}</span>
            <span className="general-info-value">
              <button className="btn btn-sm btn-secondary" onClick={handleResetPassword} disabled={actionLoading === "password"}>
                {actionLoading === "password" ? "..." : "🔑"} {t("general.resetPassword")}
              </button>
            </span>
          </div>
        </section>

        <section className="general-card">
          <h4>{t("general.technicalInfo")}</h4>
          <div className="general-info-row"><span className="general-info-label">{t("general.offer")}</span><span className="general-info-value"><strong>{details.offer || "WordPress Standard"}</strong></span></div>
          <div className="general-info-row"><span className="general-info-label">{t("general.datacenter")}</span><span className="general-info-value">{details.datacenter || "-"}</span></div>
          <div className="general-info-row"><span className="general-info-label">{t("general.ssl")}</span><span className="general-info-value"><span className={`badge ${details.sslEnabled ? "success" : "inactive"}`}>{details.sslEnabled ? "Actif (Let's Encrypt)" : "Non activé"}</span></span></div>
          <div className="general-info-row"><span className="general-info-label">{t("general.cdn")}</span><span className="general-info-value"><span className={`badge ${details.cdnEnabled ? "success" : "inactive"}`}>{details.cdnEnabled ? "Actif" : "Non activé"}</span></span></div>
          <div className="general-info-row"><span className="general-info-label">{t("general.autoUpdate")}</span><span className="general-info-value"><span className={`badge ${details.autoUpdate ? "success" : "warning"}`}>{details.autoUpdate ? "Activé" : "Désactivé"}</span></span></div>
          <div className="general-info-row"><span className="general-info-label">{t("general.creation")}</span><span className="general-info-value">{formatDate(serviceInfos?.creation)}</span></div>
          <div className="general-info-row"><span className="general-info-label">{t("general.expiration")}</span><span className="general-info-value">{formatDate(serviceInfos?.expiration)}</span></div>
        </section>
      </div>

      <section className="general-danger-zone">
        <h4>{t("general.dangerZone")}</h4>
        <div className="general-danger-content">
          <div><strong>{t("general.deleteInstance")}</strong><p>{t("general.deleteWarning")}</p></div>
          <button className="btn btn-danger" onClick={handleDelete} disabled={actionLoading === "delete"}>{actionLoading === "delete" ? "..." : "🗑️"} {t("general.delete")}</button>
        </div>
      </section>
    </div>
  );
}

export default GeneralTab;
