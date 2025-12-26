// ============================================================
// GENERAL TAB - Composant isolé pour Nutanix
// ============================================================

import { useTranslation } from "react-i18next";
import type { NutanixCluster } from "../../nutanix.types";
import "./GeneralTab.css";

// ========================================
// TYPES LOCAUX
// ========================================

interface GeneralTabProps {
  serviceId: string;
  cluster: NutanixCluster | null;
  onRefresh: () => void;
}

// ========================================
// COMPOSANT
// ========================================

export default function GeneralTab({ serviceId, cluster, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("private-cloud/nutanix/general");
  const { t: tCommon } = useTranslation("common");

  if (!cluster) {
    return <div className="general-loading">{tCommon("loading")}</div>;
  }

  return (
    <div className="general-tab">
      <div className="general-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      <div className="general-info-grid">
        <div className="general-info-card">
          <div className="general-card-title">{t("fields.serviceName")}</div>
          <div className="general-card-value mono">{cluster.serviceName}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("fields.name")}</div>
          <div className="general-card-value">{cluster.targetSpec?.name || "-"}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("fields.status")}</div>
          <div className="general-card-value">{cluster.status}</div>
        </div>
      </div>

      {cluster.targetSpec?.controlPanelURL && (
        <div className="general-access-card">
          <h3>{t("access.title")}</h3>
          <p>{t("access.description")}</p>
          <a
            href={cluster.targetSpec.controlPanelURL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            {t("access.prism")}
          </a>
        </div>
      )}
    </div>
  );
}
