// ============================================================
// TAB: GENERAL - Informations du domaine
// ============================================================

import { useTranslation } from "react-i18next";
import { Domain, DomainServiceInfos } from "../../../../services/domains.service";

interface Props {
  domain: string;
  details?: Domain;
  serviceInfos?: DomainServiceInfos;
  loading: boolean;
}

/** Onglet informations generales du domaine. */
export function GeneralTab({ domain, details, serviceInfos, loading }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");

  if (loading) {
    return <div className="tab-loading"><div className="skeleton-block" /><div className="skeleton-block" /></div>;
  }

  return (
    <div className="general-tab">
      <section className="info-section">
        <h3>{t("generalInfo.title")}</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>{t("generalInfo.domain")}</label>
            <span>{domain}</span>
          </div>
          {details && (
            <>
              <div className="info-item">
                <label>{t("generalInfo.offer")}</label>
                <span>{details.offer}</span>
              </div>
              <div className="info-item">
                <label>{t("generalInfo.dnsType")}</label>
                <span className={`badge ${details.nameServerType}`}>{details.nameServerType}</span>
              </div>
              <div className="info-item">
                <label>{t("generalInfo.transferLock")}</label>
                <span className={`badge ${details.transferLockStatus}`}>
                  {details.transferLockStatus === 'locked' ? '🔒 ' : '🔓 '}{details.transferLockStatus}
                </span>
              </div>
              <div className="info-item">
                <label>{t("generalInfo.owner")}</label>
                <span>{details.whoisOwner}</span>
              </div>
              <div className="info-item">
                <label>{t("generalInfo.owoSupported")}</label>
                <span className={`badge ${details.owoSupported ? 'success' : 'inactive'}`}>
                  {details.owoSupported ? '✓' : '✗'}
                </span>
              </div>
            </>
          )}
        </div>
      </section>

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
                {isExpiringSoon(serviceInfos.expiration) && " ⚠️"}
              </span>
            </div>
            <div className="info-item">
              <label>{t("serviceInfo.autoRenew")}</label>
              <span className={`badge ${serviceInfos.renew.automatic ? "success" : "warning"}`}>
                {serviceInfos.renew.automatic ? "✓ Actif" : "✗ Inactif"}
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
            <div className="info-item">
              <label>{t("serviceInfo.contactBilling")}</label>
              <span>{serviceInfos.contactBilling}</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function isExpiringSoon(expiration: string): boolean {
  const expiryDate = new Date(expiration);
  const now = new Date();
  const daysUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return daysUntilExpiry < 30;
}

export default GeneralTab;
