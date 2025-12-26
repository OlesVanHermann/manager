// ============================================================
// SQLSERVER GENERAL TAB - Composant STRICTEMENT isolé
// ============================================================

import { useTranslation } from "react-i18next";
import type { SqlserverLicense } from "../../sqlserver.types";
import "./GeneralTab.css";

interface GeneralTabProps {
  licenseId: string;
  license: SqlserverLicense | null;
  onRefresh: () => void;
}

export default function GeneralTab({ licenseId, license, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("license/sqlserver/general");
  const { t: tCommon } = useTranslation("common");

  if (!license) {
    return <div className="sqlserver-general-loading-state">{tCommon("loading")}</div>;
  }

  return (
    <div className="sqlserver-general-tab">
      <div className="sqlserver-general-toolbar">
        <h2>{t("title")}</h2>
        <button className="sqlserver-general-btn sqlserver-general-btn-outline" onClick={onRefresh}>
          {tCommon("actions.refresh")}
        </button>
      </div>
      <div className="sqlserver-general-info-card">
        <div className="sqlserver-general-info-grid">
          <div className="sqlserver-general-info-item">
            <span className="sqlserver-general-info-label">{t("fields.id")}</span>
            <span className="sqlserver-general-info-value mono">{license.id}</span>
          </div>
          <div className="sqlserver-general-info-item">
            <span className="sqlserver-general-info-label">{t("fields.ip")}</span>
            <span className="sqlserver-general-info-value mono">{license.ip}</span>
          </div>
          <div className="sqlserver-general-info-item">
            <span className="sqlserver-general-info-label">{t("fields.version")}</span>
            <span className="sqlserver-general-info-value">{license.version}</span>
          </div>
          <div className="sqlserver-general-info-item">
            <span className="sqlserver-general-info-label">{t("fields.created")}</span>
            <span className="sqlserver-general-info-value">{new Date(license.createdAt).toLocaleDateString("fr-FR")}</span>
          </div>
        </div>
      </div>
      <div className="sqlserver-general-info-card">
        <h3>{t("actions.title")}</h3>
        <div className="sqlserver-general-actions">
          <button className="sqlserver-general-btn sqlserver-general-btn-outline">{t("actions.changeIp")}</button>
          <button className="sqlserver-general-btn sqlserver-general-btn-outline sqlserver-general-btn-danger">{t("actions.terminate")}</button>
        </div>
      </div>
    </div>
  );
}
