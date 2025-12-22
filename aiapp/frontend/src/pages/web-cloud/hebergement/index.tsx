// ============================================================
// HÉBERGEMENT INDEX - Router Web Cloud Hébergement
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HostingPage } from "./hosting";
import { PrivateDatabasePage } from "./private-database";
import { ManagedWordPressPage } from "./managed-wordpress";

type Section = "hosting" | "private-database" | "managed-wordpress";

const SECTIONS = [
  { id: "hosting", labelKey: "sections.hosting", icon: "🌐" },
  { id: "private-database", labelKey: "sections.privateDatabase", icon: "🗄️" },
  { id: "managed-wordpress", labelKey: "sections.managedWordpress", icon: "📝" },
];

/** Page principale Hébergement avec sous-navigation. */
export function HebergementPage() {
  const { t } = useTranslation("web-cloud/hebergement/index");
  const [activeSection, setActiveSection] = useState<Section>("hosting");

  const renderContent = () => {
    switch (activeSection) {
      case "hosting": return <HostingPage />;
      case "private-database": return <PrivateDatabasePage />;
      case "managed-wordpress": return <ManagedWordPressPage />;
      default: return <HostingPage />;
    }
  };

  return (
    <div className="hebergement-page">
      {/* Sous-navigation */}
      <div className="section-nav">
        {SECTIONS.map(section => (
          <button
            key={section.id}
            className={`section-nav-btn ${activeSection === section.id ? "active" : ""}`}
            onClick={() => setActiveSection(section.id as Section)}
          >
            <span className="nav-icon">{section.icon}</span>
            <span className="nav-label">{t(section.labelKey)}</span>
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div className="section-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default HebergementPage;
