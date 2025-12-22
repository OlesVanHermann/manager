// ============================================================
// HOSTING TAB: GENERAL - Informations générales enrichies
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Hosting, HostingServiceInfos } from "../../../../../services/web-cloud.hosting";

interface Props { serviceName: string; }

/** Onglet Informations générales avec détails complets. */
export function GeneralTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [details, setDetails] = useState<Hosting | null>(null);
  const [serviceInfos, setServiceInfos] = useState<HostingServiceInfos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [hosting, infos] = await Promise.all([
        hostingService.getHosting(serviceName),
        hostingService.getServiceInfos(serviceName),
      ]);
      setDetails(hosting);
      setServiceInfos(infos);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadData(); }, [loadData]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} Ko`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} Go`;
  };

  const getQuotaPercent = () => {
    if (!details?.quotaUsed?.value || !details?.quotaSize?.value) return 0;
    return Math.round((details.quotaUsed.value / details.quotaSize.value) * 100);
  };

  const getStateBadge = (state?: string) => {
    const map: Record<string, { class: string; label: string }> = {
      active: { class: 'success', label: t("state.active") },
      bloqued: { class: 'error', label: t("state.bloqued") },
      maintenance: { class: 'warning', label: t("state.maintenance") },
    };
    const s = map[state || 'active'] || map.active;
    return <span className={`badge ${s.class}`}>{s.label}</span>;
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!details) return null;

  return (
    <div className="general-tab">
      {/* Section Informations générales */}
      <section className="info-section">
        <h4>{t("generalInfo.title")}</h4>
        <div className="info-grid">
          <div className="info-item">
            <label>{t("generalInfo.serviceName")}</label>
            <span className="font-mono">{details.serviceName}</span>
          </div>
          {details.displayName && (
            <div className="info-item">
              <label>{t("generalInfo.displayName")}</label>
              <span>{details.displayName}</span>
            </div>
          )}
          <div className="info-item">
            <label>{t("generalInfo.offer")}</label>
            <span>{details.offer}</span>
          </div>
          <div className="info-item">
            <label>{t("generalInfo.state")}</label>
            {getStateBadge(details.state)}
          </div>
          <div className="info-item">
            <label>{t("generalInfo.cluster")}</label>
            <span>cluster{details.cluster}.hosting.ovh.net</span>
          </div>
          <div className="info-item">
            <label>{t("generalInfo.ip")}</label>
            <span className="font-mono copyable">
              {details.hostingIp}
              <button className="copy-btn" title="Copier" onClick={() => navigator.clipboard.writeText(details.hostingIp)}>📋</button>
            </span>
          </div>
          {details.hostingIpv6 && (
            <div className="info-item">
              <label>{t("generalInfo.ipv6")}</label>
              <span className="font-mono">{details.hostingIpv6}</span>
            </div>
          )}
          <div className="info-item">
            <label>{t("generalInfo.os")}</label>
            <span>{details.operatingSystem}</span>
          </div>
          <div className="info-item">
            <label>{t("generalInfo.home")}</label>
            <span className="font-mono">{details.home}</span>
          </div>
        </div>
      </section>

      {/* Section Quotas */}
      <section className="info-section">
        <h4>{t("quotaInfo.title")}</h4>
        
        {/* Espace disque */}
        <div className="quota-section">
          <div className="quota-header">
            <label>{t("quotaInfo.diskUsage")}</label>
            <span className="quota-value">
              {formatSize(details.quotaUsed?.value)} / {formatSize(details.quotaSize?.value)}
            </span>
          </div>
          <div className="quota-bar">
            <div 
              className={`quota-fill ${getQuotaPercent() > 90 ? 'critical' : getQuotaPercent() > 70 ? 'warning' : ''}`} 
              style={{ width: `${getQuotaPercent()}%` }} 
            />
          </div>
          <span className="quota-percent">{getQuotaPercent()}% utilisé</span>
        </div>

        {/* Options */}
        <div className="info-grid" style={{ marginTop: 'var(--space-4)' }}>
          <div className="info-item">
            <label>{t("quotaInfo.cdn")}</label>
            <span className={`badge ${details.hasCdn ? 'success' : 'inactive'}`}>
              {details.hasCdn ? 'Activé' : 'Désactivé'}
            </span>
          </div>
          <div className="info-item">
            <label>{t("quotaInfo.ssl")}</label>
            <span className={`badge ${details.hasHostedSsl ? 'success' : 'inactive'}`}>
              {details.hasHostedSsl ? 'Activé' : 'Désactivé'}
            </span>
          </div>
          <div className="info-item">
            <label>{t("quotaInfo.boost")}</label>
            <span className={`badge ${details.boostOffer ? 'success' : 'inactive'}`}>
              {details.boostOffer || 'Désactivé'}
            </span>
          </div>
        </div>
      </section>

      {/* Section Informations service */}
      {serviceInfos && (
        <section className="info-section">
          <h4>{t("serviceInfo.title")}</h4>
          <div className="info-grid">
            <div className="info-item">
              <label>{t("serviceInfo.creation")}</label>
              <span>{formatDate(serviceInfos.creation)}</span>
            </div>
            <div className="info-item">
              <label>{t("serviceInfo.expiration")}</label>
              <span>{formatDate(serviceInfos.expiration)}</span>
            </div>
            <div className="info-item">
              <label>{t("serviceInfo.autoRenew")}</label>
              <span className={`badge ${serviceInfos.renew?.automatic ? 'success' : 'warning'}`}>
                {serviceInfos.renew?.automatic ? 'Activé' : 'Désactivé'}
              </span>
            </div>
            <div className="info-item">
              <label>{t("serviceInfo.contactAdmin")}</label>
              <span>{serviceInfos.contactAdmin}</span>
            </div>
            <div className="info-item">
              <label>{t("serviceInfo.contactTech")}</label>
              <span>{serviceInfos.contactTech}</span>
            </div>
          </div>
        </section>
      )}

      {/* Actions */}
      <section className="actions-section">
        <button className="btn btn-secondary">Modifier l'offre</button>
        <button className="btn btn-secondary">Renouveler</button>
        <a 
          href={`https://www.ovh.com/manager/#/web/hosting/${serviceName}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-secondary"
        >
          Ouvrir dans l'ancien manager ↗
        </a>
      </section>
    </div>
  );
}

export default GeneralTab;
