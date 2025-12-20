// ============================================================
// TAB: GENERAL - Informations du domaine avec actions
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Domain, DomainServiceInfos, domainsService } from "../../../../services/web-cloud.domains";

interface Props {
  domain: string;
  details?: Domain;
  serviceInfos?: DomainServiceInfos;
  loading: boolean;
  onRefresh?: () => void;
}

// ============ ICONS ============

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const UnlockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

// ============ EXTERNAL LINKS ============

const OVH_MANAGER_BASE = "https://www.ovh.com/manager";

const getAutorenewUrl = (domain: string) => 
  `${OVH_MANAGER_BASE}/#/dedicated/billing/autorenew?searchText=${encodeURIComponent(domain)}`;

const getContactsUrl = (domain: string) => 
  `${OVH_MANAGER_BASE}/#/dedicated/contacts/services?serviceName=${encodeURIComponent(domain)}`;

// ============ COMPOSANT PRINCIPAL ============

/** Onglet informations générales du domaine avec actions. */
export function GeneralTab({ domain, details, serviceInfos, loading, onRefresh }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [toggling, setToggling] = useState(false);

  // ---------- HANDLERS ----------
  const handleToggleLock = async () => {
    if (!details) return;
    
    const isLocked = details.transferLockStatus === "locked";
    const confirmMsg = isLocked ? t("general.confirmUnlock") : t("general.confirmLock");
    
    if (!confirm(confirmMsg)) return;

    try {
      setToggling(true);
      if (isLocked) {
        await domainsService.unlockDomain(domain);
      } else {
        await domainsService.lockDomain(domain);
      }
      onRefresh?.();
    } catch (err) {
      alert(String(err));
    } finally {
      setToggling(false);
    }
  };

  // ---------- HELPERS ----------
  const isExpiringSoon = (expiration: string): boolean => {
    const expiryDate = new Date(expiration);
    const now = new Date();
    const daysUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry < 30;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    );
  }

  const isLocked = details?.transferLockStatus === "locked";
  const isLocking = details?.transferLockStatus === "locking" || details?.transferLockStatus === "unlocking";

  // ---------- RENDER ----------
  return (
    <div className="general-tab">
      {/* Transfer Lock Card */}
      {details && (
        <div className={`lock-status-card ${isLocked ? "locked" : "unlocked"}`}>
          <div className="lock-status-icon">
            {isLocked ? <LockIcon /> : <UnlockIcon />}
          </div>
          <div className="lock-status-content">
            <h4>{isLocked ? t("status.locked") : t("status.unlocked")}</h4>
            <p>{isLocked ? t("status.lockedDesc") : t("status.unlockedDesc")}</p>
          </div>
          <button 
            className={`btn-lock ${isLocked ? "btn-unlock" : "btn-lock-action"}`}
            onClick={handleToggleLock}
            disabled={toggling || isLocking}
          >
            {toggling ? tCommon("loading") : isLocked ? t("general.unlock") : t("general.lock")}
          </button>
        </div>
      )}

      {/* General Info */}
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
                  {details.nameServerType === "hosted" ? "OVH" : "Externe"}
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

      {/* Service Info + Actions */}
      {serviceInfos && (
        <section className="info-section">
          <div className="section-header-with-actions">
            <h3>{t("serviceInfo.title")}</h3>
            <div className="section-actions">
              <a 
                href={getAutorenewUrl(domain)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="link-external"
              >
                {t("general.manageRenewal")} <ExternalLinkIcon />
              </a>
              <a 
                href={getContactsUrl(domain)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="link-external"
              >
                {t("general.manageContacts")} <ExternalLinkIcon />
              </a>
            </div>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <label>{t("serviceInfo.creation")}</label>
              <span>{formatDate(serviceInfos.creation)}</span>
            </div>
            <div className="info-item">
              <label>{t("serviceInfo.expiration")}</label>
              <span className={isExpiringSoon(serviceInfos.expiration) ? "expiring" : ""}>
                {formatDate(serviceInfos.expiration)}
                {isExpiringSoon(serviceInfos.expiration) && (
                  <span className="badge warning" style={{ marginLeft: "8px" }}>⚠️ {t("general.expiringSoon")}</span>
                )}
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

      {/* Info Box */}
      <div className="info-box">
        <h4>{t("generalInfo.tips")}</h4>
        <p>{t("generalInfo.tipsDesc")}</p>
      </div>
    </div>
  );
}

export default GeneralTab;
