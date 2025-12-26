// ============================================================
// PLESK GENERAL TAB - Composant isolé
// ============================================================

import { useTranslation } from "react-i18next";
import type { PleskLicense } from "../../plesk.types";
import "./GeneralTab.css";

interface GeneralTabProps {
  licenseId: string;
  license: PleskLicense | null;
  onRefresh: () => void;
}

export default function GeneralTab({ licenseId, license, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("license/plesk/general");
  const { t: tCommon } = useTranslation("common");

  if (!license) {
    return <div className="plesk-general-loading-state">{tCommon("loading")}</div>;
  }

  return (
    <div className="plesk-general-tab">
      <div className="plesk-general-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button>
      </div>
      <div className="plesk-general-info-card">
        <div className="plesk-general-info-grid">
          <div className="plesk-general-info-item">
            <span className="plesk-general-info-label">{t("fields.id")}</span>
            <span className="plesk-general-info-value mono">{license.id}</span>
          </div>
          <div className="plesk-general-info-item">
            <span className="plesk-general-info-label">{t("fields.ip")}</span>
            <span className="plesk-general-info-value mono">{license.ip}</span>
          </div>
          <div className="plesk-general-info-item">
            <span className="plesk-general-info-label">{t("fields.version")}</span>
            <span className="plesk-general-info-value">{license.version}</span>
          </div>
          <div className="plesk-general-info-item">
            <span className="plesk-general-info-label">{t("fields.domains")}</span>
            <span className="plesk-general-info-value">{license.domainNumber}</span>
          </div>
          <div className="plesk-general-info-item">
            <span className="plesk-general-info-label">{t("fields.created")}</span>
            <span className="plesk-general-info-value">{new Date(license.createdAt).toLocaleDateString("fr-FR")}</span>
          </div>
        </div>
      </div>
      <div className="plesk-general-info-card">
        <h3>{t("actions.title")}</h3>
        <div className="plesk-general-actions">
          <button className="btn btn-outline">{t("actions.changeIp")}</button>
          <button className="btn btn-outline">{t("actions.changeDomains")}</button>
          <button className="btn btn-outline btn-danger">{t("actions.terminate")}</button>
        </div>
      </div>
    </div>
  );
}
