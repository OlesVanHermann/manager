// ============================================================
// CDN General Tab - Composant STRICTEMENT isolé
// Préfixe CSS: .cdn-general-
// ============================================================

import { useTranslation } from "react-i18next";
import type { CdnInfo } from "../../cdn.types";
import { cdnGeneralService } from "./GeneralTab.service";
import "./GeneralTab.css";

interface GeneralTabProps {
  serviceId: string;
  cdn: CdnInfo | null;
  onRefresh: () => void;
}

export default function GeneralTab({ serviceId, cdn, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("network/cdn/general");
  const { t: tCommon } = useTranslation("common");

  if (!cdn) {
    return <div className="cdn-general-loading">{tCommon("loading")}</div>;
  }

  const handlePurgeCache = async () => {
    try {
      await cdnGeneralService.purgeCache(cdn.serviceName);
      onRefresh();
    } catch (err) {
      console.error("Erreur purge cache:", err);
    }
  };

  const handleFlushAll = async () => {
    try {
      await cdnGeneralService.flushAll(cdn.serviceName);
      onRefresh();
    } catch (err) {
      console.error("Erreur flush all:", err);
    }
  };

  return (
    <div className="cdn-general-tab">
      <div className="cdn-general-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      <div className="cdn-general-info-grid">
        <div className="cdn-general-info-card">
          <div className="cdn-general-card-title">{t("fields.serviceName")}</div>
          <div className="cdn-general-card-value mono">{cdn.serviceName}</div>
        </div>
        <div className="cdn-general-info-card">
          <div className="cdn-general-card-title">{t("fields.offer")}</div>
          <div className="cdn-general-card-value">{cdn.offer}</div>
        </div>
        <div className="cdn-general-info-card">
          <div className="cdn-general-card-title">{t("fields.anycast")}</div>
          <div className="cdn-general-card-value mono">{cdn.anycast}</div>
        </div>
      </div>

      <div className="cdn-general-info-card cdn-general-config-section">
        <h3>{t("config.title")}</h3>
        <p className="cdn-general-config-description">{t("config.description")}</p>
        <div className="cdn-general-actions">
          <button className="btn btn-outline" onClick={handlePurgeCache}>
            {t("config.purgeCache")}
          </button>
          <button className="btn btn-outline" onClick={handleFlushAll}>
            {t("config.flushAll")}
          </button>
        </div>
      </div>
    </div>
  );
}
