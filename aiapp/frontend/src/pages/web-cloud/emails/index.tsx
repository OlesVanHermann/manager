// ============================================================
// EMAILS - Page groupe avec sous-navigation
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { emailsPageService, EmailsCounts } from "./emailsPage.service";
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
  const [counts, setCounts] = useState<EmailsCounts>({ emailDomain: 0, emailPro: 0, exchange: 0, office: 0, zimbra: 0 });

  useEffect(() => {
    emailsPageService.loadAllCounts()
      .then(setCounts)
      .catch((err) => console.error("Failed to load counts:", err));
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
