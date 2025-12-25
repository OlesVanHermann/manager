// ############################################################
// #  HOUSING/GENERAL - COMPOSANT STRICTEMENT ISOLÉ           #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./GeneralTab.css                            #
// #  SERVICE LOCAL : ./GeneralTab.ts                         #
// ############################################################

import { useTranslation } from "react-i18next";
import type { HousingInfo } from "../../housing.types";
import "./GeneralTab.css";

// ============================================================
// Types LOCAUX à ce composant
// ============================================================
interface GeneralTabProps {
  serviceId: string;
  housing: HousingInfo | null;
  onRefresh: () => void;
}

// ============================================================
// Composant Principal
// ============================================================
export default function GeneralTab({ serviceId, housing, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("bare-metal/housing/index");
  const { t: tCommon } = useTranslation("common");

  // État de chargement
  if (!housing) {
    return <div className="housing-general-loading">{tCommon("loading")}</div>;
  }

  return (
    <div className="housing-general-tab">
      {/* Barre d'outils */}
      <div className="housing-general-toolbar">
        <h2>{t("general.title")}</h2>
        <button className="btn btn-outline" onClick={onRefresh}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      {/* Grille d'informations */}
      <div className="housing-general-info-grid">
        <div className="housing-general-info-card">
          <div className="housing-general-card-title">{t("general.fields.name")}</div>
          <div className="housing-general-card-value">{housing.name}</div>
        </div>
        <div className="housing-general-info-card">
          <div className="housing-general-card-title">{t("general.fields.datacenter")}</div>
          <div className="housing-general-card-value">{housing.datacenter}</div>
        </div>
        <div className="housing-general-info-card">
          <div className="housing-general-card-title">{t("general.fields.rack")}</div>
          <div className="housing-general-card-value">{housing.rack}</div>
        </div>
        <div className="housing-general-info-card">
          <div className="housing-general-card-title">{t("general.fields.bandwidth")}</div>
          <div className="housing-general-card-value">{housing.networkBandwidth} Mbps</div>
        </div>
      </div>

      {/* Section informations */}
      <div className="housing-general-section">
        <h3>{t("general.info.title")}</h3>
        <p>{t("general.info.description")}</p>
      </div>
    </div>
  );
}
