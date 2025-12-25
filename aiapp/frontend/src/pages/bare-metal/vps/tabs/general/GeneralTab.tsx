// ############################################################
// #  VPS/GENERAL - COMPOSANT STRICTEMENT ISOLÉ               #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./GeneralTab.css                            #
// #  SERVICE LOCAL : ./GeneralTab.ts                         #
// #  I18N LOCAL : bare-metal/vps/general                     #
// ############################################################

import { useTranslation } from "react-i18next";
import type { Vps, VpsServiceInfos } from "../../vps.types";
import "./GeneralTab.css";

// ============================================================
// Types LOCAUX à ce composant
// ============================================================
interface Props {
  serviceName: string;
  details?: Vps;
  serviceInfos?: VpsServiceInfos;
  loading: boolean;
}

// ============================================================
// Helpers LOCAUX - Dupliqués volontairement (défactorisation)
// NE JAMAIS importer depuis un autre tab
// ============================================================
const isExpiringSoon = (exp: string): boolean => {
  return (new Date(exp).getTime() - Date.now()) / (1000 * 60 * 60 * 24) < 30;
};

const getStateClass = (state: string): string => {
  const map: Record<string, string> = {
    running: "vps-general-success",
    stopped: "vps-general-error",
    rebooting: "vps-general-warning",
    rescued: "vps-general-info",
  };
  return map[state] || "vps-general-inactive";
};

const formatMemory = (mb: number): string => {
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} Go` : `${mb} Mo`;
};

const formatDisk = (gb: number): string => {
  return gb >= 1000 ? `${(gb / 1000).toFixed(1)} To` : `${gb} Go`;
};

// ============================================================
// Composant Principal
// ============================================================
export default function GeneralTab({ serviceName, details, serviceInfos, loading }: Props) {
  const { t } = useTranslation("bare-metal/vps/general");

  if (loading) {
    return (
      <div className="vps-general-tab">
        <div className="vps-general-loading">
          <div className="vps-general-skeleton" style={{ width: "60%" }} />
          <div className="vps-general-skeleton" style={{ width: "80%" }} />
          <div className="vps-general-skeleton" style={{ width: "40%" }} />
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="vps-general-tab">
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="vps-general-tab">
      {/* Section Informations générales */}
      <section className="vps-general-section">
        <h3>{t("title")}</h3>
        <div className="vps-general-info-grid">
          <div className="vps-general-info-item">
            <label>{t("name")}</label>
            <span className="vps-general-mono">{details.name}</span>
          </div>
          {details.displayName && (
            <div className="vps-general-info-item">
              <label>{t("displayName")}</label>
              <span>{details.displayName}</span>
            </div>
          )}
          <div className="vps-general-info-item">
            <label>{t("state")}</label>
            <span className={`vps-general-badge ${getStateClass(details.state)}`}>
              {details.state}
            </span>
          </div>
          <div className="vps-general-info-item">
            <label>{t("model")}</label>
            <span>{details.model}</span>
          </div>
          <div className="vps-general-info-item">
            <label>{t("vcore")}</label>
            <span>{details.vcore}</span>
          </div>
          <div className="vps-general-info-item">
            <label>{t("memory")}</label>
            <span>{formatMemory(details.memory)}</span>
          </div>
          <div className="vps-general-info-item">
            <label>{t("disk")}</label>
            <span>{formatDisk(details.disk)}</span>
          </div>
          <div className="vps-general-info-item">
            <label>{t("zone")}</label>
            <span>{details.zone}</span>
          </div>
          {details.cluster && (
            <div className="vps-general-info-item">
              <label>{t("cluster")}</label>
              <span>{details.cluster}</span>
            </div>
          )}
          <div className="vps-general-info-item">
            <label>{t("netboot")}</label>
            <span>{details.netbootMode}</span>
          </div>
          <div className="vps-general-info-item">
            <label>{t("monitoring")}</label>
            <span className={`vps-general-badge ${details.slaMonitoring ? "vps-general-success" : "vps-general-inactive"}`}>
              {details.slaMonitoring ? "Actif" : "Inactif"}
            </span>
          </div>
        </div>
      </section>

      {/* Section Service */}
      {serviceInfos && (
        <section className="vps-general-section">
          <h3>{t("service")}</h3>
          <div className="vps-general-info-grid">
            <div className="vps-general-info-item">
              <label>{t("creation")}</label>
              <span>{new Date(serviceInfos.creation).toLocaleDateString("fr-FR")}</span>
            </div>
            <div className="vps-general-info-item">
              <label>{t("expiration")}</label>
              <span className={isExpiringSoon(serviceInfos.expiration) ? "vps-general-expiring" : ""}>
                {new Date(serviceInfos.expiration).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <div className="vps-general-info-item">
              <label>{t("renew")}</label>
              <span className={`vps-general-badge ${serviceInfos.renew ? "vps-general-success" : "vps-general-warning"}`}>
                {serviceInfos.renew ? t("automatic") : t("manual")}
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
