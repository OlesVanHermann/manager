// ============================================================
// TÉLÉCOM - Page groupe avec sous-navigation
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { voipService } from "../../../services/web-cloud.voip";
import { smsService } from "../../../services/web-cloud.sms";
import { faxService } from "../../../services/web-cloud.fax";
import { carrierSipService } from "../../../services/web-cloud.carrier-sip";
import VoipPage from "./voip";
import SmsPage from "./sms";
import FaxPage from "./fax";
import CarrierSipPage from "./carrier-sip";

type SubSection = "voip" | "sms" | "fax" | "carrier-sip";

/** Page groupe Télécom avec sous-navigation. */
export default function TelecomPage() {
  const { t } = useTranslation("web-cloud/telecom/index");

  const [activeSection, setActiveSection] = useState<SubSection>("voip");
  const [counts, setCounts] = useState({ voip: 0, sms: 0, fax: 0, carrierSip: 0 });

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [voips, smss, faxes, sips] = await Promise.all([
          voipService.listBillingAccounts(),
          smsService.listAccounts(),
          faxService.listServices(),
          carrierSipService.listServices(),
        ]);
        setCounts({
          voip: voips.length,
          sms: smss.length,
          fax: faxes.length,
          carrierSip: sips.length,
        });
      } catch (err) {
        console.error("Failed to load counts:", err);
      }
    };
    loadCounts();
  }, []);

  const sections: { id: SubSection; labelKey: string; count: number }[] = [
    { id: "voip", labelKey: "sections.voip", count: counts.voip },
    { id: "sms", labelKey: "sections.sms", count: counts.sms },
    { id: "fax", labelKey: "sections.fax", count: counts.fax },
    { id: "carrier-sip", labelKey: "sections.carrierSip", count: counts.carrierSip },
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
        {activeSection === "voip" && <VoipPage />}
        {activeSection === "sms" && <SmsPage />}
        {activeSection === "fax" && <FaxPage />}
        {activeSection === "carrier-sip" && <CarrierSipPage />}
      </div>
    </div>
  );
}
