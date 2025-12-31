// ============================================================
// TAB - Licenses (Gestion des licences avec sous-onglets NAV4)
// ============================================================

import { useTranslation } from "react-i18next";
import { SUB_TABS_CONFIG } from "../../emails.constants";
import PacksTab from "./PacksTab";
import AlacarteTab from "./AlacarteTab";
import HistoryTab from "./HistoryTab";

interface LicensesTabProps {
  activeSubTab: string;
  onSubTabChange: (subTab: string) => void;
}

/** Onglet Licences avec navigation NAV4 (Packs, À la carte, Historique). */
export default function LicensesTab({
  activeSubTab,
  onSubTabChange,
}: LicensesTabProps) {
  const { t } = useTranslation("web-cloud/emails/licenses");

  const subTabs = SUB_TABS_CONFIG.filter((st) => st.parentTab === "licenses");

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case "packs":
        return <PacksTab />;
      case "alacarte":
        return <AlacarteTab />;
      case "history":
        return <HistoryTab />;
      default:
        return <PacksTab />;
    }
  };

  return (
    <div className="licenses-tab">
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
      <div className="licenses-content">
        {renderSubTabContent()}
      </div>
    </div>
  );
}
