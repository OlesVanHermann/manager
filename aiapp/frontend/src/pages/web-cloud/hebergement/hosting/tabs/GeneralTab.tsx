// ============================================================
// HOSTING TAB: GENERAL - Informations de l'hebergement
// ============================================================

import { useTranslation } from "react-i18next";
import { Hosting, HostingServiceInfos } from "../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  details?: Hosting;
  serviceInfos?: HostingServiceInfos;
  loading: boolean;
}

/** Onglet informations generales de l'hebergement. */
export function GeneralTab({ serviceName, details, serviceInfos, loading }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");

  if (loading) {
    return <div className="tab-loading"><div className="skeleton-block" /><div className="skeleton-block" /></div>;
  }

  const formatQuota = (quota: { value: number; unit: string } | null | undefined) => {
    if (!quota) return '-';
    if (quota.unit === 'MB') return `${(quota.value / 1024).toFixed(2)} GB`;
    if (quota.unit === 'GB') return `${quota.value} GB`;
    return `${quota.value} ${quota.unit}`;
  };

  const quotaPercent = details?.quotaSize && details?.quotaUsed 
    ? Math.round((details.quotaUsed.value / details.quotaSize.value) * 100) 
    : 0;

  return (
    <div className="general-tab">
      <section className="info-section">
        <h3>{t("generalInfo.title")}</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>{t("generalInfo.serviceName")}</label>
            <span className="font-mono">{serviceName}</span>
          </div>
          {details && (
            <>
              <div className="info-item">
                <label>{t("generalInfo.offer")}</label>
                <span className="badge success">{details.offer}</span>
              </div>
              <div className="info-item">
                <label>{t("generalInfo.state")}</label>
                <span className={`badge ${details.state === 'active' ? 'success' : 'warning'}`}>
                  {details.state === 'active' ? '✓ ' : '⚠ '}{t(`state.${details.state}`)}
                </span>
              </div>
              <div className="info-item">
                <label>{t("generalInfo.cluster")}</label>
                <span>{details.cluster}</span>
              </div>
              <div className="info-item">
                <label>{t("generalInfo.ip")}</label>
                <span className="font-mono">{details.hostingIp}</span>
              </div>
              <div className="info-item">
                <label>{t("generalInfo.ipv6")}</label>
                <span className="font-mono">{details.hostingIpv6 || '-'}</span>
              </div>
              <div className="info-item">
                <label>{t("generalInfo.os")}</label>
                <span>{details.operatingSystem}</span>
              </div>
              <div className="info-item">
                <label>{t("generalInfo.home")}</label>
                <span className="font-mono">{details.home}</span>
              </div>
            </>
          )}
        </div>
      </section>

      {details && (
        <section className="info-section">
          <h3>{t("quotaInfo.title")}</h3>
          <div className="quota-display">
            <div className="quota-bar">
              <div className="quota-fill" style={{ width: `${Math.min(quotaPercent, 100)}%` }} />
            </div>
            <div className="quota-text">
              <span>{formatQuota(details.quotaUsed)} / {formatQuota(details.quotaSize)}</span>
              <span className={quotaPercent > 90 ? 'warning' : ''}>{quotaPercent}%</span>
            </div>
          </div>
          <div className="info-grid" style={{ marginTop: 'var(--space-4)' }}>
            <div className="info-item">
              <label>{t("quotaInfo.cdn")}</label>
              <span className={`badge ${details.hasCdn ? 'success' : 'inactive'}`}>
                {details.hasCdn ? '✓ Actif' : '✗ Inactif'}
              </span>
            </div>
            <div className="info-item">
              <label>{t("quotaInfo.ssl")}</label>
              <span className={`badge ${details.hasHostedSsl ? 'success' : 'inactive'}`}>
                {details.hasHostedSsl ? '✓ Actif' : '✗ Inactif'}
              </span>
            </div>
            <div className="info-item">
              <label>{t("quotaInfo.boost")}</label>
              <span>{details.boostOffer || '-'}</span>
            </div>
          </div>
        </section>
      )}

      {serviceInfos && (
        <section className="info-section">
          <h3>{t("serviceInfo.title")}</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>{t("serviceInfo.creation")}</label>
              <span>{new Date(serviceInfos.creation).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>{t("serviceInfo.expiration")}</label>
              <span className={isExpiringSoon(serviceInfos.expiration) ? "expiring" : ""}>
                {new Date(serviceInfos.expiration).toLocaleDateString()}
              </span>
            </div>
            <div className="info-item">
              <label>{t("serviceInfo.autoRenew")}</label>
              <span className={`badge ${serviceInfos.renew.automatic ? "success" : "warning"}`}>
                {serviceInfos.renew.automatic ? "✓ Actif" : "✗ Inactif"}
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function isExpiringSoon(expiration: string): boolean {
  const days = (new Date(expiration).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return days < 30;
}

export default GeneralTab;
