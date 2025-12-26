/**
 * CDN General Tab - Composant principal
 * NAV1: network | NAV2: cdn | NAV3: general
 * ISOLATION: Ce composant n'importe RIEN d'autres tabs
 */
import { useTranslation } from "react-i18next";
import type { CdnInfo } from "../../cdn.types";
import { cdnGeneralService } from "./GeneralTab.service";
import "./GeneralTab.css";

interface GeneralTabProps {
  serviceName: string;
  cdn: CdnInfo | null;
  loading: boolean;
  error: string | null;
}

export function GeneralTab({ serviceName, cdn, loading, error }: GeneralTabProps) {
  const { t } = useTranslation("network/cdn/general");

  if (loading) {
    return <div className="cdn-general-loading">{t("loading")}</div>;
  }

  if (error) {
    return <div className="cdn-general-error">{error}</div>;
  }

  if (!cdn) {
    return <div className="cdn-general-error">{t("notFound")}</div>;
  }

  return (
    <div className="cdn-general-container">
      <div className="cdn-general-info-grid">
        <div className="cdn-general-info-card">
          <div className="cdn-general-card-title">{t("serviceName")}</div>
          <div className="cdn-general-card-value-mono">{cdn.serviceName}</div>
        </div>

        <div className="cdn-general-info-card">
          <div className="cdn-general-card-title">{t("anycast")}</div>
          <div className="cdn-general-card-value-mono">{cdn.anycast}</div>
        </div>

        <div className="cdn-general-info-card">
          <div className="cdn-general-card-title">{t("offer")}</div>
          <div className="cdn-general-card-value">{cdn.offer || "-"}</div>
        </div>

        <div className="cdn-general-info-card">
          <div className="cdn-general-card-title">{t("status")}</div>
          <div className="cdn-general-card-value">{cdn.status}</div>
        </div>
      </div>

      <div className="cdn-general-section">
        <h3 className="cdn-general-section-title">{t("configuration")}</h3>
        <div className="cdn-general-config-list">
          <div className="cdn-general-config-item">
            <div>
              <div className="cdn-general-config-label">{t("cacheRule")}</div>
              <div className="cdn-general-config-description">{t("cacheRuleDesc")}</div>
            </div>
            <div className="cdn-general-config-value">{cdn.cacheRuleEnabled ? t("enabled") : t("disabled")}</div>
          </div>
        </div>
      </div>

      <div className="cdn-general-actions">
        <button className="btn btn-primary" onClick={() => cdnGeneralService.refreshCdn(serviceName)}>
          {t("refresh")}
        </button>
        <button className="btn btn-outline" onClick={() => cdnGeneralService.flushCache(serviceName)}>
          {t("flushCache")}
        </button>
      </div>
    </div>
  );
}

export default GeneralTab;
