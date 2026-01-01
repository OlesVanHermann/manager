// ============================================================
// ACCOUNT PAGE - Mon compte
// NAV1: general / NAV2: account
// Tabs: general, security, privacy, kyc, contacts-services, contacts-requests, advanced
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { OvhUser } from "../../../types/auth.types";
import { GeneralTab } from "./tabs/general/GeneralTab";
import { SecurityTab } from "./tabs/security/SecurityTab";
import { PrivacyTab } from "./tabs/privacy/PrivacyTab";
import { AdvancedTab } from "./tabs/advanced/AdvancedTab";
import { ContactsServicesTab } from "./tabs/contacts-services/ContactsServicesTab";
import { ContactsRequestsTab } from "./tabs/contacts-requests/ContactsRequestsTab";
import { KycTab } from "./tabs/kyc/KycTab";

// ============ TYPES ============

interface AccountPageProps {
  user: OvhUser | null;
  isActive?: boolean;
  onNavigate?: (section: string, options?: { tab?: string }) => void;
  initialTab?: string;
}

// ============ CONSTANTES ============

const tabIdMap: Record<string, string> = {
  "account-general": "general",
  "account-security": "security",
  "account-privacy": "privacy",
  "account-kyc": "kyc",
  "account-contacts-services": "contacts-services",
  "account-contacts-requests": "contacts-requests",
  "account-advanced": "advanced",
};

// ============ COMPOSANT ============

/** Page Mon Compte avec 7 onglets. */
export default function AccountPage({ user, isActive: _isActive = true, onNavigate: _onNavigate, initialTab = "general" }: AccountPageProps) {
  const { t } = useTranslation("general/account/index");
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: "general", label: t("tabs.general", "Général") },
    { id: "security", label: t("tabs.security", "Sécurité") },
    { id: "privacy", label: t("tabs.privacy", "Confidentialité") },
    { id: "kyc", label: t("tabs.kyc", "Vérification") },
    { id: "contacts-services", label: t("tabs.contactsServices", "Contacts services") },
    { id: "contacts-requests", label: t("tabs.contactsRequests", "Demandes") },
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
          <h1>{t("title", "Mon compte")}</h1>
          <p className="page-subtitle">{t("subtitle", "Gérez vos informations personnelles et vos préférences")}</p>
        </div>
        <a
          href="https://docs.ovh.com/fr/customer/tout-sur-votre-identifiant-client/"
          target="_blank"
          rel="noopener noreferrer"
          className="page-header-link"
        >
          {t("guides", "Guides")}
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
        {activeTab === "general" && <GeneralTab user={user} />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "privacy" && <PrivacyTab />}
        {activeTab === "kyc" && <KycTab />}
        {activeTab === "contacts-services" && <ContactsServicesTab />}
        {activeTab === "contacts-requests" && <ContactsRequestsTab />}
        {activeTab === "advanced" && <AdvancedTab />}
      </div>
    </div>
  );
}
