// ============================================================
// WEB CLOUD - Dashboard avec compteurs par groupe
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ovhApi } from "../../services/api";
import "./index.css";

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
  alldom: number;
}

// ============ API HELPERS (inline) ============

async function countApi(path: string): Promise<number> {
  try {
    const list = await ovhApi.get<string[]>(path);
    return list.length;
  } catch {
    return 0;
  }
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
    alldom: 0,
  });

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadAllCounts();
  }, []);

  // ---------- LOADERS ----------
  const loadAllCounts = async () => {
    try {
      const [
        domains,
        dnsZones,
        hosting,
        privateDatabase,
        emailDomain,
        emailPro,
        exchange,
        office,
        zimbra,
        voip,
        sms,
        fax,
        carrierSip,
        packXdsl,
        overthebox,
        alldom,
      ] = await Promise.all([
        countApi("/domain"),
        countApi("/domain/zone"),
        countApi("/hosting/web"),
        countApi("/hosting/privateDatabase"),
        countApi("/email/domain"),
        countApi("/email/pro"),
        countApi("/email/exchange"),
        countApi("/license/office"),
        countApi("/email/zimbra"),
        countApi("/telephony"),
        countApi("/sms"),
        countApi("/freefax"),
        countApi("/telephony/spare"),
        countApi("/pack/xdsl"),
        countApi("/overTheBox"),
        countApi("/allDom"),
      ]);

      setCounts({
        domains,
        dnsZones,
        hosting,
        privateDatabase,
        emailDomain,
        emailPro,
        exchange,
        office,
        zimbra,
        voip,
        sms,
        fax,
        carrierSip,
        packXdsl,
        overthebox,
        alldom,
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
  const totalDomainsDns = counts.domains + counts.dnsZones + counts.alldom;
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
            {t("services.domains")}: {formatCount(counts.domains)} • {t("services.dnsZones")}: {formatCount(counts.dnsZones)} • AllDom: {formatCount(counts.alldom)}
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
            MX Plan: {formatCount(counts.emailDomain)} • Email Pro: {formatCount(counts.emailPro)} • Exchange: {formatCount(counts.exchange)} • Office: {formatCount(counts.office)} • Zimbra: {formatCount(counts.zimbra)}
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
            VoIP: {formatCount(counts.voip)} • SMS: {formatCount(counts.sms)} • Fax: {formatCount(counts.fax)}
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
            Pack xDSL: {formatCount(counts.packXdsl)} • OverTheBox: {formatCount(counts.overthebox)}
          </div>
        </div>
      </div>
    </div>
  );
}
