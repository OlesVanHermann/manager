// ============================================================
// PRIVATE DB TAB: GENERAL
// ============================================================

import { useTranslation } from "react-i18next";
import { PrivateDatabase, PrivateDatabaseServiceInfos } from "../../../../services/web-cloud.private-database";

interface Props { serviceName: string; details?: PrivateDatabase; serviceInfos?: PrivateDatabaseServiceInfos; loading: boolean; }

export function GeneralTab({ serviceName, details, serviceInfos, loading }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  if (loading) return <div className="tab-loading"><div className="skeleton-block" /><div className="skeleton-block" /></div>;

  const formatSize = (q: { value: number; unit: string } | undefined) => q ? `${q.value} ${q.unit}` : '-';
  const quotaPercent = details?.quotaSize && details?.quotaUsed ? Math.round((details.quotaUsed.value / details.quotaSize.value) * 100) : 0;

  return (
    <div className="general-tab">
      <section className="info-section">
        <h3>{t("general.title")}</h3>
        <div className="info-grid">
          <div className="info-item"><label>{t("general.serviceName")}</label><span className="font-mono">{serviceName}</span></div>
          {details && (<>
            <div className="info-item"><label>{t("general.type")}</label><span className={`badge db-${details.type}`}>{details.type} {details.version}</span></div>
            <div className="info-item"><label>{t("general.state")}</label><span className={`badge ${details.state === 'started' ? 'success' : 'warning'}`}>{details.state}</span></div>
            <div className="info-item"><label>{t("general.offer")}</label><span>{details.offer}</span></div>
            <div className="info-item"><label>{t("general.datacenter")}</label><span>{details.datacenter}</span></div>
            <div className="info-item"><label>{t("general.hostname")}</label><span className="font-mono">{details.hostname}:{details.port}</span></div>
            <div className="info-item"><label>{t("general.ram")}</label><span>{formatSize(details.ram)}</span></div>
            <div className="info-item"><label>{t("general.cpu")}</label><span>{details.cpu} vCPU</span></div>
          </>)}
        </div>
      </section>
      {details && (
        <section className="info-section">
          <h3>{t("general.storage")}</h3>
          <div className="quota-display">
            <div className="quota-bar"><div className="quota-fill" style={{ width: `${Math.min(quotaPercent, 100)}%` }} /></div>
            <div className="quota-text"><span>{formatSize(details.quotaUsed)} / {formatSize(details.quotaSize)}</span><span className={quotaPercent > 90 ? 'warning' : ''}>{quotaPercent}%</span></div>
          </div>
        </section>
      )}
      {serviceInfos && (
        <section className="info-section">
          <h3>{t("general.service")}</h3>
          <div className="info-grid">
            <div className="info-item"><label>{t("general.creation")}</label><span>{new Date(serviceInfos.creation).toLocaleDateString()}</span></div>
            <div className="info-item"><label>{t("general.expiration")}</label><span>{new Date(serviceInfos.expiration).toLocaleDateString()}</span></div>
            <div className="info-item"><label>{t("general.autoRenew")}</label><span className={`badge ${serviceInfos.renew?.automatic ? 'success' : 'warning'}`}>{serviceInfos.renew?.automatic ? '✓' : '✗'}</span></div>
          </div>
        </section>
      )}
    </div>
  );
}

export default GeneralTab;
