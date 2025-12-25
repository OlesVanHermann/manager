// ============================================================
// SQLSERVER GENERAL TAB - Composant isolé
// ============================================================

import { useTranslation } from "react-i18next";
import type { SqlServerLicense } from "../sqlserver.types";
import "./GeneralTab.css";

// ============================================================
// TYPES
// ============================================================

interface GeneralTabProps {
  licenseId: string;
  license: SqlServerLicense | null;
  onRefresh: () => void;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Affiche les informations générales de la licence SQL Server. */
export default function GeneralTab({ licenseId, license, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("license/index");
  const { t: tCommon } = useTranslation("common");

  if (!license) {
    return <div className="loading-state">{tCommon("loading")}</div>;
  }

  return (
    <div className="sqlserver-general-tab">
      <div className="sqlserver-general-toolbar">
        <h2>{t("sqlserver.general.title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>
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
            <span className="sqlserver-general-info-value">
              {new Date(license.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>
      </div>

      <div className="sqlserver-general-info-card">
        <h3>{t("actions.title")}</h3>
        <div className="sqlserver-general-actions">
          <button className="btn btn-outline">{t("actions.changeIp")}</button>
          <button className="btn btn-outline btn-danger">{t("actions.terminate")}</button>
        </div>
      </div>
    </div>
  );
}
