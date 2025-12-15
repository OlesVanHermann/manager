// ============================================================
// SUPPORT PAGE - Support
// 5 Tabs: Tickets, Créer, Niveau, Communications, Diffusion
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TicketsTab, CreateTab, LevelTab, CommunicationsTab, BroadcastTab } from "./tabs";
import "./styles.css";

// ============ TYPES ============

interface SupportPageProps {
  initialTab?: string;
}

// ============ CONSTANTES ============

const tabIdMap: Record<string, string> = {
  "support-tickets": "tickets",
  "support-create": "create",
  "support-level": "level",
  "support-communications": "communications",
  "support-broadcast": "broadcast",
};

// ============ COMPOSANT ============

/** Page Support avec 5 onglets: Tickets, Créer, Niveau, Communications, Diffusion. */
export default function SupportPage({ initialTab = "tickets" }: SupportPageProps) {
  const { t } = useTranslation('home/support/index');
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: "tickets", label: t('tabs.tickets') },
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
    <div className="support-page">
      <div className="support-header">
        <div className="support-header-content">
          <h1>{t('title')}</h1>
          <p className="support-subtitle">{t('subtitle')}</p>
        </div>
        <a href="https://help.ovhcloud.com/csm/fr-support" target="_blank" rel="noopener noreferrer" className="guides-link">
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

      <div className="tab-content support-content">
        {activeTab === "tickets" && <TicketsTab />}
        {activeTab === "create" && <CreateTab />}
        {activeTab === "level" && <LevelTab />}
        {activeTab === "communications" && <CommunicationsTab />}
        {activeTab === "broadcast" && <BroadcastTab />}
      </div>
    </div>
  );
}
