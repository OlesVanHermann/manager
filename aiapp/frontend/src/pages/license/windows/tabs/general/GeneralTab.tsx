// ============================================================
// WINDOWS GENERAL TAB - Composant STRICTEMENT isolé
// ============================================================

import { useTranslation } from "react-i18next";
import type { WindowsLicense } from "../../windows.types";
import "./GeneralTab.css";

interface GeneralTabProps {
  licenseId: string;
  license: WindowsLicense | null;
  onRefresh: () => void;
}

export default function GeneralTab({ licenseId, license, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("license/windows/general");
  const { t: tCommon } = useTranslation("common");

  if (!license) {
    return <div className="windows-general-loading-state">{tCommon("loading")}</div>;
  }

  return (
    <div className="windows-general-tab">
      <div className="windows-general-toolbar">
        <h2>{t("title")}</h2>
        <button className="windows-general-btn windows-general-btn-outline" onClick={onRefresh}>
          {tCommon("actions.refresh")}
        </button>
      </div>
      <div className="windows-general-info-card">
        <div className="windows-general-info-grid">
          <div className="windows-general-info-item">
            <span className="windows-general-info-label">{t("fields.id")}</span>
            <span className="windows-general-info-value mono">{license.id}</span>
          </div>
          <div className="windows-general-info-item">
            <span className="windows-general-info-label">{t("fields.ip")}</span>
            <span className="windows-general-info-value mono">{license.ip}</span>
          </div>
          <div className="windows-general-info-item">
            <span className="windows-general-info-label">{t("fields.version")}</span>
            <span className="windows-general-info-value">{license.version}</span>
          </div>
          <div className="windows-general-info-item">
            <span className="windows-general-info-label">{t("fields.sqlVersion")}</span>
            <span className="windows-general-info-value">{license.sqlVersion || "-"}</span>
          </div>
          <div className="windows-general-info-item">
            <span className="windows-general-info-label">{t("fields.created")}</span>
            <span className="windows-general-info-value">{new Date(license.createdAt).toLocaleDateString("fr-FR")}</span>
          </div>
        </div>
      </div>
      <div className="windows-general-info-card">
        <h3>{t("actions.title")}</h3>
        <div className="windows-general-actions">
          <button className="windows-general-btn windows-general-btn-outline">{t("actions.changeIp")}</button>
          <button className="windows-general-btn windows-general-btn-outline windows-general-btn-danger">{t("actions.terminate")}</button>
        </div>
      </div>
    </div>
  );
}
