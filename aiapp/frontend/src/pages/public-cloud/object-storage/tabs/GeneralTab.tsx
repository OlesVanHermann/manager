// ============================================================
// PUBLIC-CLOUD / OBJECT-STORAGE / GENERAL - Composant ISOLÉ
// ============================================================

import { useTranslation } from "react-i18next";
import { formatSize } from "./GeneralTab.service";
import type { Container } from "../object-storage.types";
import "./GeneralTab.css";

interface GeneralTabProps {
  projectId: string;
  region: string;
  containerId: string;
  container: Container | null;
  onRefresh: () => void;
}

export default function GeneralTab({ projectId, region, containerId, container, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("public-cloud/object-storage/general");
  const { t: tCommon } = useTranslation("common");

  if (!container) {
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
          <div className="general-card-title">{t("fields.name")}</div>
          <div className="general-card-value">{container.name}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("fields.region")}</div>
          <div className="general-card-value">{container.region}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("fields.type")}</div>
          <div className="general-card-value">{container.containerType}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("fields.objects")}</div>
          <div className="general-card-value">{container.storedObjects}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("fields.size")}</div>
          <div className="general-card-value">{formatSize(container.storedBytes)}</div>
        </div>
      </div>

      {container.staticUrl && (
        <div className="general-info-card" style={{ marginTop: "var(--space-4)" }}>
          <div className="general-card-title">{t("fields.publicUrl")}</div>
          <div className="general-card-value general-mono">{container.staticUrl}</div>
        </div>
      )}

      <div className="general-s3-card">
        <h3>{t("s3.title")}</h3>
        <p className="general-s3-description">{t("s3.description")}</p>
        <div className="general-info-grid" style={{ marginBottom: 0 }}>
          <div>
            <div className="general-card-title">{t("s3.endpoint")}</div>
            <div className="general-card-value general-mono">s3.{region}.cloud.ovh.net</div>
          </div>
          <div>
            <div className="general-card-title">{t("s3.bucket")}</div>
            <div className="general-card-value general-mono">{container.name}</div>
          </div>
        </div>
      </div>

      <div className="general-actions-card">
        <h3>{t("actions.title")}</h3>
        <div className="general-actions">
          <button className="btn btn-outline">
            {container.containerType === "public"
              ? t("actions.makePrivate")
              : t("actions.makePublic")}
          </button>
          <button className="btn btn-outline btn-danger">{t("actions.delete")}</button>
        </div>
      </div>
    </div>
  );
}
