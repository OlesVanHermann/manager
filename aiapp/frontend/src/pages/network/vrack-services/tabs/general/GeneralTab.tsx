/**
 * VRACK SERVICES General Tab - Composant STRICTEMENT isolé
 * NAV1: network | NAV2: vrack-services | NAV3: general
 * ISOLATION: Ce composant n'importe RIEN d'autres tabs
 */
import { useTranslation } from "react-i18next";
import type { VrackServicesInfo } from "../../vrack-services.types";
import { vrackservicesGeneralService } from "./GeneralTab.service";
import "./GeneralTab.css";

interface GeneralTabProps {
  serviceId: string;
  service: VrackServicesInfo | null;
  onRefresh: () => void;
}

export default function GeneralTab({
  serviceId,
  service,
  onRefresh,
}: GeneralTabProps) {
  const { t } = useTranslation("network/vrack-services/general");
  const { t: tCommon } = useTranslation("common");

  if (!service) {
    return <div className="vrackservices-general-loading">{tCommon("loading")}</div>;
  }

  return (
    <div className="vrackservices-general-tab">
      <div className="vrackservices-general-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      <div className="vrackservices-general-info-grid">
        <div className="vrackservices-general-info-card">
          <div className="vrackservices-general-card-title">{t("fields.id")}</div>
          <div className="vrackservices-general-card-value-mono">{service.id}</div>
        </div>
        <div className="vrackservices-general-info-card">
          <div className="vrackservices-general-card-title">{t("fields.name")}</div>
          <div className="vrackservices-general-card-value">
            {service.displayName || "-"}
          </div>
        </div>
        <div className="vrackservices-general-info-card">
          <div className="vrackservices-general-card-title">{t("fields.region")}</div>
          <div className="vrackservices-general-card-value">{service.region}</div>
        </div>
        <div className="vrackservices-general-info-card">
          <div className="vrackservices-general-card-title">{t("fields.created")}</div>
          <div className="vrackservices-general-card-value">
            {vrackservicesGeneralService.formatDate(service.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
