// ============================================================
// API PAGE - Documentation et Console API OVHcloud
// NAV1: general / NAV2: api
// Tabs: general (documentation), console, advanced
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GeneralTab } from "./tabs/general/GeneralTab";
import { ConsoleTab } from "./tabs/console/ConsoleTab";
import { AdvancedTab } from "./tabs/advanced/AdvancedTab";

// ============ TYPES ============

interface ApiPageProps {
  initialTab?: string;
}

// ============ CONSTANTES ============

const tabIdMap: Record<string, string> = {
  "api-general": "general",
  "api-console": "console",
  "api-advanced": "advanced",
};

// ============ COMPOSANT ============

/** Page API avec 3 onglets: Documentation, Console, Paramètres avancés. */
export default function ApiPage({ initialTab = "general" }: ApiPageProps) {
  const { t } = useTranslation("general/api/index");
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: "general", label: t("tabs.general", "Documentation") },
    { id: "console", label: t("tabs.console", "Console") },
    { id: "advanced", label: t("tabs.advanced", "Avancé") },
  ];

  // ---------- EFFECTS ----------
  useEffect(() => {
    if (initialTab) {
      const mappedTab = tabIdMap[initialTab] || initialTab;
      if (tabs.find((tab) => tab.id === mappedTab)) {
        setActiveTab(mappedTab);
      }
    }
  }, [initialTab]);

  // ---------- RENDER ----------
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-content">
          <h1>{t("title", "API OVHcloud")}</h1>
          <p className="page-subtitle">{t("subtitle", "Documentation et console de test")}</p>
        </div>
        <a
          href="https://api.ovh.com/console"
          target="_blank"
          rel="noopener noreferrer"
          className="page-header-link"
        >
          {t("consoleLink", "Console officielle")}
        </a>
      </div>

      <div className="tabs-container">
        <div className="tabs-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tab-content">
        {activeTab === "general" && <GeneralTab />}
        {activeTab === "console" && <ConsoleTab />}
        {activeTab === "advanced" && <AdvancedTab />}
      </div>
    </div>
  );
}
