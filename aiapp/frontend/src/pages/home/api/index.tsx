// ============================================================
// DEV PAGE - Playground API
// 2 Tabs: API, Paramètres avancés
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ApiTab, AdvancedTab } from "./tabs";
import "./index.css";

// ============ TYPES ============

interface DevProps {
  initialTab?: string;
}

// ============ CONSTANTES ============

const tabIdMap: Record<string, string> = {
  "api-console": "api",
  "api-advanced": "advanced",
};

// ============ COMPOSANT ============

/** Page Playground API avec 2 onglets: Console API, Paramètres avancés. */
export default function Dev({ initialTab = "api" }: DevProps) {
  const { t } = useTranslation('home/api/index');
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: "api", label: t('tabs.api') },
    { id: "advanced", label: t('tabs.advanced') },
  ];

  // ---------- EFFECTS ----------
  useEffect(() => {
    if (initialTab) {
      const mappedTab = tabIdMap[initialTab] || initialTab;
      if (tabs.find(t => t.id === mappedTab)) {
        setActiveTab(mappedTab);
      }
    }
  }, [initialTab]);

  // ---------- RENDER ----------
  return (
    <div className="api-page">
      <div className="api-header">
        <div className="api-header-content">
          <h1>{t('title')}</h1>
          <p className="api-subtitle">{t('subtitle')}</p>
        </div>
        <a href="https://api.ovh.com/console" target="_blank" rel="noopener noreferrer" className="api-guides-link">
          {t('consoleLink')}
        </a>
      </div>

      <div className="api-tabs-container">
        <div className="api-tabs-list">
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

      <div className="api-tab-content">
        {activeTab === "api" && <ApiTab />}
        {activeTab === "advanced" && <AdvancedTab />}
      </div>
    </div>
  );
}
