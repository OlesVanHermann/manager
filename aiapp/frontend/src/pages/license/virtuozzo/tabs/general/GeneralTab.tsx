// ============================================================
// VIRTUOZZO GENERAL TAB - Composant STRICTEMENT isolé
// ============================================================

import { useTranslation } from "react-i18next";
import type { VirtuozzoLicense } from "../../virtuozzo.types";
import "./GeneralTab.css";

interface GeneralTabProps {
  licenseId: string;
  license: VirtuozzoLicense | null;
  onRefresh: () => void;
}

export default function GeneralTab({ licenseId, license, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("license/virtuozzo/general");
  const { t: tCommon } = useTranslation("common");

  if (!license) {
    return <div className="virtuozzo-general-loading-state">{tCommon("loading")}</div>;
  }

  return (
    <div className="virtuozzo-general-tab">
      <div className="virtuozzo-general-toolbar">
        <h2>{t("title")}</h2>
        <button className="virtuozzo-general-btn virtuozzo-general-btn-outline" onClick={onRefresh}>
          {tCommon("actions.refresh")}
        </button>
      </div>
      <div className="virtuozzo-general-info-card">
        <div className="virtuozzo-general-info-grid">
          <div className="virtuozzo-general-info-item">
            <span className="virtuozzo-general-info-label">{t("fields.id")}</span>
            <span className="virtuozzo-general-info-value mono">{license.id}</span>
          </div>
          <div className="virtuozzo-general-info-item">
            <span className="virtuozzo-general-info-label">{t("fields.ip")}</span>
            <span className="virtuozzo-general-info-value mono">{license.ip}</span>
          </div>
          <div className="virtuozzo-general-info-item">
            <span className="virtuozzo-general-info-label">{t("fields.version")}</span>
            <span className="virtuozzo-general-info-value">{license.version}</span>
          </div>
          <div className="virtuozzo-general-info-item">
            <span className="virtuozzo-general-info-label">{t("fields.containerNumber")}</span>
            <span className="virtuozzo-general-info-value">{license.containerNumber}</span>
          </div>
          <div className="virtuozzo-general-info-item">
            <span className="virtuozzo-general-info-label">{t("fields.created")}</span>
            <span className="virtuozzo-general-info-value">{new Date(license.createdAt).toLocaleDateString("fr-FR")}</span>
          </div>
        </div>
      </div>
      <div className="virtuozzo-general-info-card">
        <h3>{t("actions.title")}</h3>
        <div className="virtuozzo-general-actions">
          <button className="virtuozzo-general-btn virtuozzo-general-btn-outline">{t("actions.changeIp")}</button>
          <button className="virtuozzo-general-btn virtuozzo-general-btn-outline virtuozzo-general-btn-danger">{t("actions.terminate")}</button>
        </div>
      </div>
    </div>
  );
}
