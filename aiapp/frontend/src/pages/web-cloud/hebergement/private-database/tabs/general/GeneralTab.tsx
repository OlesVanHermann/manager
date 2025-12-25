// ============================================================
// PRIVATE DATABASE TAB: GENERAL - Informations générales
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { generalService } from "./GeneralTab.service";
import type { PrivateDatabase, PrivateDatabaseServiceInfos } from "../../private-database.types";
import "./GeneralTab.css";

interface Props {
  serviceName: string;
  details: PrivateDatabase;
  onRefresh: () => void;
}

/** Onglet Informations générales avec actions serveur. */
export function GeneralTab({ serviceName, details, onRefresh }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [serviceInfos, setServiceInfos] = useState<PrivateDatabaseServiceInfos | null>(null);
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

  const handleServerAction = async (action: "start" | "stop" | "restart") => {
    const confirmMsg = {
      start: "Voulez-vous démarrer le serveur ?",
      stop: "Voulez-vous arrêter le serveur ?",
      restart: "Voulez-vous redémarrer le serveur ?",
    };
    if (!confirm(confirmMsg[action])) return;

    try {
      setActionLoading(action);
      switch (action) {
        case "start": await generalService.startServer(serviceName); break;
        case "stop": await generalService.stopServer(serviceName); break;
        case "restart": await generalService.restartServer(serviceName); break;
      }
      setTimeout(onRefresh, 2000);
    } catch (err) {
      alert(String(err));
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} Ko`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} Go`;
  };

  const getQuotaPercent = () => {
    if (!details.quotaUsed?.value || !details.quotaSize?.value) return 0;
    return Math.round((details.quotaUsed.value / details.quotaSize.value) * 100);
  };

  const isStarted = details.state === "started";
  const isStopped = details.state === "stopped";

  return (
    <div className="general-tab">
      {/* Actions serveur */}
      <section className="general-server-actions">
        <h4>{t("general.serverActions")}</h4>
        <div className="general-action-buttons">
          <button 
            className="btn general-btn-success btn-sm" 
            onClick={() => handleServerAction("start")}
            disabled={isStarted || !!actionLoading}
          >
            {actionLoading === "start" ? "Démarrage..." : "▶ Démarrer"}
          </button>
          <button 
            className="btn general-btn-warning btn-sm" 
            onClick={() => handleServerAction("restart")}
            disabled={isStopped || !!actionLoading}
          >
            {actionLoading === "restart" ? "Redémarrage..." : "↻ Redémarrer"}
          </button>
          <button 
            className="btn general-btn-danger btn-sm" 
            onClick={() => handleServerAction("stop")}
            disabled={isStopped || !!actionLoading}
          >
            {actionLoading === "stop" ? "Arrêt..." : "■ Arrêter"}
          </button>
        </div>
      </section>

      {/* Informations générales */}
      <section className="general-info-section">
        <h4>{t("general.title")}</h4>
        <div className="general-info-grid">
          <div className="general-info-item">
            <label>{t("general.serviceName")}</label>
            <span className="font-mono">{details.serviceName}</span>
          </div>
          <div className="general-info-item">
            <label>{t("general.type")}</label>
            <span>{details.type} {details.version}</span>
          </div>
          <div className="general-info-item">
            <label>{t("general.offer")}</label>
            <span>{details.offer}</span>
          </div>
          <div className="general-info-item">
            <label>{t("general.hostname")}</label>
            <span className="font-mono general-copyable">
              {details.hostname}
              <button className="general-copy-btn" onClick={() => navigator.clipboard.writeText(details.hostname)}>📋</button>
            </span>
          </div>
          <div className="general-info-item">
            <label>{t("general.port")}</label>
            <span className="font-mono">{details.port}</span>
          </div>
          {details.hostnameFtp && (
            <div className="general-info-item">
              <label>{t("general.hostnameFtp")}</label>
              <span className="font-mono">{details.hostnameFtp}:{details.portFtp}</span>
            </div>
          )}
          <div className="general-info-item">
            <label>{t("general.datacenter")}</label>
            <span>{details.datacenter || 'EU'}</span>
          </div>
          <div className="general-info-item">
            <label>{t("general.infrastructure")}</label>
            <span className="badge info">{details.infrastructure || 'docker'}</span>
          </div>
        </div>
      </section>

      {/* Ressources */}
      <section className="general-info-section">
        <h4>{t("general.resources")}</h4>
        
        {/* Espace disque */}
        <div className="general-quota-section">
          <div className="general-quota-header">
            <label>{t("general.diskUsage")}</label>
            <span className="general-quota-value">
              {formatSize(details.quotaUsed?.value)} / {formatSize(details.quotaSize?.value)}
            </span>
          </div>
          <div className="general-quota-bar">
            <div 
              className={`general-quota-fill ${getQuotaPercent() > 90 ? 'critical' : getQuotaPercent() > 70 ? 'warning' : ''}`}
              style={{ width: `${getQuotaPercent()}%` }}
            />
          </div>
          <span className="general-quota-percent">{getQuotaPercent()}% utilisé</span>
        </div>

        <div className="general-info-grid" style={{ marginTop: 'var(--space-4)' }}>
          {details.ram && (
            <div className="general-info-item">
              <label>{t("general.ram")}</label>
              <span>{details.ram.value} {details.ram.unit}</span>
            </div>
          )}
          {details.cpu && (
            <div className="general-info-item">
              <label>{t("general.cpu")}</label>
              <span>{details.cpu} vCore(s)</span>
            </div>
          )}
        </div>
      </section>

      {/* Informations service */}
      {serviceInfos && (
        <section className="general-info-section">
          <h4>{t("general.serviceInfo")}</h4>
          <div className="general-info-grid">
            <div className="general-info-item">
              <label>{t("general.creation")}</label>
              <span>{formatDate(serviceInfos.creation)}</span>
            </div>
            <div className="general-info-item">
              <label>{t("general.expiration")}</label>
              <span>{formatDate(serviceInfos.expiration)}</span>
            </div>
            <div className="general-info-item">
              <label>{t("general.autoRenew")}</label>
              <span className={`badge ${serviceInfos.renew?.automatic ? 'success' : 'warning'}`}>
                {serviceInfos.renew?.automatic ? 'Activé' : 'Désactivé'}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Connexion info */}
      <section className="general-connection-section">
        <h4>{t("general.connectionInfo")}</h4>
        <div className="general-info-banner">
          <span className="general-info-icon">ℹ</span>
          <div>
            <p><strong>Chaîne de connexion:</strong></p>
            <code className="general-connection-string">
              {details.type}://{details.hostname}:{details.port}
            </code>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GeneralTab;
