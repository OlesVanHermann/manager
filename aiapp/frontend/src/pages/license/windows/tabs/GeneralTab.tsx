// ============================================================
// WINDOWS GENERAL TAB - Composant isolé
// ============================================================

import { useTranslation } from "react-i18next";
import type { WindowsLicense } from "../windows.types";
import "./GeneralTab.css";

// ============================================================
// TYPES
// ============================================================

interface GeneralTabProps {
  licenseId: string;
  license: WindowsLicense | null;
  onRefresh: () => void;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Affiche les informations générales de la licence Windows. */
export default function GeneralTab({ licenseId, license, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("license/index");
  const { t: tCommon } = useTranslation("common");

  if (!license) {
    return <div className="loading-state">{tCommon("loading")}</div>;
  }

  return (
    <div className="windows-general-tab">
      <div className="windows-general-toolbar">
        <h2>{t("windows.general.title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      <div className="windows-general-info-card">
        <div className="windows-general-info-grid">
          <div className="windows-general-info-item">
            <span className="windows-general-info-label">{t("windows.general.fields.id")}</span>
            <span className="windows-general-info-value mono">{license.id}</span>
          </div>
          <div className="windows-general-info-item">
            <span className="windows-general-info-label">{t("windows.general.fields.ip")}</span>
            <span className="windows-general-info-value mono">{license.ip}</span>
          </div>
          <div className="windows-general-info-item">
            <span className="windows-general-info-label">{t("windows.general.fields.version")}</span>
            <span className="windows-general-info-value">{license.version}</span>
          </div>
          {license.sqlVersion && (
            <div className="windows-general-info-item">
              <span className="windows-general-info-label">{t("windows.general.fields.sqlVersion")}</span>
              <span className="windows-general-info-value">{license.sqlVersion}</span>
            </div>
          )}
          <div className="windows-general-info-item">
            <span className="windows-general-info-label">{t("windows.general.fields.created")}</span>
            <span className="windows-general-info-value">
              {new Date(license.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>
      </div>

      <div className="windows-general-info-card">
        <h3>{t("windows.general.actions.title")}</h3>
        <div className="windows-general-actions">
          <button className="btn btn-outline">{t("windows.general.actions.changeIp")}</button>
          <button className="btn btn-outline">{t("windows.general.actions.upgrade")}</button>
          <button className="btn btn-outline btn-danger">{t("windows.general.actions.terminate")}</button>
        </div>
      </div>
    </div>
  );
}
