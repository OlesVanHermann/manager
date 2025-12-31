// ============================================================
// COMPOSANT - LeftPanel (Panel gauche avec toggle vue)
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ViewMode, EmailDomain, EmailLicense } from "../../types";
import { DomainView } from "./DomainView";
import { LicenseView } from "./LicenseView";
import "./LeftPanel.css";

interface LeftPanelProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  domains: EmailDomain[];
  licenses: EmailLicense[];
  selectedDomain: string | null;
  selectedLicense: string | null;
  onSelectDomain: (name: string) => void;
  onSelectLicense: (id: string) => void;
  loading: boolean;
}

/** Panel gauche avec toggle vue domaine/licence et liste des items. */
export function LeftPanel({
  viewMode,
  onViewModeChange,
  domains,
  licenses,
  selectedDomain,
  selectedLicense,
  onSelectDomain,
  onSelectLicense,
  loading,
}: LeftPanelProps) {
  const { t } = useTranslation("web-cloud/emails/index");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <aside className="emails-left-panel">
      {/* ---------- TOGGLE VUE ---------- */}
      <div className="view-toggle">
        <button
          className={`view-toggle-btn ${viewMode === "domain" ? "active" : ""}`}
          onClick={() => onViewModeChange("domain")}
        >
          <span className="view-toggle-icon">📧</span>
          {t("leftPanel.byDomain")}
        </button>
        <button
          className={`view-toggle-btn ${viewMode === "license" ? "active" : ""}`}
          onClick={() => onViewModeChange("license")}
        >
          <span className="view-toggle-icon">📦</span>
          {t("leftPanel.byLicense")}
        </button>
      </div>

      {/* ---------- RECHERCHE ---------- */}
      <div className="left-panel-search">
        <input
          type="text"
          className="search-input"
          placeholder={viewMode === "domain" ? t("leftPanel.searchDomain") : t("leftPanel.searchLicense")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* ---------- CONTENU ---------- */}
      <div className="left-panel-content">
        {loading ? (
          <div className="left-panel-loading">
            <div className="skeleton skeleton-item" />
            <div className="skeleton skeleton-item" />
            <div className="skeleton skeleton-item" />
          </div>
        ) : viewMode === "domain" ? (
          <DomainView
            domains={domains}
            selectedDomain={selectedDomain}
            onSelect={onSelectDomain}
            searchQuery={searchQuery}
          />
        ) : (
          <LicenseView
            licenses={licenses}
            selectedLicense={selectedLicense}
            onSelect={onSelectLicense}
            searchQuery={searchQuery}
          />
        )}
      </div>

      {/* ---------- ACTIONS ---------- */}
      <div className="left-panel-actions">
        {viewMode === "domain" ? (
          <button className="btn btn-outline btn-add">
            <span>+</span> {t("leftPanel.addDomain")}
          </button>
        ) : (
          <>
            <button className="btn btn-primary btn-add">
              <span>+</span> {t("leftPanel.orderPack")}
            </button>
            <button className="btn btn-outline btn-add">
              <span>+</span> {t("leftPanel.addLicense")}
            </button>
          </>
        )}
      </div>
    </aside>
  );
}

export { DomainView } from "./DomainView";
export { LicenseView } from "./LicenseView";
