// ============================================================
// SECURITY Overview Tab - Composant STRICTEMENT isolé
// Préfixe CSS: .security-overview-
// ============================================================

import { useTranslation } from "react-i18next";
import type { SecurityIpInfo } from "../../security.types";
import { securityOverviewService } from "./OverviewTab.service";
import "./OverviewTab.css";

interface OverviewTabProps {
  ipBlock: string;
  ip: SecurityIpInfo | null;
  onRefresh: () => void;
}

export default function OverviewTab({ ipBlock, ip, onRefresh }: OverviewTabProps) {
  const { t } = useTranslation("network/security/overview");
  const { t: tCommon } = useTranslation("common");

  if (!ip) {
    return <div className="security-overview-loading">{tCommon("loading")}</div>;
  }

  return (
    <div className="security-overview-tab">
      <div className="security-overview-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      <div className="security-overview-info-grid">
        <div className="security-overview-info-card">
          <div className="security-overview-card-title">{t("fields.ip")}</div>
          <div className="security-overview-card-value mono">{ip.ip}</div>
        </div>
        <div className="security-overview-info-card">
          <div className="security-overview-card-title">{t("fields.type")}</div>
          <div className="security-overview-card-value">{ip.type}</div>
        </div>
        <div className="security-overview-info-card">
          <div className="security-overview-card-title">{t("fields.state")}</div>
          <div className="security-overview-card-value">{ip.state}</div>
        </div>
        <div className="security-overview-info-card">
          <div className="security-overview-card-title">{t("fields.routedTo")}</div>
          <div className="security-overview-card-value">
            {ip.routedTo?.serviceName || "-"}
          </div>
        </div>
      </div>

      <div className="security-overview-stats-card">
        <h3>{t("protection.title")}</h3>
        <div className="security-overview-stats-grid">
          <div className="security-overview-stat-item">
            <div className="security-overview-stat-value">🟢</div>
            <div className="security-overview-stat-label">{t("protection.status")}</div>
          </div>
          <div className="security-overview-stat-item">
            <div className="security-overview-stat-value">
              {t(`mitigation.${ip.mitigation}`)}
            </div>
            <div className="security-overview-stat-label">{t("protection.mode")}</div>
          </div>
        </div>
      </div>

      <div className="security-overview-info-card">
        <h3>{t("actions.title")}</h3>
        <div className="security-overview-actions">
          <button className="btn btn-outline">
            {t("actions.changeMitigation")}
          </button>
          <button className="btn btn-outline">
            {t("actions.enableFirewall")}
          </button>
        </div>
      </div>
    </div>
  );
}
