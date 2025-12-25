// ============================================================
// CDN General Tab - Composant isolé
// ============================================================

import { useTranslation } from "react-i18next";
import type { CdnInfo } from "../../cdn.types";
import { generalService } from "./GeneralTab";
import "./GeneralTab.css";

interface GeneralTabProps {
  serviceId: string;
  cdn: CdnInfo | null;
  onRefresh: () => void;
}

export default function GeneralTab({ serviceId, cdn, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("network/cdn/index");
  const { t: tCommon } = useTranslation("common");

  if (!cdn) {
    return <div className="general-loading">{tCommon("loading")}</div>;
  }

  const handlePurgeCache = async () => {
    try {
      await generalService.purgeCache(cdn.serviceName);
      onRefresh();
    } catch (err) {
      console.error("Erreur purge cache:", err);
    }
  };

  const handleFlushAll = async () => {
    try {
      await generalService.flushAll(cdn.serviceName);
      onRefresh();
    } catch (err) {
      console.error("Erreur flush all:", err);
    }
  };

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
          <div className="general-card-title">{t("general.fields.serviceName")}</div>
          <div className="general-card-value mono">{cdn.serviceName}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.offer")}</div>
          <div className="general-card-value">{cdn.offer}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.anycast")}</div>
          <div className="general-card-value mono">{cdn.anycast}</div>
        </div>
      </div>

      <div className="general-info-card general-config-section">
        <h3>{t("general.config.title")}</h3>
        <p className="general-config-description">{t("general.config.description")}</p>
        <div className="general-actions">
          <button className="btn btn-outline" onClick={handlePurgeCache}>
            {t("general.config.purgeCache")}
          </button>
          <button className="btn btn-outline" onClick={handleFlushAll}>
            {t("general.config.flushAll")}
          </button>
        </div>
      </div>
    </div>
  );
}
