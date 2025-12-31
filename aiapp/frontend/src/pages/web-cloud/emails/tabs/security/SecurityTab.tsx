// ============================================================
// TAB - Security (Sécurité avec sous-onglets NAV4)
// ============================================================

import { useTranslation } from "react-i18next";
import { EmailOffer } from "../../types";
import { SUB_TABS_CONFIG } from "../../emails.constants";
import DnsConfigTab from "./DnsConfigTab";
import AntispamTab from "./AntispamTab";
import SignatureTab from "./SignatureTab";

interface SecurityTabProps {
  domain?: string;
  offers: EmailOffer[];
  activeSubTab: string;
  onSubTabChange: (subTab: string) => void;
}

/** Onglet Sécurité avec navigation NAV4 (DNS, Antispam, Signature). */
export default function SecurityTab({
  domain,
  offers,
  activeSubTab,
  onSubTabChange,
}: SecurityTabProps) {
  const { t } = useTranslation("web-cloud/emails/security");

  const subTabs = SUB_TABS_CONFIG.filter((st) => st.parentTab === "security");

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case "dns":
        return <DnsConfigTab domain={domain} />;
      case "antispam":
        return <AntispamTab domain={domain} offers={offers} />;
      case "signature":
        return <SignatureTab domain={domain} offers={offers} />;
      default:
        return <DnsConfigTab domain={domain} />;
    }
  };

  return (
    <div className="security-tab">
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
      <div className="security-content">
        {renderSubTabContent()}
      </div>
    </div>
  );
}
