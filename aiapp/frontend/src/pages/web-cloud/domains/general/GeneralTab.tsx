// ============================================================
// TAB: GENERAL - Informations générales domaine
// Layout aligné sur target SVG general-informations.svg
// ROW 1: Informations générales | Configuration DNS | Sécurité
// ROW 2: Abonnement | Contacts
// ============================================================

import "./GeneralTab.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { generalService, formatDate, formatDateLong } from "./GeneralTab.service";
import type { Domain, DomainServiceInfos } from "../domains.types";
import { AuthInfoModal } from "./AuthInfoModal";

interface Props {
  domain: string;
  details?: Domain;
  serviceInfos?: DomainServiceInfos;
  loading: boolean;
  onRefresh?: () => void;
  onTabChange?: (tab: string) => void;
}

// ============ ICONS ============

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

// ============ EXTERNAL LINKS ============

const OVH_MANAGER_BASE = "https://www.ovh.com/manager";
const getAutorenewUrl = (domain: string) => `${OVH_MANAGER_BASE}/#/dedicated/billing/autorenew?searchText=${encodeURIComponent(domain)}`;
const getContactsUrl = (domain: string) => `${OVH_MANAGER_BASE}/#/dedicated/contacts/services?serviceName=${encodeURIComponent(domain)}`;

// ============ COMPOSANT PRINCIPAL ============

