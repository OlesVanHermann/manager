// ############################################################
// #  NETAPP/GENERAL - COMPOSANT STRICTEMENT ISOLÉ            #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./GeneralTab.css                            #
// #  SERVICE LOCAL : ./GeneralTab.ts                         #
// #  I18N LOCAL : bare-metal/netapp/general                  #
// ############################################################

import { useTranslation } from "react-i18next";
import type { NetAppInfo } from "../../netapp.types";
import "./GeneralTab.css";

// ============================================================
// Types LOCAUX à ce composant
// ============================================================
interface GeneralTabProps {
  serviceId: string;
  netapp: NetAppInfo | null;
  onRefresh: () => void;
}

// ============================================================
// Helpers LOCAUX - Dupliqués volontairement (défactorisation)
// NE JAMAIS importer depuis un autre tab
// ============================================================
const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("fr-FR");
};

// ============================================================
// Composant Principal
// ============================================================
export default function GeneralTab({ serviceId, netapp, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("bare-metal/netapp/general");
  const { t: tCommon } = useTranslation("common");

  // État de chargement
  if (!netapp) {
    return <div className="netapp-general-loading">{tCommon("loading")}</div>;
  }

  return (
    <div className="netapp-general-tab">
      {/* Barre d'outils */}
      <div className="netapp-general-toolbar">
        <h2>{t("title")}</h2>
        <button className="netapp-general-btn netapp-general-btn-outline" onClick={onRefresh}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      {/* Grille d'informations */}
      <div className="netapp-general-info-grid">
        <div className="netapp-general-info-card">
          <div className="netapp-general-card-title">{t("fields.id")}</div>
          <div className="netapp-general-card-value netapp-general-mono">{netapp.id}</div>
        </div>
        <div className="netapp-general-info-card">
          <div className="netapp-general-card-title">{t("fields.name")}</div>
          <div className="netapp-general-card-value">{netapp.name}</div>
        </div>
        <div className="netapp-general-info-card">
          <div className="netapp-general-card-title">{t("fields.region")}</div>
          <div className="netapp-general-card-value">{netapp.region}</div>
        </div>
        <div className="netapp-general-info-card">
          <div className="netapp-general-card-title">{t("fields.performance")}</div>
          <div className="netapp-general-card-value">{netapp.performanceLevel}</div>
        </div>
        <div className="netapp-general-info-card">
          <div className="netapp-general-card-title">{t("fields.created")}</div>
          <div className="netapp-general-card-value">{formatDate(netapp.createdAt)}</div>
        </div>
      </div>
    </div>
  );
}
