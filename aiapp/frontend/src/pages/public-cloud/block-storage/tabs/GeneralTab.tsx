// ============================================================
// PUBLIC-CLOUD / BLOCK-STORAGE / GENERAL - Composant ISOLÉ
// ============================================================

import { useTranslation } from "react-i18next";
import { formatSize, getGeneralStatusClass } from "./GeneralTab.service";
import type { Volume } from "../block-storage.types";
import "./GeneralTab.css";

interface GeneralTabProps {
  projectId: string;
  volumeId: string;
  volume: Volume | null;
  onRefresh: () => void;
}

export default function GeneralTab({ projectId, volumeId, volume, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("public-cloud/block-storage/general");
  const { t: tCommon } = useTranslation("common");

  if (!volume) {
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
          <div className="general-card-value general-mono">{volume.id}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("fields.name")}</div>
          <div className="general-card-value">{volume.name}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("fields.region")}</div>
          <div className="general-card-value">{volume.region}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("fields.size")}</div>
          <div className="general-card-value">{formatSize(volume.size)}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("fields.type")}</div>
          <div className="general-card-value">{volume.type}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("fields.status")}</div>
          <div className="general-card-value">
            <span className={`general-status-badge ${getGeneralStatusClass(volume.status)}`}>
              {volume.status}
            </span>
          </div>
        </div>
      </div>

      <div className="general-actions-card">
        <h3>{t("actions.title")}</h3>
        <div className="general-actions">
          <button className="btn btn-outline">{t("actions.extend")}</button>
          <button className="btn btn-outline">{t("actions.snapshot")}</button>
          <button className="btn btn-outline btn-danger">{t("actions.delete")}</button>
        </div>
      </div>
    </div>
  );
}
