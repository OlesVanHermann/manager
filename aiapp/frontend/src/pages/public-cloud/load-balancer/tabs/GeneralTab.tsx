// ============================================================
// PUBLIC-CLOUD / LOAD-BALANCER / GENERAL - Composant ISOLÉ
// ============================================================

import { useTranslation } from "react-i18next";
import type { LoadBalancer } from "../load-balancer.types";
import "./GeneralTab.css";

interface GeneralTabProps {
  projectId: string;
  lbId: string;
  lb: LoadBalancer | null;
  onRefresh: () => void;
}

export default function GeneralTab({ projectId, lbId, lb, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("public-cloud/load-balancer/index");
  const { t: tCommon } = useTranslation("common");

  if (!lb) {
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
          <div className="general-card-title">{t("general.fields.id")}</div>
          <div className="general-card-value general-mono">{lb.id}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.name")}</div>
          <div className="general-card-value">{lb.name}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.region")}</div>
          <div className="general-card-value">{lb.region}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.flavor")}</div>
          <div className="general-card-value">{lb.flavor}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.vip")}</div>
          <div className="general-card-value general-mono">{lb.vipAddress}</div>
        </div>
      </div>

      <div className="general-actions-card">
        <h3>{t("general.actions.title")}</h3>
        <div className="general-actions">
          <button className="btn btn-outline">{t("general.actions.resize")}</button>
          <button className="btn btn-outline btn-danger">{t("general.actions.delete")}</button>
        </div>
      </div>
    </div>
  );
}
