// ============================================================
// GENERAL TAB - Informations licence Windows
// ============================================================

import { useTranslation } from "react-i18next";

// ============================================================
// TYPES
// ============================================================

interface WindowsLicense {
  id: string;
  ip: string;
  version: string;
  sqlVersion?: string;
  status: string;
  createdAt: string;
}

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
    <div className="general-tab">
      <div className="tab-toolbar">
        <h2>{t("windows.general.title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button>
      </div>

      <div className="license-info-card">
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">{t("windows.general.fields.id")}</span>
            <span className="info-value mono">{license.id}</span>
          </div>

          <div className="info-item">
            <span className="info-label">{t("windows.general.fields.ip")}</span>
            <span className="info-value mono">{license.ip}</span>
          </div>

          <div className="info-item">
            <span className="info-label">{t("windows.general.fields.version")}</span>
            <span className="info-value">{license.version}</span>
          </div>

          {license.sqlVersion && (
            <div className="info-item">
              <span className="info-label">{t("windows.general.fields.sqlVersion")}</span>
              <span className="info-value">{license.sqlVersion}</span>
            </div>
          )}

          <div className="info-item">
            <span className="info-label">{t("windows.general.fields.created")}</span>
            <span className="info-value">{new Date(license.createdAt).toLocaleDateString("fr-FR")}</span>
          </div>
        </div>
      </div>

      <div className="license-info-card">
        <h3>{t("windows.general.actions.title")}</h3>
        <div className="license-actions" style={{ marginTop: "var(--space-3)" }}>
          <button className="btn btn-outline">{t("windows.general.actions.changeIp")}</button>
          <button className="btn btn-outline">{t("windows.general.actions.upgrade")}</button>
          <button className="btn btn-outline btn-danger">{t("windows.general.actions.terminate")}</button>
        </div>
      </div>
    </div>
  );
}
