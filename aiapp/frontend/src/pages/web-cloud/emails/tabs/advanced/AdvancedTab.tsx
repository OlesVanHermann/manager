// ============================================================
// TAB - Advanced (Paramètres avancés avec sous-onglets NAV4)
// ============================================================

import { useTranslation } from "react-i18next";
import { SUB_TABS_CONFIG } from "../../emails.constants";
import ResourcesTab from "./ResourcesTab";
import ContactsTab from "./ContactsTab";
import AuditTab from "./AuditTab";
import DevicesTab from "./DevicesTab";

interface AdvancedTabProps {
  domain?: string;
  activeSubTab: string;
  onSubTabChange: (subTab: string) => void;
}

/** Onglet Avancé avec navigation NAV4 (Resources, Contacts, Audit, Devices). */
export default function AdvancedTab({
  domain,
  activeSubTab,
  onSubTabChange,
}: AdvancedTabProps) {
  const { t } = useTranslation("web-cloud/emails/advanced");

  const subTabs = SUB_TABS_CONFIG.filter((st) => st.parentTab === "advanced");

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case "resources":
        return <ResourcesTab domain={domain} />;
      case "contacts":
        return <ContactsTab domain={domain} />;
      case "audit":
        return <AuditTab domain={domain} />;
      case "devices":
        return <DevicesTab domain={domain} />;
      default:
        return <ResourcesTab domain={domain} />;
    }
  };

  return (
    <div className="advanced-tab">
      {/* NAV4 Sub-tabs */}
      <div className="emails-sub-tabs">
        {subTabs.map((subTab) => (
          <button
            key={subTab.id}
            className={`emails-sub-tab-btn ${activeSubTab === subTab.id ? "active" : ""}`}
            onClick={() => onSubTabChange(subTab.id)}
          >
            {t(`subTabs.${subTab.id}`)}
          </button>
        ))}
      </div>

      {/* Sub-tab content */}
      <div className="advanced-content">
        {renderSubTabContent()}
      </div>
    </div>
  );
}
