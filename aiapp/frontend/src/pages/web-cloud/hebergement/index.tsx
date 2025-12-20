// ============================================================
// HÉBERGEMENT - Page groupe avec sous-navigation
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService } from "../../../services/web-cloud.hosting";
import { privateDatabaseService } from "../../../services/web-cloud.private-database";
import HostingPage from "./hosting";
import PrivateDatabasePage from "./private-database";
import "../styles.css";

type SubSection = "hosting" | "private-database";

/** Page groupe Hébergement avec sous-navigation. */
export default function HebergementPage() {
  const { t } = useTranslation("web-cloud/hebergement/index");

  const [activeSection, setActiveSection] = useState<SubSection>("hosting");
  const [counts, setCounts] = useState({ hosting: 0, privateDb: 0 });

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [hostings, dbs] = await Promise.all([
          hostingService.listHostings(),
          privateDatabaseService.listDatabases(),
        ]);
        setCounts({ hosting: hostings.length, privateDb: dbs.length });
      } catch (err) {
        console.error("Failed to load counts:", err);
      }
    };
    loadCounts();
  }, []);

  const sections: { id: SubSection; labelKey: string; count: number }[] = [
    { id: "hosting", labelKey: "sections.hosting", count: counts.hosting },
    { id: "private-database", labelKey: "sections.privateDatabase", count: counts.privateDb },
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
        {activeSection === "hosting" && <HostingPage />}
        {activeSection === "private-database" && <PrivateDatabasePage />}
      </div>
    </div>
  );
}
