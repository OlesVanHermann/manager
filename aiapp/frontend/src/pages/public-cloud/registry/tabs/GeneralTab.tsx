// ============================================================
// PUBLIC-CLOUD / REGISTRY / GENERAL - Composant ISOLÉ
// ============================================================

import { useTranslation } from "react-i18next";
import { formatSize, formatDate } from "./GeneralTab.service";
import type { Registry } from "../registry.types";
import "./GeneralTab.css";

interface GeneralTabProps {
  projectId: string;
  registryId: string;
  registry: Registry | null;
  onRefresh: () => void;
}

export default function GeneralTab({ projectId, registryId, registry, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("public-cloud/registry/index");
  const { t: tCommon } = useTranslation("common");

  if (!registry) {
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
          <div className="general-card-title">{t("general.fields.name")}</div>
          <div className="general-card-value">{registry.name}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.region")}</div>
          <div className="general-card-value">{registry.region}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.size")}</div>
          <div className="general-card-value">{formatSize(registry.size)}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.created")}</div>
          <div className="general-card-value">{formatDate(registry.createdAt)}</div>
        </div>
      </div>

      <div className="general-info-card" style={{ marginTop: "var(--space-4)" }}>
        <div className="general-card-title">{t("general.fields.url")}</div>
        <div className="general-card-value general-mono">{registry.url}</div>
      </div>

      <div className="general-docker-card">
        <h3>{t("general.docker.title")}</h3>
        <p className="general-docker-description">{t("general.docker.description")}</p>
        <div className="general-command-box">docker login {registry.url}</div>
      </div>
    </div>
  );
}
