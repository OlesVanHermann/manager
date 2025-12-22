// ============================================================
// HÉBERGEMENT INDEX - Router Web Cloud Hébergement
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HostingPage } from "./hosting";
import { PrivateDatabasePage } from "./private-database";

type Section = "hosting" | "private-database";

/** Page principale Hébergement avec sous-navigation. */
export function HebergementPage() {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [activeSection, setActiveSection] = useState<Section>("hosting");

  return (
    <div className="hebergement-page">
      {/* Sous-navigation */}
      <div className="section-nav">
        <button
          className={`section-nav-btn ${activeSection === "hosting" ? "active" : ""}`}
          onClick={() => setActiveSection("hosting")}
        >
          <span className="nav-icon">🌐</span>
          <span className="nav-label">Hébergements Web</span>
        </button>
        <button
          className={`section-nav-btn ${activeSection === "private-database" ? "active" : ""}`}
          onClick={() => setActiveSection("private-database")}
        >
          <span className="nav-icon">🗄️</span>
          <span className="nav-label">Web Cloud Databases</span>
        </button>
      </div>

      {/* Contenu de la section */}
      <div className="section-content">
        {activeSection === "hosting" && <HostingPage />}
        {activeSection === "private-database" && <PrivateDatabasePage />}
      </div>
    </div>
  );
}

export default HebergementPage;
