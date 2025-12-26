// ============================================================
// VRACK SERVICES General Tab - Composant isolé
// ============================================================

import { useTranslation } from "react-i18next";
import type { VrackServicesInfo } from "../../vrack-services.types";
import { generalService } from "./GeneralTab.service";
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
          <div className="general-card-value mono">{service.id}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("fields.name")}</div>
          <div className="general-card-value">
            {service.displayName || "-"}
          </div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("fields.region")}</div>
          <div className="general-card-value">{service.region}</div>
        </div>
        <div className="general-info-card">
          <div className="general-card-title">{t("fields.created")}</div>
          <div className="general-card-value">
            {generalService.formatDate(service.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