export function GeneralTab({ domain, details, serviceInfos, loading, onRefresh, onTabChange }: Props) {
  const { t } = useTranslation("web-cloud/domains/general");

  // ---------- STATE ----------
  const [toggling, setToggling] = useState(false);
  const [showAuthInfo, setShowAuthInfo] = useState(false);
  const [dnssecStatus, setDnssecStatus] = useState<string | null>(null);
  const [nameServersCount, setNameServersCount] = useState<number>(0);
  const [recordsCount, setRecordsCount] = useState<number>(0);
  const [hasAnycast, setHasAnycast] = useState<boolean>(false);
  const [pendingTasksCount, setPendingTasksCount] = useState<number>(0);

  // ---------- LOAD EXTRA DATA ----------
  // OPTIMISATION: Appels parallèles, pas de N+1
  useEffect(() => {
    const loadExtraData = async () => {
      // Tous les appels en parallèle - 1 appel chacun, pas de N+1
      const [dnssec, nsCount, recCount, anycast, tasksCount] = await Promise.all([
        generalService.getDnssecStatus(domain).catch(() => ({ status: null })),
        generalService.getNameServersCount(domain).catch(() => 0),
        generalService.getZoneRecordsCount(domain).catch(() => 0),
        generalService.getAnycastStatus(domain).catch(() => false),
        generalService.getPendingTasksCount(domain).catch(() => 0),
      ]);

      setDnssecStatus(dnssec.status);
      setNameServersCount(nsCount);
      setRecordsCount(recCount);
      setHasAnycast(anycast);
      setPendingTasksCount(tasksCount);
    };

    loadExtraData();
  }, [domain]);

  // ---------- DERIVED VALUES ----------
  const isLocked = details?.transferLockStatus === "locked";
  const isLocking = details?.transferLockStatus === "locking" || details?.transferLockStatus === "unlocking";
  const dnssecEnabled = dnssecStatus === "enabled" || dnssecStatus === "enableInProgress";
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

  // ---------- LOADING STATE ----------
  if (loading) {
    return (
      <div className="general-tab-v3">
        <div className="general-grid-3">
          <div className="general-skeleton-block-v3" style={{ height: "300px" }} />
          <div className="general-skeleton-block-v3" style={{ height: "300px" }} />
          <div className="general-skeleton-block-v3" style={{ height: "300px" }} />
        </div>
        <div className="general-grid-2 general-mt-6">
          <div className="general-skeleton-block-v3" style={{ height: "180px" }} />
          <div className="general-skeleton-block-v3" style={{ height: "180px" }} />
        </div>
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="general-tab-v3">
      {/* ============ PENDING TASKS WARNING ============ */}
      {pendingTasksCount > 0 && (
        <div className="general-warning-banner-v3">
          <WarningIcon />
          <div className="general-warning-content-v3">
            <span>{t("warnings.pendingTasks", { count: pendingTasksCount })}</span>
            <button className="general-btn-link-v3" onClick={() => onTabChange?.("tasks")}>{t("actions.viewTasks")}</button>
          </div>
        </div>
      )}

      {/* ============ ROW 1: 3 TILES ============ */}
      <div className="general-grid-3">
        {/* ============ TILE 1: INFORMATIONS GÉNÉRALES ============ */}
        <div className="dom-general-info-card-v3">
          <h3 className="general-card-title-v3">{t("sections.info")}</h3>

          <div className="general-field-row">
            <span className="general-field-label">{t("fields.status")}</span>
            <span className="general-badge-status-v3 success">{t("values.active")}</span>
          </div>

          <div className="general-field-row">
            <span className="general-field-label">{t("fields.extension")}</span>
            <span className="general-field-value">.{domain.split('.').pop()} (gTLD)</span>
          </div>

          <div className="general-field-row">
            <span className="general-field-label">{t("fields.registrar")}</span>
            <span className="general-field-value">OVHcloud</span>
          </div>

          <div className="general-field-row">
            <span className="general-field-label">{t("fields.creation")}</span>
            <span className="general-field-value">{serviceInfos ? formatDateLong(serviceInfos.creation) : "..."}</span>
          </div>

          <div className="general-field-row">
            <span className="general-field-label">{t("fields.expiration")}</span>
            <span className="general-field-value">{serviceInfos ? formatDateLong(serviceInfos.expiration) : "..."}</span>
          </div>
        </div>

        {/* ============ TILE 2: CONFIGURATION DNS ============ */}
        <div className="dom-general-info-card-v3">
          <h3 className="general-card-title-v3">{t("sections.dnsConfig")}</h3>

          <div className="general-field-row-action">
            <div className="general-field-col">
              <span className="general-field-label">{t("fields.dnsServers")}</span>
              <span className="general-field-value">
                {nameServersCount > 0 ? `${nameServersCount} ${t("values.servers")}` : "..."}
              </span>
            </div>
            <button className="general-btn-more-v3" onClick={() => onTabChange?.("dns-servers")} title={t("actions.manage")}><MoreIcon /></button>
          </div>

          <div className="general-field-row-action">
            <div className="general-field-col">
              <span className="general-field-label">{t("fields.dnssec")}</span>
              <span className={`general-badge-status-v3 ${dnssecEnabled ? "success" : "warning"}`}>
                {dnssecEnabled ? t("values.enabled") : t("values.disabled")}
              </span>
            </div>
            <button className="general-btn-more-v3" onClick={() => onTabChange?.("dnssec")} title={t("actions.manage")}><MoreIcon /></button>
          </div>

          <div className="general-field-row-action">
            <div className="general-field-col">
              <span className="general-field-label">{t("fields.anycast")}</span>
              <span className="general-field-value">{hasAnycast ? t("values.enabled") : t("values.notEnabled")}</span>
            </div>
            <button className="general-btn-more-v3" title={t("actions.manage")}><MoreIcon /></button>
          </div>

          <div className="general-field-row">
            <span className="general-field-label">{t("fields.zoneDns")}</span>
            <span className="general-field-value">{recordsCount} {t("values.records")}</span>
          </div>

          <button className="general-btn-link-primary" onClick={() => onTabChange?.("zone")}>
            › {t("actions.manageZone")}
          </button>
        </div>

        {/* ============ TILE 3: SÉCURITÉ ============ */}
        <div className="dom-general-info-card-v3">
          <h3 className="general-card-title-v3">{t("sections.security")}</h3>

          <div className="general-field-row-action">
            <div className="general-field-col">
              <span className="general-field-label">{t("security.transferLock")}</span>
              <span className={`general-badge-status-v3 ${isLocked ? "success" : "warning"}`}>
                {toggling ? "..." : isLocked ? t("security.locked") : t("security.unlocked")}
              </span>
            </div>
            <button className="general-btn-more-v3" onClick={handleToggleLock} disabled={toggling || isLocking} title={isLocked ? t("actions.unlock") : t("actions.lock")}><MoreIcon /></button>
          </div>

          <div className="general-field-row-action">
            <div className="general-field-col">
              <span className="general-field-label">{t("security.whoisProtection")}</span>
              <span className={`general-badge-status-v3 ${details?.owoSupported ? "success" : "info"}`}>
                {details?.owoSupported ? t("values.enabled") : t("values.notSupported")}
              </span>
            </div>
            <button className="general-btn-more-v3" onClick={() => onTabChange?.("contacts")} title={t("actions.manage")}><MoreIcon /></button>
          </div>

          <div className="general-field-row-action">
            <div className="general-field-col">
              <span className="general-field-label">{t("security.authCode")}</span>
              <span className="general-field-value">••••••••••</span>
            </div>
            {canShowAuthInfo && (
              <button className="general-btn-show" onClick={() => setShowAuthInfo(true)}>{t("actions.show")}</button>
            )}
          </div>

          <div className="general-field-row">
            <span className="general-field-label">{t("security.owo")}</span>
            <span className="general-field-value">{details?.owoSupported ? t("values.allowChanges") : t("values.notSupported")}</span>
          </div>
        </div>
      </div>

      {/* ============ ROW 2: 2 TILES ============ */}
      <div className="general-grid-2 general-mt-6">
        {/* ============ TILE 4: ABONNEMENT ============ */}
        <div className="dom-general-info-card-v3">
          <h3 className="general-card-title-v3">{t("sections.subscription")}</h3>

          <div className="general-abo-grid">
            <div className="general-field-col">
              <span className="general-field-label">{t("fields.offer")}</span>
              <span className="general-field-value">{details?.offer || t("values.domainName")}</span>
            </div>
            <div className="general-field-col">
              <span className="general-field-label">{t("fields.price")}</span>
              <span className="general-field-value">9,99 € HT/an</span>
            </div>
          </div>

          <div className="general-field-row-action general-mt-4">
            <div className="general-field-col">
              <span className="general-field-label">{t("fields.renewal")}</span>
              <span className="general-field-value">
                {serviceInfos?.renew?.automatic ? t("values.automatic") : t("values.manual")} - {serviceInfos ? formatDate(serviceInfos.expiration) : "..."}
              </span>
            </div>
            <a href={getAutorenewUrl(domain)} target="_blank" rel="noopener noreferrer" className="general-btn-more-v3"><MoreIcon /></a>
          </div>
        </div>

        {/* ============ TILE 5: CONTACTS ============ */}
        <div className="dom-general-info-card-v3">
          <div className="general-card-header-action">
            <h3 className="general-card-title-v3">{t("sections.contacts")}</h3>
            <a href={getContactsUrl(domain)} target="_blank" rel="noopener noreferrer" className="general-btn-more-v3"><MoreIcon /></a>
          </div>

          <div className="general-contacts-grid">
            {details?.whoisOwner && (
              <div className="general-contact-item">
                <span className="general-nic">{details.whoisOwner}</span>
                <span className="general-role">: {t("contacts.owner")}</span>
              </div>
            )}
            {serviceInfos && (
              <>
                <div className="general-contact-item">
                  <span className="general-nic">{serviceInfos.contactAdmin}</span>
                  <span className="general-role">: {t("contacts.admin")}</span>
                </div>
                <div className="general-contact-item">
                  <span className="general-nic">{serviceInfos.contactTech}</span>
                  <span className="general-role">: {t("contacts.tech")}</span>
                </div>
                <div className="general-contact-item">
                  <span className="general-nic">{serviceInfos.contactBilling}</span>
                  <span className="general-role">: {t("contacts.billing")}</span>
                </div>
              </>
            )}
          </div>
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
