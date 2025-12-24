// ============================================================
// WEB CLOUD - Dashboard avec compteurs par groupe
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { domainsService } from "../../services/web-cloud.domains";
import { dnsZonesService } from "../../services/web-cloud.dns-zones";
import { hostingService } from "../../services/web-cloud.hosting";
import { privateDatabaseService } from "../../services/web-cloud.private-database";
import { emailDomainService } from "../../services/web-cloud.email-domain";
import { emailProService } from "../../services/web-cloud.email-pro";
import { exchangeService } from "../../services/web-cloud.exchange";
import { officeService } from "../../services/web-cloud.office";
import { zimbraService } from "../../services/web-cloud.zimbra";
import { voipService } from "../../services/web-cloud.voip";
import { smsService } from "../../services/web-cloud.sms";
import { faxService } from "../../services/web-cloud.fax";
import { carrierSipService } from "../../services/web-cloud.carrier-sip";
import { packXdslService } from "../../services/web-cloud.pack-xdsl";
import { overtheboxService } from "../../services/web-cloud.overthebox";
import "./styles.css";

// ============ TYPES ============

interface WebCloudDashboardProps {
  onNavigate?: (section: string, options?: { tab?: string }) => void;
}

interface Counts {
  domains: number;
  dnsZones: number;
  hosting: number;
  privateDatabase: number;
  emailDomain: number;
  emailPro: number;
  exchange: number;
  office: number;
  zimbra: number;
  voip: number;
  sms: number;
  fax: number;
  carrierSip: number;
  packXdsl: number;
  overthebox: number;
}

// ============ ICONS ============

const GlobeIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const ServerIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
    <line x1="6" y1="6" x2="6.01" y2="6"/>
    <line x1="6" y1="18" x2="6.01" y2="18"/>
  </svg>
);

const MailIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const WifiIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
    <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
    <line x1="12" y1="20" x2="12.01" y2="20"/>
  </svg>
);

// ============ COMPOSANT PRINCIPAL ============

