// ============================================================
// PUBLIC-CLOUD / DATABASES / GENERAL - Composant ISOLÉ
// ============================================================

import { useTranslation } from "react-i18next";
import type { Database } from "../databases.types";
import "./GeneralTab.css";

interface GeneralTabProps {
  projectId: string;
  engine: string;
  serviceId: string;
  database: Database | null;
  onRefresh: () => void;
}

export default function GeneralTab({ projectId, engine, serviceId, database, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("public-cloud/databases/index");
  const { t: tCommon } = useTranslation("common");

  if (!database) {
    return <div className="general-loading">{tCommon("loading")}</div>;
  }

  return (
    <div className="general-tab">
      <div className="general-toolbar">
        <h2>{t("general.title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      <div className="general-info-grid">
        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.engine")}</div>
          <div className="general-card-value">{database.engine}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.version")}</div>
          <div className="general-card-value">{database.version}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.plan")}</div>
          <div className="general-card-value">{database.plan}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.region")}</div>
          <div className="general-card-value">{database.region}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.nodes")}</div>
          <div className="general-card-value">{database.nodeNumber}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.flavor")}</div>
          <div className="general-card-value">{database.flavor}</div>
        </div>
      </div>

      <div className="general-actions-card">
        <h3>{t("general.actions.title")}</h3>
        <div className="general-actions">
          <button className="btn btn-outline">{t("general.actions.upgrade")}</button>
          <button className="btn btn-outline">{t("general.actions.resize")}</button>
          <button className="btn btn-outline btn-danger">{t("general.actions.delete")}</button>
        </div>
      </div>
    </div>
  );
}
