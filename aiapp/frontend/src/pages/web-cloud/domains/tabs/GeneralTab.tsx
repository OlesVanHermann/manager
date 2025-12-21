// ============================================================
// TAB: GENERAL - Informations domaine layout 3 colonnes
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Domain, DomainServiceInfos, domainsService } from "../../../../services/web-cloud.domains";
import { AuthInfoModal } from "../modals/AuthInfoModal";

interface Props {
  domain: string;
  details?: Domain;
  serviceInfos?: DomainServiceInfos;
  loading: boolean;
  onRefresh?: () => void;
}

// ============ ICONS ============

const ServerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/>
  </svg>
);

const KeyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
);

const HelpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);

// ============ EXTERNAL LINKS ============

const OVH_MANAGER_BASE = "https://www.ovh.com/manager";
const getAutorenewUrl = (domain: string) => `${OVH_MANAGER_BASE}/#/dedicated/billing/autorenew?searchText=${encodeURIComponent(domain)}`;
const getContactsUrl = (domain: string) => `${OVH_MANAGER_BASE}/#/dedicated/contacts/services?serviceName=${encodeURIComponent(domain)}`;
const getWhoisUrl = (domain: string) => `${OVH_MANAGER_BASE}/#/web/domain/${encodeURIComponent(domain)}/owo`;
const getHostingUrl = () => "https://www.ovhcloud.com/fr/web-hosting/";
const getExtensionUrl = () => "https://www.ovhcloud.com/fr/domains/tld/";
const getEmailUrl = () => "https://www.ovhcloud.com/fr/emails/";

// ============ COMPOSANT PRINCIPAL ============

