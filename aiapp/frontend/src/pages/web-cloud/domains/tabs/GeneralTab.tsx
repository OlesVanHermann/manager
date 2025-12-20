// ============================================================
// TAB: GENERAL - Informations du domaine
// ============================================================

import { useTranslation } from "react-i18next";
import { Domain, DomainServiceInfos } from "../../../../services/web-cloud.domains";

interface Props {
  domain: string;
  details?: Domain;
  serviceInfos?: DomainServiceInfos;
  loading: boolean;
}

/** Onglet informations générales du domaine. */
export function GeneralTab({ domain, details, serviceInfos, loading }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");

  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    );
  }

  const isExpiringSoon = (expiration: string): boolean => {
    const expiryDate = new Date(expiration);
    const now = new Date();
    const daysUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry < 30;
  };

  return (
    <div className="general-tab">
      {details && (
        <div className={`domain-status-card ${details.transferLockStatus}`}>
          <div className={`status-icon ${details.transferLockStatus}`}>
            {details.transferLockStatus === "locked" ? "🔒" : "🔓"}
          </div>
          <div className="status-content">
            <h4>{details.transferLockStatus === "locked" ? t("status.locked") : t("status.unlocked")}</h4>
            <p>{details.transferLockStatus === "locked" ? t("status.lockedDesc") : t("status.unlockedDesc")}</p>
          </div>
        </div>
      )}

      <section className="info-section">
        <h3>{t("generalInfo.title")}</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>{t("generalInfo.domain")}</label>
            <span className="font-mono">{domain}</span>
          </div>
          {details && (
            <>
              <div className="info-item">
                <label>{t("generalInfo.offer")}</label>
                <span className="badge info">{details.offer}</span>
              </div>
              <div className="info-item">
                <label>{t("generalInfo.dnsType")}</label>
                <span className={`badge ${details.nameServerType === "hosted" ? "success" : "warning"}`}>
                  {details.nameServerType}
                </span>
              </div>
              <div className="info-item">
                <label>{t("generalInfo.owner")}</label>
                <span>{details.whoisOwner}</span>
              </div>
              <div className="info-item">
                <label>{t("generalInfo.owoSupported")}</label>
                <span className={`badge ${details.owoSupported ? "success" : "inactive"}`}>
                  {details.owoSupported ? "✓ Oui" : "✗ Non"}
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
              <span>{new Date(serviceInfos.creation).toLocaleDateString("fr-FR")}</span>
            </div>
            <div className="info-item">
              <label>{t("serviceInfo.expiration")}</label>
              <span className={isExpiringSoon(serviceInfos.expiration) ? "expiring" : ""}>
                {new Date(serviceInfos.expiration).toLocaleDateString("fr-FR")}
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
              <span className="font-mono">{serviceInfos.contactAdmin}</span>
            </div>
            <div className="info-item">
              <label>{t("serviceInfo.contactTech")}</label>
              <span className="font-mono">{serviceInfos.contactTech}</span>
            </div>
            <div className="info-item">
              <label>{t("serviceInfo.contactBilling")}</label>
              <span className="font-mono">{serviceInfos.contactBilling}</span>
            </div>
          </div>
        </section>
      )}

      <div className="info-box">
        <h4>{t("generalInfo.tips")}</h4>
        <p>{t("generalInfo.tipsDesc")}</p>
      </div>
    </div>
  );
}

export default GeneralTab;
