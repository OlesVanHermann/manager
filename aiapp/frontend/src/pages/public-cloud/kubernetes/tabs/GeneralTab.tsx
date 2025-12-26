// ============================================================
// PUBLIC-CLOUD / KUBERNETES / GENERAL - Composant ISOLÉ
// ============================================================

import { useTranslation } from "react-i18next";
import type { Cluster } from "../kubernetes.types";
import "./GeneralTab.css";

interface GeneralTabProps {
  projectId: string;
  clusterId: string;
  cluster: Cluster | null;
  onRefresh: () => void;
}

export default function GeneralTab({ projectId, clusterId, cluster, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("public-cloud/kubernetes/general");
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
          <div className="general-card-title">{t("fields.id")}</div>
          <div className="general-card-value general-mono">{cluster.id}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("fields.name")}</div>
          <div className="general-card-value">{cluster.name}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("fields.region")}</div>
          <div className="general-card-value">{cluster.region}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("fields.version")}</div>
          <div className="general-card-value">{cluster.version}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("fields.nodes")}</div>
          <div className="general-card-value">{cluster.nodesCount}</div>
        </div>
      </div>

      {cluster.url && (
        <div className="general-info-card" style={{ marginTop: "var(--space-4)" }}>
          <div className="general-card-title">{t("fields.apiServer")}</div>
          <div className="general-card-value general-mono">{cluster.url}</div>
        </div>
      )}

      <div className="general-actions-card">
        <h3>{t("actions.title")}</h3>
        <div className="general-actions">
          <button className="btn btn-outline">{t("actions.upgrade")}</button>
          <button className="btn btn-outline">{t("actions.restart")}</button>
          <button className="btn btn-outline btn-danger">{t("actions.delete")}</button>
        </div>
      </div>
    </div>
  );
}
