// ============================================================
// CLOUD CONNECT General Tab - Composant isolé
// ============================================================

import { useTranslation } from "react-i18next";
import type { CloudConnectInfo } from "../../cloud-connect.types";
import { generalService } from "./GeneralTab.service";
import "./GeneralTab.css";

interface GeneralTabProps {
  serviceId: string;
  service: CloudConnectInfo | null;
  onRefresh: () => void;
}

export default function GeneralTab({
  serviceId,
  service,
  onRefresh,
}: GeneralTabProps) {
  const { t } = useTranslation("network/cloud-connect/index");
  const { t: tCommon } = useTranslation("common");

  if (!service) {
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
          <div className="general-card-title">{t("general.fields.uuid")}</div>
          <div className="general-card-value mono">{service.uuid}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.pop")}</div>
          <div className="general-card-value">{service.pop}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.bandwidth")}</div>
          <div className="general-card-value">
            {generalService.formatBandwidth(service.bandwidth)}
          </div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("general.fields.portSpeed")}</div>
          <div className="general-card-value">
            {generalService.formatBandwidth(service.portSpeed)}
          </div>
        </div>
      </div>

      <div className="general-info-card general-connection-section">
        <h3>{t("general.connection.title")}</h3>
        <div className="general-connection-line">
          <div className="general-endpoint">
            <div className="general-endpoint-label">
              {t("general.connection.yourDC")}
            </div>
            <div className="general-endpoint-value">Your datacenter</div>
          </div>
          <div className="general-connector">⟷</div>
          <div className="general-endpoint">
            <div className="general-endpoint-label">
              {t("general.connection.pop")}
            </div>
            <div className="general-endpoint-value">{service.pop}</div>
          </div>
          <div className="general-connector">⟷</div>
          <div className="general-endpoint">
            <div className="general-endpoint-label">
              {t("general.connection.ovh")}
            </div>
            <div className="general-endpoint-value">OVHcloud Network</div>
          </div>
        </div>
      </div>
    </div>
  );
}
