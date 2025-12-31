// ============================================================
// ARC TAB - Informational page about ARC support
// Groupe: DNS
// ============================================================

import "./ArcTab.css";
import React from "react";
import { useTranslation } from "react-i18next";

interface ArcTabProps {
  zoneName: string;
}

export const ArcTab: React.FC<ArcTabProps> = ({ zoneName }) => {
  const { t } = useTranslation("web-cloud/domains/arc");

  return (
    <div className="arc-container">
      <div className="arc-header">
        <h3>{t("title")}</h3>
        <p className="arc-description">{t("description")}</p>
      </div>

      <div className="arc-info-box">
        <div className="arc-info-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </div>
        <div className="arc-info-content">
          <h4>{t("info.title")}</h4>
          <p>{t("info.description")}</p>
        </div>
      </div>

      <div className="arc-section">
        <h4>{t("section.whatIsArc")}</h4>
        <p>{t("section.arcExplanation")}</p>
      </div>

      <div className="arc-section">
        <h4>{t("section.ovhSupport")}</h4>
        <div className="arc-support-list">
          <div className="arc-support-item success">
            <span className="arc-check">✓</span>
            <span>{t("support.mxplan")}</span>
          </div>
          <div className="arc-support-item success">
            <span className="arc-check">✓</span>
            <span>{t("support.emailPro")}</span>
          </div>
          <div className="arc-support-item success">
            <span className="arc-check">✓</span>
            <span>{t("support.exchange")}</span>
          </div>
        </div>
      </div>

      <div className="arc-note">
        <strong>{t("note.title")}</strong>
        <p>{t("note.content")}</p>
      </div>
    </div>
  );
};

export default ArcTab;