export function GeneralTab({ domain, details, serviceInfos, loading, onRefresh }: Props) {
  const { t } = useTranslation("web-cloud/domains/general");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [toggling, setToggling] = useState(false);
  const [dnssecToggling, setDnssecToggling] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const [showAuthInfo, setShowAuthInfo] = useState(false);
  const [hasEmail, setHasEmail] = useState<boolean | null>(null);

  // ---------- CHECK EMAIL ----------
  useEffect(() => {
    const checkEmail = async () => {
      try {
        const result = await domainsService.hasEmailDomain(domain);
        setHasEmail(result);
      } catch {
        setHasEmail(false);
      }
    };
    checkEmail();
  }, [domain]);

  // ---------- HELPERS ----------
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  const formatDateLong = (dateStr: string) => new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  // ---------- HANDLERS ----------
  const handleToggleLock = async () => {
    if (!details) return;
    const isLocked = details.transferLockStatus === "locked";
    if (!confirm(isLocked ? t("security.confirmUnlock") : t("security.confirmLock"))) return;
    try {
      setToggling(true);
      if (isLocked) await domainsService.unlockDomain(domain);
      else await domainsService.lockDomain(domain);
      onRefresh?.();
    } catch (err) {
      alert(String(err));
    } finally {
      setToggling(false);
    }
  };

  const handleToggleDnssec = async () => {
    setDnssecToggling(true);
    setTimeout(() => {
      alert("Configuration DNSSEC : utilisez l'onglet DNSSEC pour gérer les enregistrements DS.");
      setDnssecToggling(false);
    }, 500);
  };

  // ---------- DERIVED STATE ----------
  const isLocked = details?.transferLockStatus === "locked";
  const isLocking = details?.transferLockStatus === "locking" || details?.transferLockStatus === "unlocking";
  const dnssecEnabled = details?.dnssecSupported || false;
  const canShowAuthInfo = details?.transferLockStatus === "unlocked";

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="general-tab-v3">
        <div className="general-grid-3">
          <div className="info-card-v3"><div className="skeleton-block" style={{height:"300px"}} /></div>
          <div className="info-card-v3"><div className="skeleton-block" style={{height:"200px"}} /></div>
          <div className="info-card-v3"><div className="skeleton-block" style={{height:"300px"}} /></div>
        </div>
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="general-tab-v3">
      <div className="general-grid-3">
        {/* ============ COL 1: INFORMATIONS GÉNÉRALES ============ */}
        <div className="info-card-v3">
          <h3 className="card-title-v3">{t("sections.info")}</h3>
          
          <div className="info-row-v3">
            <div className="row-label">{t("fields.status")}</div>
            <div className="row-value-box">
              <span className="badge-status info">{serviceInfos?.renew.automatic ? t("values.autoRenewal") : t("values.manualRenewal")}</span>
            </div>
          </div>

          <div className="info-row-v3 with-action">
            <div className="row-main">
              <div className="row-label"><ServerIcon /> {t("fields.dnsServers")}</div>
              <div className="row-value-box">
                <span className={`badge-status ${details?.nameServerType === "hosted" ? "success" : "warning"}`}>
                  {details?.nameServerType === "hosted" ? t("values.active") : t("values.external")}
                </span>
              </div>
            </div>
            <button className="btn-more-v3"><MoreIcon /></button>
          </div>

          <div className="info-row-v3 with-action">
            <div className="row-main">
              <div className="row-label">{t("fields.hosting")}</div>
              <div className="row-value-box">
                <a href={getHostingUrl()} target="_blank" rel="noopener noreferrer" className="link-primary-v3">{t("actions.orderHosting")} <ExternalLinkIcon /></a>
              </div>
            </div>
            <button className="btn-more-v3"><MoreIcon /></button>
          </div>

          <div className="info-row-v3">
            <div className="row-label"><MailIcon /> {t("fields.email")}</div>
            <div className="row-value-box">
              {hasEmail === null ? (
                <span className="value-text muted">...</span>
              ) : hasEmail ? (
                <span className="badge-status success">{t("values.emailActive")}</span>
              ) : (
                <span className="value-text muted">{t("values.noEmail")}</span>
              )}
            </div>
          </div>

          <div className="info-row-v3">
            <div className="row-label">{t("fields.subdomains")}</div>
            <div className="row-value-box">
              <span className="value-text muted">{t("values.noSubdomain")}</span>
            </div>
          </div>
        </div>

        {/* ============ COL 2: SÉCURITÉ ============ */}
        <div className="info-card-v3">
          <h3 className="card-title-v3">{t("sections.security")}</h3>

          <div className="security-row-v3">
            <div className="security-label-row">
              <span>{t("security.transferLock")}</span>
              <span className="help-icon-v3" title={t("security.transferLockHelp")}><HelpIcon /></span>
            </div>
            <div className="security-control-v3">
              <button className={`toggle-switch-v3 ${isLocked ? "active" : ""}`} onClick={handleToggleLock} disabled={toggling || isLocking}>
                <span className="toggle-slider-v3" />
              </button>
              <span className={`toggle-badge ${isLocked ? "success" : "warning"}`}>
                {toggling ? "..." : isLocked ? t("security.enabled") : t("security.disabled")}
              </span>
            </div>
          </div>

          <div className="security-row-v3">
            <div className="security-label-row">
              <span>{t("security.dnssec")}</span>
              <span className="help-icon-v3" title={t("security.dnssecHelp")}><HelpIcon /></span>
            </div>
            <div className="security-control-v3">
              <button className={`toggle-switch-v3 ${dnssecEnabled ? "active" : ""}`} onClick={handleToggleDnssec} disabled={dnssecToggling}>
                <span className="toggle-slider-v3" />
              </button>
              <span className={`toggle-badge ${dnssecEnabled ? "success" : "warning"}`}>
                {dnssecToggling ? "..." : dnssecEnabled ? t("security.enabled") : t("security.disabled")}
              </span>
            </div>
          </div>

          {canShowAuthInfo && (
            <div className="security-row-v3">
              <div className="security-label-row">
                <span><KeyIcon /> AUTH/INFO</span>
              </div>
              <button className="btn-authinfo" onClick={() => setShowAuthInfo(true)}>
                {t("actions.showAuthInfo")}
              </button>
            </div>
          )}

          <div className="security-row-v3">
            <div className="security-label-row">
              <span>{t("security.whois")}</span>
            </div>
            <a href={getWhoisUrl(domain)} target="_blank" rel="noopener noreferrer" className="btn-whois">
              {t("security.configureWhois")}
            </a>
          </div>
        </div>

        {/* ============ COL 3: ABONNEMENT ============ */}
        <div className="info-card-v3">
          <h3 className="card-title-v3">{t("sections.subscription")}</h3>

          {serviceInfos && (
            <>
              <div className="abo-row-v3 with-action">
                <div className="abo-main">
                  <div className="abo-label">{t("fields.renewal")}</div>
                  <div className="abo-value highlight">{formatDate(serviceInfos.expiration)}</div>
                </div>
                <a href={getAutorenewUrl(domain)} target="_blank" rel="noopener noreferrer" className="btn-more-v3"><MoreIcon /></a>
              </div>

              <div className="abo-row-v3 with-action">
                <div className="abo-main">
                  <div className="abo-label"><UserIcon /> {t("fields.contacts")}</div>
                  <div className="contacts-list-v3">
                    <div className="contact-line"><span className="nic">{serviceInfos.contactAdmin}</span><span className="role">{t("contacts.admin")}</span></div>
                    <div className="contact-line"><span className="nic">{serviceInfos.contactTech}</span><span className="role">{t("contacts.tech")}</span></div>
                    <div className="contact-line"><span className="nic">{serviceInfos.contactBilling}</span><span className="role">{t("contacts.billing")}</span></div>
                    {details?.whoisOwner && <div className="contact-line"><span className="nic">{details.whoisOwner}</span><span className="role">{t("contacts.owner")}</span></div>}
                  </div>
                </div>
                <a href={getContactsUrl(domain)} target="_blank" rel="noopener noreferrer" className="btn-more-v3"><MoreIcon /></a>
              </div>

              <div className="abo-row-v3">
                <div className="abo-label"><CalendarIcon /> {t("fields.creation")}</div>
                <div className="abo-value">{formatDateLong(serviceInfos.creation)}</div>
              </div>

              {details?.offer && (
                <div className="abo-row-v3">
                  <div className="abo-label">{t("fields.offer")}</div>
                  <div className="row-value-box">
                    <span className="badge-status gold">{details.offer}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ============ ROW 2: GUIDES + OPTIONS + CONSEILS ============ */}
      <div className="general-grid-3 mt-6">
        <div className="info-card-v3 compact">
          <h3 className="card-title-v3">{t("sections.guides")}</h3>
          <div className="accordion-item-v3" onClick={() => setGuidesOpen(!guidesOpen)}>
            <span className="accordion-label-v3">{t("guides.title")}</span>
            <span className={`accordion-chevron ${guidesOpen ? "open" : ""}`}><ChevronDownIcon /></span>
          </div>
          {guidesOpen && (
            <div className="accordion-content-v3">
              <a href="https://help.ovhcloud.com/csm/fr-domains-dns-zone" target="_blank" rel="noopener noreferrer" className="guide-link-v3">{t("guides.dnsZone")} <ExternalLinkIcon /></a>
              <a href="https://help.ovhcloud.com/csm/fr-domains-transfer-lock" target="_blank" rel="noopener noreferrer" className="guide-link-v3">{t("guides.transferLock")} <ExternalLinkIcon /></a>
              <a href="https://help.ovhcloud.com/csm/fr-domains-dnssec" target="_blank" rel="noopener noreferrer" className="guide-link-v3">{t("guides.dnssec")} <ExternalLinkIcon /></a>
            </div>
          )}
        </div>

        <div className="info-card-v3 compact">
          <h3 className="card-title-v3">{t("sections.options")}</h3>
          <div className="option-row-v3"><span className="option-label-v3">{t("options.dnsAnycast")}</span><span className="option-value-v3 muted">{t("options.notAvailable")}</span></div>
          <div className="option-row-v3"><span className="option-label-v3">{t("options.owo")}</span><span className={`option-value-v3 ${details?.owoSupported ? "" : "muted"}`}>{details?.owoSupported ? t("options.available") : t("options.notSupported")}</span></div>
          <div className="option-row-v3"><span className="option-label-v3">{t("options.dnsType")}</span><span className="option-value-v3">{details?.nameServerType === "hosted" ? "OVH" : t("values.external")}</span></div>
        </div>

        <div className="info-card-v3 compact highlight">
          <h3 className="card-title-v3">{t("sections.tips")}</h3>
          <p className="advice-intro-v3">{t("tips.intro")}</p>
          <a href={getHostingUrl()} target="_blank" rel="noopener noreferrer" className="advice-link-v3"><span>{t("tips.hosting")}</span><ChevronRightIcon /></a>
          <a href={getExtensionUrl()} target="_blank" rel="noopener noreferrer" className="advice-link-v3"><span>{t("tips.extension")}</span><ChevronRightIcon /></a>
          <a href={getEmailUrl()} target="_blank" rel="noopener noreferrer" className="advice-link-v3"><span>{t("tips.email")}</span><ChevronRightIcon /></a>
        </div>
      </div>

      {/* ============ MODAL AUTHINFO ============ */}
      {showAuthInfo && (
        <AuthInfoModal domain={domain} onClose={() => setShowAuthInfo(false)} />
      )}
    </div>
  );
}

export default GeneralTab;
