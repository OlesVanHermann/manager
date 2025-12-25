// ============================================================
// VPS TAB ISOLÉ : GeneralTab
// ============================================================

import { useTranslation } from "react-i18next";
import type { Vps, VpsServiceInfos } from "../../vps.types";
import "./GeneralTab.css";

interface Props {
  serviceName: string;
  details?: Vps;
  serviceInfos?: VpsServiceInfos;
  loading: boolean;
}

function isExpiringSoon(exp: string): boolean {
  return (new Date(exp).getTime() - Date.now()) / (1000 * 60 * 60 * 24) < 30;
}

function getStateClass(state: string): string {
  const map: Record<string, string> = {
    running: "success",
    stopped: "error",
    rebooting: "warning",
    installing: "warning",
    upgrading: "warning",
    maintenance: "warning",
    rescued: "info",
  };
  return map[state] || "inactive";
}

export function GeneralTab({ serviceName, details, serviceInfos, loading }: Props) {
  const { t } = useTranslation("bare-metal/vps/index");

  if (loading) {
    return (
      <div className="general-tab">
        <div className="tab-loading">
          <div className="skeleton-block" />
          <div className="skeleton-block" />
        </div>
      </div>
    );
  }

  return (
    <div className="general-tab">
      <section className="general-info-section">
        <h3>{t("general.title")}</h3>
        <div className="general-info-grid">
          <div className="general-info-item">
            <label>{t("general.name")}</label>
            <span className="font-mono">{serviceName}</span>
          </div>
          {details && (
            <>
              <div className="general-info-item">
                <label>{t("general.displayName")}</label>
                <span>{details.displayName || serviceName}</span>
              </div>
              <div className="general-info-item">
                <label>{t("general.state")}</label>
                <span className={`badge ${getStateClass(details.state)}`}>{details.state}</span>
              </div>
              <div className="general-info-item">
                <label>{t("general.model")}</label>
                <span>{details.model?.name} ({details.model?.offer})</span>
              </div>
              <div className="general-info-item">
                <label>{t("general.vcore")}</label>
                <span>{details.vcore || details.model?.vcore} vCPU</span>
              </div>
              <div className="general-info-item">
                <label>{t("general.memory")}</label>
                <span>{details.memoryLimit || details.model?.memory} MB</span>
              </div>
              <div className="general-info-item">
                <label>{t("general.disk")}</label>
                <span>{details.model?.disk} GB</span>
              </div>
              <div className="general-info-item">
                <label>{t("general.zone")}</label>
                <span>{details.zone}</span>
              </div>
              <div className="general-info-item">
                <label>{t("general.cluster")}</label>
                <span>{details.cluster}</span>
              </div>
              <div className="general-info-item">
                <label>{t("general.netboot")}</label>
                <span className={`badge ${details.netbootMode === "rescue" ? "warning" : "success"}`}>
                  {details.netbootMode}
                </span>
              </div>
              <div className="general-info-item">
                <label>{t("general.monitoring")}</label>
                <span className={`badge ${details.slaMonitoring ? "success" : "inactive"}`}>
                  {details.slaMonitoring ? "✓" : "✗"}
                </span>
              </div>
            </>
          )}
        </div>
      </section>

      {serviceInfos && (
        <section className="general-info-section">
          <h3>{t("service.title")}</h3>
          <div className="general-info-grid">
            <div className="general-info-item">
              <label>{t("service.creation")}</label>
              <span>{new Date(serviceInfos.creation).toLocaleDateString()}</span>
            </div>
            <div className="general-info-item">
              <label>{t("service.expiration")}</label>
              <span className={isExpiringSoon(serviceInfos.expiration) ? "expiring" : ""}>
                {new Date(serviceInfos.expiration).toLocaleDateString()}
              </span>
            </div>
            <div className="general-info-item">
              <label>{t("service.autoRenew")}</label>
              <span className={`badge ${serviceInfos.renew?.automatic ? "success" : "warning"}`}>
                {serviceInfos.renew?.automatic ? "✓" : "✗"}
              </span>
            </div>
            <div className="general-info-item">
              <label>{t("service.contacts")}</label>
              <span>{serviceInfos.contactAdmin}</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default GeneralTab;
