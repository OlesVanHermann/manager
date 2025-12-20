// ============================================================
// TAB: GENERAL - Informations domaine layout 3 colonnes v3
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

const ServerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
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

const HelpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

// ============ EXTERNAL LINKS ============

const OVH_MANAGER_BASE = "https://www.ovh.com/manager";
const getAutorenewUrl = (domain: string) => `${OVH_MANAGER_BASE}/#/dedicated/billing/autorenew?searchText=${encodeURIComponent(domain)}`;
const getContactsUrl = (domain: string) => `${OVH_MANAGER_BASE}/#/dedicated/contacts/services?serviceName=${encodeURIComponent(domain)}`;
const getWhoisUrl = (domain: string) => `${OVH_MANAGER_BASE}/#/web/domain/${encodeURIComponent(domain)}/owo`;
const getHostingUrl = () => "https://www.ovhcloud.com/fr/web-hosting/";
const getExtensionUrl = () => "https://www.ovhcloud.com/fr/domains/tld/";

// ============ COMPOSANT PRINCIPAL ============

export function GeneralTab({ domain, details, serviceInfos, loading, onRefresh }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  const [toggling, setToggling] = useState(false);
  const [dnssecToggling, setDnssecToggling] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  const formatDateLong = (dateStr: string) => new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const handleToggleLock = async () => {
    if (!details) return;
    const isLocked = details.transferLockStatus === "locked";
    if (!confirm(isLocked ? "Voulez-vous déverrouiller ce domaine ?" : "Voulez-vous verrouiller ce domaine ?")) return;
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

  const isLocked = details?.transferLockStatus === "locked";
  const isLocking = details?.transferLockStatus === "locking" || details?.transferLockStatus === "unlocking";
  const dnssecEnabled = details?.dnssecSupported || false;

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

  return (
    <div className="general-tab-v3">
      <div className="general-grid-3">
        {/* ============ COL 1: INFORMATIONS GÉNÉRALES ============ */}
        <div className="info-card-v3">
          <h3 className="card-title-v3">Informations générales</h3>
          
          <div className="info-row-v3">
            <div className="row-label">STATUT</div>
            <div className="row-value-box">
              <span className="badge-status info">{serviceInfos?.renew.automatic ? "Renouvellement automatique" : "Renouvellement manuel"}</span>
            </div>
          </div>

          <div className="info-row-v3 with-action">
            <div className="row-main">
              <div className="row-label"><ServerIcon /> SERVEURS DNS</div>
              <div className="row-value-box">
                <span className={`badge-status ${details?.nameServerType === "hosted" ? "success" : "warning"}`}>
                  {details?.nameServerType === "hosted" ? "Actifs" : "Externes"}
                </span>
              </div>
            </div>
            <button className="btn-more-v3"><MoreIcon /></button>
          </div>

          <div className="info-row-v3 with-action">
            <div className="row-main">
              <div className="row-label"><GlobeIcon /> OPTION DNS ANYCAST</div>
              <div className="row-value-box">
                <span className="value-text">DNS classique</span>
              </div>
            </div>
            <button className="btn-more-v3"><MoreIcon /></button>
          </div>

          <div className="info-row-v3 with-action">
            <div className="row-main">
              <div className="row-label">HÉBERGEMENT WEB ET E-MAIL GRATUIT</div>
              <div className="row-value-box">
                <a href={getHostingUrl()} target="_blank" rel="noopener noreferrer" className="link-primary-v3">Plus d'infos <ExternalLinkIcon /></a>
              </div>
            </div>
            <button className="btn-more-v3"><MoreIcon /></button>
          </div>

          <div className="info-row-v3 with-action">
            <div className="row-main">
              <div className="row-label">HÉBERGEMENTS COMMANDÉS</div>
              <div className="row-value-box">
                <span className="value-text muted">Aucun hébergement commandé</span>
              </div>
            </div>
            <button className="btn-more-v3"><MoreIcon /></button>
          </div>

          <div className="info-row-v3 with-action">
            <div className="row-main">
              <div className="row-label">HÉBERGEMENTS ASSOCIÉS</div>
              <div className="row-value-box">
                <span className="value-text muted">Aucun hébergement associé</span>
              </div>
            </div>
            <button className="btn-more-v3"><MoreIcon /></button>
          </div>

          <div className="info-row-v3">
            <div className="row-label">SOUS-DOMAINES ET MULTISITES</div>
            <div className="row-value-box">
              <span className="value-text muted">Aucun sous-domaine ou multisite</span>
            </div>
          </div>
        </div>

        {/* ============ COL 2: SÉCURITÉ ============ */}
        <div className="info-card-v3">
          <h3 className="card-title-v3">Sécurité</h3>

          <div className="security-row-v3">
            <div className="security-label-row">
              <span>Protection contre le transfert</span>
              <span className="help-icon-v3" title="Protège votre domaine contre les transferts non autorisés"><HelpIcon /></span>
            </div>
            <div className="security-control-v3">
              <button className={`toggle-switch-v3 ${isLocked ? "active" : ""}`} onClick={handleToggleLock} disabled={toggling || isLocking}>
                <span className="toggle-slider-v3" />
              </button>
              <span className={`toggle-badge ${isLocked ? "success" : "warning"}`}>
                {toggling ? "..." : isLocked ? "Activée" : "Désactivée"}
              </span>
            </div>
          </div>

          <div className="security-row-v3">
            <div className="security-label-row">
              <span>Délégation Sécurisée - DNSSEC</span>
              <span className="help-icon-v3" title="Sécurise les réponses DNS"><HelpIcon /></span>
            </div>
            <div className="security-control-v3">
              <button className={`toggle-switch-v3 ${dnssecEnabled ? "active" : ""}`} onClick={handleToggleDnssec} disabled={dnssecToggling}>
                <span className="toggle-slider-v3" />
              </button>
              <span className={`toggle-badge ${dnssecEnabled ? "success" : "warning"}`}>
                {dnssecToggling ? "..." : dnssecEnabled ? "Activé" : "Désactivé"}
              </span>
            </div>
          </div>

          <div className="security-row-v3">
            <div className="security-label-row">
              <span>Affichage du WHOIS</span>
            </div>
            <a href={getWhoisUrl(domain)} target="_blank" rel="noopener noreferrer" className="btn-whois">
              Configurer l'affichage du WHOIS
            </a>
          </div>
        </div>

        {/* ============ COL 3: ABONNEMENT ============ */}
        <div className="info-card-v3">
          <h3 className="card-title-v3">Abonnement</h3>

          {serviceInfos && (
            <>
              <div className="abo-row-v3 with-action">
                <div className="abo-main">
                  <div className="abo-label">Renouvellement automatique prévu en</div>
                  <div className="abo-value highlight">{formatDate(serviceInfos.expiration)}</div>
                </div>
                <a href={getAutorenewUrl(domain)} target="_blank" rel="noopener noreferrer" className="btn-more-v3"><MoreIcon /></a>
              </div>

              <div className="abo-row-v3 with-action">
                <div className="abo-main">
                  <div className="abo-label"><UserIcon /> Contacts</div>
                  <div className="contacts-list-v3">
                    <div className="contact-line"><span className="nic">{serviceInfos.contactAdmin}</span><span className="role">Administrateur</span></div>
                    <div className="contact-line"><span className="nic">{serviceInfos.contactTech}</span><span className="role">Technique</span></div>
                    <div className="contact-line"><span className="nic">{serviceInfos.contactBilling}</span><span className="role">Facturation</span></div>
                    {details?.whoisOwner && <div className="contact-line"><span className="nic">{details.whoisOwner}</span><span className="role">Titulaire</span></div>}
                  </div>
                </div>
                <a href={getContactsUrl(domain)} target="_blank" rel="noopener noreferrer" className="btn-more-v3"><MoreIcon /></a>
              </div>

              <div className="abo-row-v3">
                <div className="abo-label"><CalendarIcon /> Date de création</div>
                <div className="abo-value">{formatDateLong(serviceInfos.creation)}</div>
              </div>

              {details?.offer && (
                <div className="abo-row-v3">
                  <div className="abo-label">Offre</div>
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
          <h3 className="card-title-v3">Guides</h3>
          <div className="accordion-item-v3" onClick={() => setGuidesOpen(!guidesOpen)}>
            <span className="accordion-label-v3">Informations générales</span>
            <span className={`accordion-chevron ${guidesOpen ? "open" : ""}`}><ChevronDownIcon /></span>
          </div>
          {guidesOpen && (
            <div className="accordion-content-v3">
              <a href="https://help.ovhcloud.com/csm/fr-domains-dns-zone" target="_blank" rel="noopener noreferrer" className="guide-link-v3">Gérer sa zone DNS <ExternalLinkIcon /></a>
              <a href="https://help.ovhcloud.com/csm/fr-domains-transfer-lock" target="_blank" rel="noopener noreferrer" className="guide-link-v3">Protéger son domaine <ExternalLinkIcon /></a>
              <a href="https://help.ovhcloud.com/csm/fr-domains-dnssec" target="_blank" rel="noopener noreferrer" className="guide-link-v3">Configurer DNSSEC <ExternalLinkIcon /></a>
            </div>
          )}
        </div>

        <div className="info-card-v3 compact">
          <h3 className="card-title-v3">Résumé des options</h3>
          <div className="option-row-v3"><span className="option-label-v3">DNS Anycast</span><span className="option-value-v3 muted">Option non disponible</span></div>
          <div className="option-row-v3"><span className="option-label-v3">OWO (masquage WHOIS)</span><span className={`option-value-v3 ${details?.owoSupported ? "" : "muted"}`}>{details?.owoSupported ? "Disponible" : "Non supporté"}</span></div>
          <div className="option-row-v3"><span className="option-label-v3">Type DNS</span><span className="option-value-v3">{details?.nameServerType === "hosted" ? "OVH" : "Externe"}</span></div>
        </div>

        <div className="info-card-v3 compact highlight">
          <h3 className="card-title-v3">Nos conseils</h3>
          <p className="advice-intro-v3">Aller plus loin avec nos solutions :</p>
          <a href={getHostingUrl()} target="_blank" rel="noopener noreferrer" className="advice-link-v3"><span>Héberger votre site web</span><ChevronRightIcon /></a>
          <a href={getExtensionUrl()} target="_blank" rel="noopener noreferrer" className="advice-link-v3"><span>Choisir une extension locale en .fr</span><ChevronRightIcon /></a>
          <a href="https://www.ovhcloud.com/fr/emails/" target="_blank" rel="noopener noreferrer" className="advice-link-v3"><span>Créer des adresses email pro</span><ChevronRightIcon /></a>
        </div>
      </div>
    </div>
  );
}

export default GeneralTab;
