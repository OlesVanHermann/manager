// ============================================================
// DIRECTADMIN GENERAL TAB - Composant isolé
// ============================================================

import { useTranslation } from "react-i18next";
import type { DirectAdminLicense } from "../../directadmin.types";
import "./GeneralTab.css";

interface GeneralTabProps {
  licenseId: string;
  license: DirectAdminLicense | null;
  onRefresh: () => void;
}

export default function GeneralTab({ licenseId, license, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("license/directadmin/general");
  const { t: tCommon } = useTranslation("common");

  if (!license) {
    return <div className="directadmin-general-loading-state">{tCommon("loading")}</div>;
  }

  return (
    <div className="directadmin-general-tab">
      <div className="directadmin-general-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button>
      </div>
      <div className="directadmin-general-info-card">
        <div className="directadmin-general-info-grid">
          <div className="directadmin-general-info-item">
            <span className="directadmin-general-info-label">{t("fields.id")}</span>
            <span className="directadmin-general-info-value mono">{license.id}</span>
          </div>
          <div className="directadmin-general-info-item">
            <span className="directadmin-general-info-label">{t("fields.ip")}</span>
            <span className="directadmin-general-info-value mono">{license.ip}</span>
          </div>
          <div className="directadmin-general-info-item">
            <span className="directadmin-general-info-label">{t("fields.version")}</span>
            <span className="directadmin-general-info-value">{license.version}</span>
          </div>
          <div className="directadmin-general-info-item">
            <span className="directadmin-general-info-label">{t("fields.os")}</span>
            <span className="directadmin-general-info-value">{license.os}</span>
          </div>
          <div className="directadmin-general-info-item">
            <span className="directadmin-general-info-label">{t("fields.created")}</span>
            <span className="directadmin-general-info-value">{new Date(license.createdAt).toLocaleDateString("fr-FR")}</span>
          </div>
        </div>
      </div>
      <div className="directadmin-general-info-card">
        <h3>{t("actions.title")}</h3>
        <div className="directadmin-general-actions">
          <button className="btn btn-outline">{t("actions.changeIp")}</button>
          <button className="btn btn-outline btn-danger">{t("actions.terminate")}</button>
        </div>
      </div>
    </div>
  );
}
