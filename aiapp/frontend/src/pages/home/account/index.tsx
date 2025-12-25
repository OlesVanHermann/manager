// ============================================================
// ACCOUNT PAGE - Mon compte
// Tabs: Infos générales, Éditer, Sécurité, GDPR, Avancé, Contacts
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { OvhUser } from "../../../types/auth.types";
import ProfileTile from "./components/ProfileTile";
import ShortcutsTile from "./components/ShortcutsTile";
import LastBillTile from "./components/LastBillTile";
import EditTab from "./tabs/edit/EditTab";
import SecurityTab from "./tabs/security/SecurityTab";
import PrivacyTab from "./tabs/privacy/PrivacyTab";
import AdvancedTab from "./tabs/advanced/AdvancedTab";
import ContactsServicesTab from "./tabs/contacts-services/ContactsServicesTab";
import { ContactsRequestsTab } from "./tabs/contacts-requests/ContactsRequestsTab";
import KycTab from "./tabs/kyc/KycTab";
import "./index.css";

// ============ TYPES ============

interface AccountPageProps {
  user: OvhUser | null;
  isActive?: boolean;
  onNavigate?: (section: string, options?: { tab?: string }) => void;
  initialTab?: string;
}

// ============ CONSTANTES ============

const tabIdMap: Record<string, string> = {
  "account-info": "info",
  "account-edit": "edit",
  "account-security": "security",
  "account-gdpr": "gdpr",
  "account-advanced": "advanced",
  "account-contacts-services": "contacts-services",
  "account-contacts-requests": "contacts-requests",
  "account-kyc": "kyc",
};

// ============ COMPOSANT ============

/** Page Mon compte avec 8 onglets: Infos, Éditer, Sécurité, GDPR, Avancé, Contacts Services, Contacts Demandes, KYC. */
export default function AccountPage({ user, isActive, onNavigate, initialTab }: AccountPageProps) {
  const { t } = useTranslation('home/account/index');
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    { id: "info", label: t('tabs.info') },
    { id: "edit", label: t('tabs.edit') },
    { id: "security", label: t('tabs.security') },
    { id: "gdpr", label: t('tabs.gdpr') },
    { id: "advanced", label: t('tabs.advanced') },
    { id: "contacts-services", label: t('tabs.contactsServices') },
    { id: "contacts-requests", label: t('tabs.contactsRequests') },
    { id: "kyc", label: t('tabs.kyc') },
  ];

  // ---------- EFFECTS ----------
  useEffect(() => {
    if (initialTab) {
      const mappedTab = tabIdMap[initialTab] || initialTab;
      if (tabs.find(tab => tab.id === mappedTab)) {
        setActiveTab(mappedTab);
      }
    }
  }, [initialTab]);

  if (isActive === false) return null;

  // ---------- HANDLERS ----------
  const handleShortcutClick = (_shortcutId: string, section?: string, tab?: string) => {
    if (onNavigate && section) {
      onNavigate(section, { tab });
    }
  };

  const handleEditProfile = () => setActiveTab("edit");
  const handleViewBill = () => onNavigate?.("home-billing", { tab: "billing-invoices" });

  // ---------- RENDER ----------
  return (
    <div className="account-page">
      <div className="account-header">
        <div className="account-header-content">
          <h1>{t('title')}</h1>
          <p className="account-subtitle">{t('subtitle')}</p>
        </div>
        <a href="https://help.ovhcloud.com" target="_blank" rel="noopener noreferrer" className="account-guides-link">{t('guides')}</a>
      </div>

      <div className="account-tabs-container">
        <div className="account-tabs-list">
          {tabs.map((tab) => (
            <button key={tab.id} className={"tab-btn" + (activeTab === tab.id ? " active" : "")} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
          ))}
        </div>
      </div>

      {activeTab === "info" && (
        <div className="account-tiles">
          <ProfileTile user={user} onEditProfile={handleEditProfile} />
          <ShortcutsTile onShortcutClick={handleShortcutClick} />
          <LastBillTile onViewBill={handleViewBill} />
        </div>
      )}

      {activeTab === "edit" && <EditTab user={user} />}
      {activeTab === "security" && <SecurityTab />}
      {activeTab === "gdpr" && <PrivacyTab />}
      {activeTab === "advanced" && <AdvancedTab />}
      {activeTab === "contacts-services" && <ContactsServicesTab />}
      {activeTab === "contacts-requests" && <ContactsRequestsTab />}
      {activeTab === "kyc" && <KycTab />}
    </div>
  );
}
