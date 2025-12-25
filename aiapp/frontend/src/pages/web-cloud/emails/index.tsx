// ============================================================
// EMAILS - Page groupe avec sous-navigation
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { emailDomainService } from "../../../services/web-cloud.email-domain";
import { emailProService } from "../../../services/web-cloud.email-pro";
import { exchangeService } from "../../../services/web-cloud.exchange";
import { officeService } from "../../../services/web-cloud.office";
import { zimbraService } from "../../../services/web-cloud.zimbra";
import EmailDomainPage from "./email-domain";
import EmailProPage from "./email-pro";
import ExchangePage from "./exchange";
import OfficePage from "./office";
import ZimbraPage from "./zimbra";

type SubSection = "email-domain" | "email-pro" | "exchange" | "office" | "zimbra";

/** Page groupe Emails avec sous-navigation. */
export default function EmailsPage() {
  const { t } = useTranslation("web-cloud/emails/index");

  const [activeSection, setActiveSection] = useState<SubSection>("email-domain");
  const [counts, setCounts] = useState({ emailDomain: 0, emailPro: 0, exchange: 0, office: 0, zimbra: 0 });

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [emailDomains, emailPros, exchanges, offices, zimbras] = await Promise.all([
          emailDomainService.listDomains(),
          emailProService.listServices(),
          exchangeService.listOrganizations(),
          officeService.listTenants(),
          zimbraService.listPlatforms(),
        ]);
        setCounts({
          emailDomain: emailDomains.length,
          emailPro: emailPros.length,
          exchange: exchanges.length,
          office: offices.length,
          zimbra: zimbras.length,
        });
      } catch (err) {
        console.error("Failed to load counts:", err);
      }
    };
    loadCounts();
  }, []);

  const sections: { id: SubSection; labelKey: string; count: number }[] = [
    { id: "email-domain", labelKey: "sections.emailDomain", count: counts.emailDomain },
    { id: "email-pro", labelKey: "sections.emailPro", count: counts.emailPro },
    { id: "exchange", labelKey: "sections.exchange", count: counts.exchange },
    { id: "office", labelKey: "sections.office", count: counts.office },
    { id: "zimbra", labelKey: "sections.zimbra", count: counts.zimbra },
  ];

  return (
    <div className="service-list-page">
      <div className="sub-nav">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`sub-nav-item ${activeSection === section.id ? "active" : ""}`}
            onClick={() => setActiveSection(section.id)}
          >
            {t(section.labelKey)}
            <span className="count">{section.count}</span>
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>
        {activeSection === "email-domain" && <EmailDomainPage />}
        {activeSection === "email-pro" && <EmailProPage />}
        {activeSection === "exchange" && <ExchangePage />}
        {activeSection === "office" && <OfficePage />}
        {activeSection === "zimbra" && <ZimbraPage />}
      </div>
    </div>
  );
}
