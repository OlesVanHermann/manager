// ============================================================
// CPANEL GENERAL TAB - Composant isolé
// ============================================================

import { useTranslation } from "react-i18next";
import type { CpanelLicense } from "../../cpanel.types";
import "./GeneralTab.css";

interface GeneralTabProps {
  licenseId: string;
  license: CpanelLicense | null;
  onRefresh: () => void;
}

export default function GeneralTab({ licenseId, license, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("license/cpanel/general");
  const { t: tCommon } = useTranslation("common");

  if (!license) {
    return <div className="cpanel-general-loading-state">{tCommon("loading")}</div>;
  }

  return (
    <div className="cpanel-general-tab">
      <div className="cpanel-general-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button>
      </div>
      <div className="cpanel-general-info-card">
        <div className="cpanel-general-info-grid">
          <div className="cpanel-general-info-item">
            <span className="cpanel-general-info-label">{t("fields.id")}</span>
            <span className="cpanel-general-info-value mono">{license.id}</span>
          </div>
          <div className="cpanel-general-info-item">
            <span className="cpanel-general-info-label">{t("fields.ip")}</span>
            <span className="cpanel-general-info-value mono">{license.ip}</span>
          </div>
          <div className="cpanel-general-info-item">
            <span className="cpanel-general-info-label">{t("fields.version")}</span>
            <span className="cpanel-general-info-value">{license.version}</span>
          </div>
          <div className="cpanel-general-info-item">
            <span className="cpanel-general-info-label">{t("fields.created")}</span>
            <span className="cpanel-general-info-value">{new Date(license.createdAt).toLocaleDateString("fr-FR")}</span>
          </div>
        </div>
      </div>
      <div className="cpanel-general-info-card">
        <h3>{t("actions.title")}</h3>
        <div className="cpanel-general-actions">
          <button className="btn btn-outline">{t("actions.changeIp")}</button>
          <button className="btn btn-outline btn-danger">{t("actions.terminate")}</button>
        </div>
      </div>
    </div>
  );
}
