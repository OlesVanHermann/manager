// ============================================================
// CLOUD CONNECT General Tab - Composant STRICTEMENT isolé
// Préfixe CSS: .cloudconnect-general-
// ============================================================

import { useTranslation } from "react-i18next";
import type { CloudConnectInfo } from "../../cloud-connect.types";
import { cloudconnectGeneralService } from "./GeneralTab.service";
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
  const { t } = useTranslation("network/cloud-connect/general");
  const { t: tCommon } = useTranslation("common");

  if (!service) {
    return <div className="cloudconnect-general-loading">{tCommon("loading")}</div>;
  }

  return (
    <div className="cloudconnect-general-tab">
      <div className="cloudconnect-general-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      <div className="cloudconnect-general-info-grid">
        <div className="cloudconnect-general-info-card">
          <div className="cloudconnect-general-card-title">{t("fields.uuid")}</div>
          <div className="cloudconnect-general-card-value mono">{service.uuid}</div>
        </div>
        <div className="cloudconnect-general-info-card">
          <div className="cloudconnect-general-card-title">{t("fields.pop")}</div>
          <div className="cloudconnect-general-card-value">{service.pop}</div>
        </div>
        <div className="cloudconnect-general-info-card">
          <div className="cloudconnect-general-card-title">{t("fields.bandwidth")}</div>
          <div className="cloudconnect-general-card-value">
            {cloudconnectGeneralService.formatBandwidth(service.bandwidth)}
          </div>
        </div>
        <div className="cloudconnect-general-info-card">
          <div className="cloudconnect-general-card-title">{t("fields.portSpeed")}</div>
          <div className="cloudconnect-general-card-value">
            {cloudconnectGeneralService.formatBandwidth(service.portSpeed)}
          </div>
        </div>
      </div>

      <div className="cloudconnect-general-info-card cloudconnect-general-connection-section">
        <h3>{t("connection.title")}</h3>
        <div className="cloudconnect-general-connection-line">
          <div className="cloudconnect-general-endpoint">
            <div className="cloudconnect-general-endpoint-label">
              {t("connection.yourDC")}
            </div>
            <div className="cloudconnect-general-endpoint-value">Your datacenter</div>
          </div>
          <div className="cloudconnect-general-connector">⟷</div>
          <div className="cloudconnect-general-endpoint">
            <div className="cloudconnect-general-endpoint-label">
              {t("connection.pop")}
            </div>
            <div className="cloudconnect-general-endpoint-value">{service.pop}</div>
          </div>
          <div className="cloudconnect-general-connector">⟷</div>
          <div className="cloudconnect-general-endpoint">
            <div className="cloudconnect-general-endpoint-label">
              {t("connection.ovh")}
            </div>
            <div className="cloudconnect-general-endpoint-value">OVHcloud Network</div>
          </div>
        </div>
      </div>
    </div>
  );
}