/** Dashboard Web Cloud avec compteurs par groupe et navigation. */
export default function WebCloudDashboard({ onNavigate }: WebCloudDashboardProps) {
  const { t } = useTranslation("web-cloud/index");

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Counts>({
    domains: 0,
    dnsZones: 0,
    hosting: 0,
    privateDatabase: 0,
    emailDomain: 0,
    emailPro: 0,
    exchange: 0,
    office: 0,
    zimbra: 0,
    voip: 0,
    sms: 0,
    fax: 0,
    carrierSip: 0,
    packXdsl: 0,
    overthebox: 0,
  });

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadAllCounts();
  }, []);

  // ---------- LOADERS ----------
  const loadAllCounts = async () => {
    try {
      const results = await Promise.allSettled([
        domainsService.listDomains?.() ?? Promise.resolve([]),
        dnsZonesService.listZones?.() ?? Promise.resolve([]),
        hostingService.listHostings?.() ?? Promise.resolve([]),
        privateDatabaseService.listPrivateDatabases?.() ?? Promise.resolve([]),
        emailDomainService.listDomains?.() ?? Promise.resolve([]),
        emailProService.listServices?.() ?? Promise.resolve([]),
        exchangeService.listOrganizations?.() ?? exchangeService.listServices?.() ?? Promise.resolve([]),
        officeService.listTenants?.() ?? officeService.listServices?.() ?? Promise.resolve([]),
        zimbraService.listPlatforms?.() ?? zimbraService.listServices?.() ?? Promise.resolve([]),
        voipService.listBillingAccounts?.() ?? voipService.listServices?.() ?? Promise.resolve([]),
        smsService.listAccounts?.() ?? smsService.listServices?.() ?? Promise.resolve([]),
        faxService.listServices?.() ?? Promise.resolve([]),
        carrierSipService.listServices?.() ?? Promise.resolve([]),
        packXdslService.listPacks?.() ?? packXdslService.listServices?.() ?? Promise.resolve([]),
        overtheboxService.listServices?.() ?? Promise.resolve([]),
      ]);

      const getCount = (r: PromiseSettledResult<string[]>) => 
        r.status === "fulfilled" ? r.value.length : 0;

      setCounts({
        domains: getCount(results[0]),
        dnsZones: getCount(results[1]),
        hosting: getCount(results[2]),
        privateDatabase: getCount(results[3]),
        emailDomain: getCount(results[4]),
        emailPro: getCount(results[5]),
        exchange: getCount(results[6]),
        office: getCount(results[7]),
        zimbra: getCount(results[8]),
        voip: getCount(results[9]),
        sms: getCount(results[10]),
        fax: getCount(results[11]),
        carrierSip: getCount(results[12]),
        packXdsl: getCount(results[13]),
        overthebox: getCount(results[14]),
      });
    } catch (err) {
      console.error("[WebCloud] Error loading counts:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleNavigate = (sectionId: string) => {
    onNavigate?.(sectionId);
  };

  // ---------- HELPERS ----------
  const formatCount = (n: number) => (loading ? "..." : String(n));

  // ---------- COMPUTED ----------
  const totalDomainsDns = counts.domains + counts.dnsZones;
  const totalHebergement = counts.hosting + counts.privateDatabase;
  const totalEmails = counts.emailDomain + counts.emailPro + counts.exchange + counts.office + counts.zimbra;
  const totalTelecom = counts.voip + counts.sms + counts.fax + counts.carrierSip;
  const totalAccess = counts.packXdsl + counts.overthebox;

  // ---------- RENDER ----------
  return (
    <div className="wc-page">
      <div className="wc-header">
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
      </div>

      <div className="wc-dashboard">
        {/* Domaines & DNS */}
        <div className="wc-group-card" onClick={() => handleNavigate("web-domains-dns")}>
          <div className="wc-group-header">
            <div className="wc-group-icon"><GlobeIcon /></div>
            <div className="wc-group-info">
              <h3 className="wc-group-label">{t("groups.domainsDns")}</h3>
              <span className="wc-group-total">{formatCount(totalDomainsDns)} {t("servicesUnit")}</span>
            </div>
            <div className="wc-group-arrow">→</div>
          </div>
          <div className="wc-group-detail">
            {t("services.domains")}: {formatCount(counts.domains)} • {t("services.dnsZones")}: {formatCount(counts.dnsZones)}
          </div>
        </div>

        {/* Hébergement */}
        <div className="wc-group-card" onClick={() => handleNavigate("web-hosting")}>
          <div className="wc-group-header">
            <div className="wc-group-icon"><ServerIcon /></div>
            <div className="wc-group-info">
              <h3 className="wc-group-label">{t("groups.hebergement")}</h3>
              <span className="wc-group-total">{formatCount(totalHebergement)} {t("servicesUnit")}</span>
            </div>
            <div className="wc-group-arrow">→</div>
          </div>
          <div className="wc-group-detail">
            {t("services.hosting")}: {formatCount(counts.hosting)} • {t("services.privateDatabase")}: {formatCount(counts.privateDatabase)}
          </div>
        </div>

        {/* Emails */}
        <div className="wc-group-card" onClick={() => handleNavigate("web-emails")}>
          <div className="wc-group-header">
            <div className="wc-group-icon"><MailIcon /></div>
            <div className="wc-group-info">
              <h3 className="wc-group-label">{t("groups.emails")}</h3>
              <span className="wc-group-total">{formatCount(totalEmails)} {t("servicesUnit")}</span>
            </div>
            <div className="wc-group-arrow">→</div>
          </div>
          <div className="wc-group-detail">
            {t("services.emailDomain")}: {formatCount(counts.emailDomain)} • {t("services.emailPro")}: {formatCount(counts.emailPro)} • {t("services.exchange")}: {formatCount(counts.exchange)} • {t("services.office")}: {formatCount(counts.office)} • {t("services.zimbra")}: {formatCount(counts.zimbra)}
          </div>
        </div>

        {/* Téléphonie */}
        <div className="wc-group-card" onClick={() => handleNavigate("web-voip")}>
          <div className="wc-group-header">
            <div className="wc-group-icon"><PhoneIcon /></div>
            <div className="wc-group-info">
              <h3 className="wc-group-label">{t("groups.telecom")}</h3>
              <span className="wc-group-total">{formatCount(totalTelecom)} {t("servicesUnit")}</span>
            </div>
            <div className="wc-group-arrow">→</div>
          </div>
          <div className="wc-group-detail">
            {t("services.voip")}: {formatCount(counts.voip)} • {t("services.sms")}: {formatCount(counts.sms)} • {t("services.fax")}: {formatCount(counts.fax)} • {t("services.carrierSip")}: {formatCount(counts.carrierSip)}
          </div>
        </div>

        {/* Accès Internet */}
        <div className="wc-group-card" onClick={() => handleNavigate("web-access")}>
          <div className="wc-group-header">
            <div className="wc-group-icon"><WifiIcon /></div>
            <div className="wc-group-info">
              <h3 className="wc-group-label">{t("groups.access")}</h3>
              <span className="wc-group-total">{formatCount(totalAccess)} {t("servicesUnit")}</span>
            </div>
            <div className="wc-group-arrow">→</div>
          </div>
          <div className="wc-group-detail">
            {t("services.packXdsl")}: {formatCount(counts.packXdsl)} • {t("services.overthebox")}: {formatCount(counts.overthebox)}
          </div>
        </div>
      </div>
    </div>
  );
}
