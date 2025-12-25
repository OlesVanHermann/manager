// ============================================================
// SUPPORT PAGE - Support
// NAV1: general / NAV2: support
// Tabs: general (tickets), create, level, communications, broadcast
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GeneralTab } from "./tabs/general/GeneralTab";
import { CreateTab } from "./tabs/create/CreateTab";
import { LevelTab } from "./tabs/level/LevelTab";
import { CommunicationsTab } from "./tabs/communications/CommunicationsTab";
import { BroadcastTab } from "./tabs/broadcast/BroadcastTab";

// ============ TYPES ============

interface SupportPageProps {
  initialTab?: string;
}

// ============ CONSTANTES ============

const tabIdMap: Record<string, string> = {
  "support-general": "general",
  "support-create": "create",
  "support-level": "level",
  "support-communications": "communications",
  "support-broadcast": "broadcast",
};

// ============ COMPOSANT ============

/** Page Support avec 5 onglets: Mes tickets, Créer, Niveau, Communications, Diffusion. */
export default function SupportPage({ initialTab = "general" }: SupportPageProps) {
  const { t } = useTranslation('general/support/index');
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: "general", label: t('tabs.general', 'Mes tickets') },
    { id: "create", label: t('tabs.create') },
    { id: "level", label: t('tabs.level') },
    { id: "communications", label: t('tabs.communications') },
    { id: "broadcast", label: t('tabs.broadcast') },
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
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-content">
          <h1>{t('title')}</h1>
          <p className="page-subtitle">{t('subtitle')}</p>
        </div>
        <a href="https://help.ovhcloud.com/csm/fr-support" target="_blank" rel="noopener noreferrer" className="page-header-link">
          {t('guides')}
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
        {activeTab === "create" && <CreateTab />}
        {activeTab === "level" && <LevelTab />}
        {activeTab === "communications" && <CommunicationsTab />}
        {activeTab === "broadcast" && <BroadcastTab />}
      </div>
    </div>
  );
}
