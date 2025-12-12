import { useState } from "react";
import type { OvhUser } from "../../types/auth.types";
import ProfileTile from "./ProfileTile";
import ShortcutsTile from "./ShortcutsTile";
import LastBillTile from "./LastBillTile";
import SecurityTab from "./SecurityTab";
import SupportLevelTab from "./SupportLevelTab";
import GdprTab from "./GdprTab";
import AdvancedTab from "./AdvancedTab";
import "./styles.css";

interface AccountPageProps {
  user: OvhUser | null;
  isActive?: boolean;
  onShortcutClick?: (shortcutId: string) => void;
}

const tabs = [
  { id: "general", label: "Informations generales" },
  { id: "security", label: "Securite" },
  { id: "support", label: "Mon niveau de support" },
  { id: "gdpr", label: "Donnees personnelles" },
  { id: "advanced", label: "Parametres avances" },
];

export default function AccountPage({ user, isActive, onShortcutClick }: AccountPageProps) {
  const [activeTab, setActiveTab] = useState("general");

  if (!isActive) return null;

  return (
    <div className="account-page">
      <div className="account-header">
        <div className="account-header-content">
          <h1>Mon compte</h1>
          <p className="account-subtitle">
            Administrez votre compte client. Dans cette rubrique, vous gerez la securite de votre compte, votre niveau de support et vos utilisateurs.
          </p>
        </div>
        <a href="https://help.ovhcloud.com" target="_blank" rel="noopener noreferrer" className="guides-link">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          Guides
        </a>
      </div>

      <div className="account-tabs">
        <button 
          className="tab-nav-btn prev" 
          disabled
          onClick={() => {
            const idx = tabs.findIndex(t => t.id === activeTab);
            if (idx > 0) setActiveTab(tabs[idx - 1].id);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
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
        <button 
          className="tab-nav-btn next"
          onClick={() => {
            const idx = tabs.findIndex(t => t.id === activeTab);
            if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {activeTab === "general" && (
        <div className="account-tiles">
          <ProfileTile user={user} />
          <ShortcutsTile onShortcutClick={onShortcutClick} />
          <LastBillTile onViewBill={() => onShortcutClick?.("ALL_BILLS")} />
        </div>
      )}

      {activeTab === "security" && <SecurityTab />}
      {activeTab === "support" && <SupportLevelTab />}
      {activeTab === "gdpr" && <GdprTab />}
      {activeTab === "advanced" && <AdvancedTab />}
    </div>
  );
}
