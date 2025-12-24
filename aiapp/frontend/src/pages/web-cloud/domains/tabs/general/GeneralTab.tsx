// ============================================================
import "./GeneralTab.css";
// TAB: GENERAL - Informations domaine layout 3 colonnes
// TOUTES les classes CSS sont préfixées .general-
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { generalService, formatDate, formatDateLong } from "./GeneralTab";
import type { Domain, DomainServiceInfos } from "../../domains.types";
import { AuthInfoModal } from "../../modals/AuthInfoModal";

interface Props {
  domain: string;
  details?: Domain;
  serviceInfos?: DomainServiceInfos;
  loading: boolean;
  onRefresh?: () => void;
  onTabChange?: (tab: string) => void;
}

interface PendingTask {
  id: number;
  function: string;
  status: string;
  comment?: string;
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

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

// ============ EXTERNAL LINKS ============

const OVH_MANAGER_BASE = "https://www.ovh.com/manager";
const getAutorenewUrl = (domain: string) => `${OVH_MANAGER_BASE}/#/dedicated/billing/autorenew?searchText=${encodeURIComponent(domain)}`;
const getContactsUrl = (domain: string) => `${OVH_MANAGER_BASE}/#/dedicated/contacts/services?serviceName=${encodeURIComponent(domain)}`;
const getHostingOrderUrl = () => "https://www.ovhcloud.com/fr/web-hosting/";
const getExtensionUrl = () => "https://www.ovhcloud.com/fr/domains/tld/";
const getEmailUrl = () => "https://www.ovhcloud.com/fr/emails/";

// ============ COMPOSANT PRINCIPAL ============

export function GeneralTab({ domain, details, serviceInfos, loading, onRefresh, onTabChange }: Props) {
  const { t } = useTranslation("web-cloud/domains/general");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [toggling, setToggling] = useState(false);
  const [dnssecToggling, setDnssecToggling] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const [showAuthInfo, setShowAuthInfo] = useState(false);
  const [hasEmail, setHasEmail] = useState<boolean | null>(null);
  const [dnssecStatus, setDnssecStatus] = useState<string | null>(null);
  const [subdomains, setSubdomains] = useState<string[]>([]);
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);
  const [linkedHosting, setLinkedHosting] = useState<string | null>(null);

  // ---------- LOAD EXTRA DATA ----------
  useEffect(() => {
    const loadExtraData = async () => {
      try {
        const result = await generalService.hasEmailDomain(domain);
        setHasEmail(result);
      } catch {
        setHasEmail(false);
      }

      try {
        const dnssec = await generalService.getDnssecStatus(domain);
        setDnssecStatus(dnssec.status);
      } catch {
        setDnssecStatus(null);
      }

      try {
        const records = await generalService.listRecordsDetailed(domain);
        const subs = new Set<string>();
        records.forEach((r) => {
          if (r.subDomain && r.subDomain !== "" && (r.fieldType === "A" || r.fieldType === "AAAA" || r.fieldType === "CNAME")) {
            subs.add(r.subDomain);
          }
        });
        setSubdomains(Array.from(subs).sort());
      } catch {
        setSubdomains([]);
      }

      try {
        const taskIds = await generalService.listDomainTasks(domain);
        if (taskIds.length > 0) {
          const tasks = await Promise.all(taskIds.slice(0, 5).map((id) => generalService.getDomainTask(domain, id)));
          const pending = tasks.filter((t) => t.status === "todo" || t.status === "doing" || t.status === "problem");
          setPendingTasks(pending);
        } else {
          setPendingTasks([]);
        }
      } catch {
        setPendingTasks([]);
      }

      try {
        const hosting = await generalService.getLinkedHosting(domain);
        setLinkedHosting(hosting);
      } catch {
        setLinkedHosting(null);
      }
    };

    loadExtraData();
  }, [domain]);

