// ============================================================
// WEB CLOUD - Dashboard principal (style Billing)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { domainsService } from "../../services/web-cloud.domains";
import { hostingService } from "../../services/web-cloud.hosting";
import { emailDomainService } from "../../services/web-cloud.email-domain";
import { voipService } from "../../services/web-cloud.voip";
import { smsService } from "../../services/web-cloud.sms";
import { faxService } from "../../services/web-cloud.fax";
import "./styles.css";

// ============ ICONS ============

const GlobeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const ServerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
  </svg>
);

const MailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const MessageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const FaxIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 2v5"/><path d="M8 2v5"/><path d="M6 11h.01"/><path d="M10 11h.01"/>
  </svg>
);

// ============ COMPOSANT ============

/** Dashboard Web Cloud avec compteurs et tuiles. */
export default function WebCloudDashboard() {
  const { t } = useTranslation("web-cloud/index");

  const [counts, setCounts] = useState({
    domains: 0,
    hosting: 0,
    emails: 0,
    voip: 0,
    sms: 0,
    fax: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [domains, hosting, emails, voip, sms, fax] = await Promise.all([
          domainsService.listDomains().catch(() => []),
          hostingService.listHostings().catch(() => []),
          emailDomainService.listDomains().catch(() => []),
          voipService.listBillingAccounts().catch(() => []),
          smsService.listSmsAccounts().catch(() => []),
          faxService.listFreefax().catch(() => []),
        ]);
        setCounts({
          domains: domains.length,
          hosting: hosting.length,
          emails: emails.length,
          voip: voip.length,
          sms: sms.length,
          fax: fax.length,
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const tiles = [
    { key: "domains", icon: <GlobeIcon />, count: counts.domains },
    { key: "hosting", icon: <ServerIcon />, count: counts.hosting },
    { key: "emails", icon: <MailIcon />, count: counts.emails },
    { key: "voip", icon: <PhoneIcon />, count: counts.voip },
    { key: "sms", icon: <MessageIcon />, count: counts.sms },
    { key: "fax", icon: <FaxIcon />, count: counts.fax },
  ];

  return (
    <div className="webcloud-dashboard">
      <header className="page-header">
        <h1>{t("title")}</h1>
        <p className="page-description">{t("description")}</p>
      </header>

      <div className="dashboard-grid">
        {tiles.map((tile) => (
          <div key={tile.key} className="dashboard-tile">
            <div className="tile-icon">{tile.icon}</div>
            <h3>{t(`tiles.${tile.key}.title`)}</h3>
            <p>{t(`tiles.${tile.key}.description`)}</p>
            <span className="tile-count">{loading ? "..." : tile.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