  // ---------- DERIVED VALUES ----------
  const isLocked = details?.transferLockStatus === "locked";
  const isLocking = details?.transferLockStatus === "locking" || details?.transferLockStatus === "unlocking";
  const dnssecEnabled = dnssecStatus === "enabled" || dnssecStatus === "enableInProgress";
  const dnsServerType = details?.nameServerType === "hosted" ? t("values.dnsHosted") : t("values.dnsExternal");
  const canShowAuthInfo = !isLocked && details?.nameServerType === "hosted";

  // ---------- HANDLERS ----------
  const handleToggleLock = async () => {
    if (toggling || isLocking) return;
    setToggling(true);
    try {
      if (isLocked) {
        await generalService.unlockDomain(domain);
      } else {
        await generalService.lockDomain(domain);
      }
      onRefresh?.();
    } catch (err) {
      console.error("Toggle lock error:", err);
    } finally {
      setToggling(false);
    }
  };

  const handleToggleDnssec = async () => {
    if (dnssecToggling) return;
    setDnssecToggling(true);
    try {
      // Note: DNSSEC toggle would require additional API methods
      // For now, redirect to DNSSEC tab
      onTabChange?.("dnssec");
    } finally {
      setDnssecToggling(false);
    }
  };

  const handleGoToContacts = () => {
    onTabChange?.("contacts");
  };

  // ---------- LOADING STATE ----------
  if (loading) {
    return (
      <div className="general-tab-v3">
        <div className="general-grid-3">
          <div className="general-skeleton-block-v3" style={{ height: "300px" }} />
          <div className="general-skeleton-block-v3" style={{ height: "300px" }} />
          <div className="general-skeleton-block-v3" style={{ height: "300px" }} />
        </div>
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="general-tab-v3">
      {/* ============ PENDING TASKS WARNING ============ */}
      {pendingTasks.length > 0 && (
        <div className="general-warning-banner-v3">
          <WarningIcon />
          <div className="general-warning-content-v3">
            <span>{t("warnings.pendingTasks", { count: pendingTasks.length })}</span>
            <button className="general-btn-link-v3" onClick={() => onTabChange?.("tasks")}>{t("actions.viewTasks")}</button>
          </div>
        </div>
      )}

      {/* ============ ROW 1: 3 COLONNES ============ */}
      <div className="general-grid-3">
        {/* ============ COL 1: INFORMATIONS ============ */}
        <div className="general-info-card-v3">
          <h3 className="general-card-title-v3">{t("sections.info")}</h3>

          <div className="general-info-row-v3">
            <div className="general-row-label-v3"><ServerIcon /> {t("fields.domain")}</div>
            <div className="general-row-value-box-v3">
              <span className="general-value-text-v3">{domain}</span>
            </div>
          </div>

          <div className="general-info-row-v3">
            <div className="general-row-label-v3"><ServerIcon /> {t("fields.dnsType")}</div>
            <div className="general-row-value-box-v3">
              <span className="general-badge-status-v3 info">{dnsServerType}</span>
            </div>
          </div>

          <div className="general-info-row-v3">
            <div className="general-row-label-v3"><MailIcon /> {t("fields.email")}</div>
            <div className="general-row-value-box-v3">
              {hasEmail === null ? (
                <span className="general-value-text-v3 muted">...</span>
              ) : hasEmail ? (
                <span className="general-badge-status-v3 success">{t("values.emailActive")}</span>
              ) : (
                <a href={getEmailUrl()} target="_blank" rel="noopener noreferrer" className="general-btn-order-v3">
                  {t("actions.orderEmail")} <ExternalLinkIcon />
                </a>
              )}
            </div>
          </div>

          <div className="general-info-row-v3">
            <div className="general-row-label-v3"><GlobeIcon /> {t("fields.subdomains")}</div>
            <div className="general-row-value-box-v3">
              {subdomains.length > 0 ? (
                <div className="general-subdomains-list-v3">
                  {subdomains.slice(0, 3).map((sub) => (
                    <span key={sub} className="general-subdomain-item-v3">{sub}.{domain}</span>
                  ))}
                  {subdomains.length > 3 && (
                    <span className="general-subdomain-more-v3">+{subdomains.length - 3} {t("values.more")}</span>
                  )}
                </div>
              ) : (
                <span className="general-value-text-v3 muted">{t("values.noSubdomain")}</span>
              )}
            </div>
          </div>
        </div>

        {/* ============ COL 2: SÉCURITÉ ============ */}
        <div className="general-info-card-v3">
          <h3 className="general-card-title-v3">{t("sections.security")}</h3>

          <div className="general-security-row-v3">
            <div className="general-security-label-row-v3">
              <span>{t("security.transferLock")}</span>
              <span className="general-help-icon-v3" title={t("security.transferLockHelp")}><HelpIcon /></span>
            </div>
            <div className="general-security-control-v3">
              <button className={`general-toggle-switch-v3 ${isLocked ? "active" : ""}`} onClick={handleToggleLock} disabled={toggling || isLocking}>
                <span className="general-toggle-slider-v3" />
              </button>
              <span className={`general-toggle-badge-v3 ${isLocked ? "success" : "warning"}`}>
                {toggling ? "..." : isLocked ? t("security.enabled") : t("security.disabled")}
              </span>
            </div>
          </div>

          <div className="general-security-row-v3">
            <div className="general-security-label-row-v3">
              <span>{t("security.dnssec")}</span>
              <span className="general-help-icon-v3" title={t("security.dnssecHelp")}><HelpIcon /></span>
            </div>
            <div className="general-security-control-v3">
              <button className={`general-toggle-switch-v3 ${dnssecEnabled ? "active" : ""}`} onClick={handleToggleDnssec} disabled={dnssecToggling}>
                <span className="general-toggle-slider-v3" />
              </button>
              <span className={`general-toggle-badge-v3 ${dnssecEnabled ? "success" : "warning"}`}>
                {dnssecToggling ? "..." : dnssecEnabled ? t("security.enabled") : t("security.disabled")}
              </span>
            </div>
          </div>

          {canShowAuthInfo && (
            <div className="general-security-row-v3">
              <div className="general-security-label-row-v3">
                <span><KeyIcon /> AUTH/INFO</span>
              </div>
              <button className="general-btn-authinfo-v3" onClick={() => setShowAuthInfo(true)}>
                {t("actions.showAuthInfo")}
              </button>
            </div>
          )}

          <div className="general-security-row-v3">
            <div className="general-security-label-row-v3">
              <span>{t("security.whois")}</span>
            </div>
            <button className="general-btn-whois-v3" onClick={handleGoToContacts}>
              {t("security.configureWhois")}
            </button>
          </div>
        </div>

        {/* ============ COL 3: ABONNEMENT ============ */}
        <div className="general-info-card-v3">
          <h3 className="general-card-title-v3">{t("sections.subscription")}</h3>

          {serviceInfos && (
            <>
              <div className="general-abo-row-v3 with-action">
                <div className="general-abo-main-v3">
                  <div className="general-abo-label-v3">{t("fields.renewal")}</div>
                  <div className="general-abo-value-v3 highlight">{formatDate(serviceInfos.expiration)}</div>
                </div>
                <a href={getAutorenewUrl(domain)} target="_blank" rel="noopener noreferrer" className="general-btn-more-v3"><MoreIcon /></a>
              </div>

              <div className="general-abo-row-v3 with-action">
                <div className="general-abo-main-v3">
                  <div className="general-abo-label-v3"><UserIcon /> {t("fields.contacts")}</div>
                  <div className="general-contacts-list-v3">
                    <div className="general-contact-line-v3"><span className="general-nic-v3">{serviceInfos.contactAdmin}</span><span className="general-role-v3">{t("contacts.admin")}</span></div>
                    <div className="general-contact-line-v3"><span className="general-nic-v3">{serviceInfos.contactTech}</span><span className="general-role-v3">{t("contacts.tech")}</span></div>
                    <div className="general-contact-line-v3"><span className="general-nic-v3">{serviceInfos.contactBilling}</span><span className="general-role-v3">{t("contacts.billing")}</span></div>
                    {details?.whoisOwner && <div className="general-contact-line-v3"><span className="general-nic-v3">{details.whoisOwner}</span><span className="general-role-v3">{t("contacts.owner")}</span></div>}
                  </div>
                </div>
                <a href={getContactsUrl(domain)} target="_blank" rel="noopener noreferrer" className="general-btn-more-v3"><MoreIcon /></a>
              </div>

              <div className="general-abo-row-v3">
                <div className="general-abo-label-v3"><CalendarIcon /> {t("fields.creation")}</div>
                <div className="general-abo-value-v3">{formatDateLong(serviceInfos.creation)}</div>
              </div>

              {details?.offer && (
                <div className="general-abo-row-v3">
                  <div className="general-abo-label-v3">{t("fields.offer")}</div>
                  <div className="general-row-value-box-v3">
                    <span className="general-badge-status-v3 gold">{details.offer}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ============ ROW 2: GUIDES + OPTIONS + CONSEILS ============ */}
      <div className="general-grid-3 general-mt-6">
        <div className="general-info-card-v3 compact">
          <h3 className="general-card-title-v3">{t("sections.guides")}</h3>
          <div className="general-accordion-item-v3" onClick={() => setGuidesOpen(!guidesOpen)}>
            <span className="general-accordion-label-v3">{t("guides.title")}</span>
            <span className={`general-accordion-chevron-v3 ${guidesOpen ? "open" : ""}`}><ChevronDownIcon /></span>
          </div>
          {guidesOpen && (
            <div className="general-accordion-content-v3">
              <a href="https://help.ovhcloud.com/csm/fr-domains-dns-zone" target="_blank" rel="noopener noreferrer" className="general-guide-link-v3">{t("guides.dnsZone")} <ExternalLinkIcon /></a>
              <a href="https://help.ovhcloud.com/csm/fr-domains-transfer-lock" target="_blank" rel="noopener noreferrer" className="general-guide-link-v3">{t("guides.transferLock")} <ExternalLinkIcon /></a>
              <a href="https://help.ovhcloud.com/csm/fr-domains-dnssec" target="_blank" rel="noopener noreferrer" className="general-guide-link-v3">{t("guides.dnssec")} <ExternalLinkIcon /></a>
            </div>
          )}
        </div>

        <div className="general-info-card-v3 compact">
          <h3 className="general-card-title-v3">{t("sections.options")}</h3>
          <div className="general-option-row-v3"><span className="general-option-label-v3">{t("options.dnsAnycast")}</span><span className="general-option-value-v3 muted">{t("options.notAvailable")}</span></div>
          <div className="general-option-row-v3"><span className="general-option-label-v3">{t("options.owo")}</span><span className={`general-option-value-v3 ${details?.owoSupported ? "" : "muted"}`}>{details?.owoSupported ? t("options.available") : t("options.notSupported")}</span></div>
          <div className="general-option-row-v3"><span className="general-option-label-v3">{t("options.dnsType")}</span><span className="general-option-value-v3">{dnsServerType}</span></div>
        </div>

        <div className="general-info-card-v3 compact highlight">
          <h3 className="general-card-title-v3">{t("sections.tips")}</h3>
          <p className="general-advice-intro-v3">{t("tips.intro")}</p>
          <a href={getHostingOrderUrl()} target="_blank" rel="noopener noreferrer" className="general-advice-link-v3"><span>{t("tips.hosting")}</span><ChevronRightIcon /></a>
          <a href={getExtensionUrl()} target="_blank" rel="noopener noreferrer" className="general-advice-link-v3"><span>{t("tips.extension")}</span><ChevronRightIcon /></a>
          <a href={getEmailUrl()} target="_blank" rel="noopener noreferrer" className="general-advice-link-v3"><span>{t("tips.email")}</span><ChevronRightIcon /></a>
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
