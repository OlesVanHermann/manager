// ############################################################
// #  DEDICATED/GENERAL - COMPOSANT STRICTEMENT ISOLÉ         #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./GeneralTab.css                            #
// #  SERVICE LOCAL : ./GeneralTab.ts                         #
// ############################################################

import { useTranslation } from "react-i18next";
import type {
  DedicatedServer,
  DedicatedServerServiceInfos,
  DedicatedServerHardware,
} from "../../dedicated.types";
import "./GeneralTab.css";

// ============================================================
// Types LOCAUX à ce composant
// ============================================================
interface Props {
  serviceName: string;
  details?: DedicatedServer;
  serviceInfos?: DedicatedServerServiceInfos;
  hardware?: DedicatedServerHardware;
  loading: boolean;
}

// ============================================================
// Helpers LOCAUX - Dupliqués volontairement (défactorisation)
// NE JAMAIS importer depuis un autre tab
// ============================================================
const formatSize = (size: { value: number; unit: string } | undefined): string => {
  return size ? `${size.value} ${size.unit}` : "-";
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};

// ============================================================
// Composant Principal
// ============================================================
export function GeneralTab({ serviceName, details, serviceInfos, hardware, loading }: Props) {
  const { t } = useTranslation("bare-metal/dedicated/index");

  // État de chargement
  if (loading) {
    return (
      <div className="dedicated-general-tab">
        <div className="dedicated-general-loading">
          <div className="dedicated-general-skeleton" style={{ width: "60%" }} />
          <div className="dedicated-general-skeleton" style={{ width: "80%" }} />
          <div className="dedicated-general-skeleton" style={{ width: "40%" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="dedicated-general-tab">
      {/* Section Informations Générales */}
      <section className="dedicated-general-section">
        <h3>{t("general.title")}</h3>
        <div className="dedicated-general-info-grid">
          <div className="dedicated-general-info-item">
            <label>{t("general.name")}</label>
            <span className="mono">{serviceName}</span>
          </div>
          {details && (
            <>
              <div className="dedicated-general-info-item">
                <label>{t("general.ip")}</label>
                <span className="mono">{details.ip}</span>
              </div>
              <div className="dedicated-general-info-item">
                <label>{t("general.reverse")}</label>
                <span className="mono">{details.reverse}</span>
              </div>
              <div className="dedicated-general-info-item">
                <label>{t("general.datacenter")}</label>
                <span>{details.datacenter}</span>
              </div>
              <div className="dedicated-general-info-item">
                <label>{t("general.rack")}</label>
                <span>{details.rack}</span>
              </div>
              <div className="dedicated-general-info-item">
                <label>{t("general.commercialRange")}</label>
                <span>{details.commercialRange}</span>
              </div>
              <div className="dedicated-general-info-item">
                <label>{t("general.os")}</label>
                <span>{details.os}</span>
              </div>
              <div className="dedicated-general-info-item">
                <label>{t("general.state")}</label>
                <span className={`dedicated-general-badge ${details.state === "ok" ? "success" : "error"}`}>
                  {details.state}
                </span>
              </div>
              <div className="dedicated-general-info-item">
                <label>{t("general.power")}</label>
                <span className={`dedicated-general-badge ${details.powerState === "poweron" ? "success" : "error"}`}>
                  {details.powerState}
                </span>
              </div>
              <div className="dedicated-general-info-item">
                <label>{t("general.support")}</label>
                <span className="dedicated-general-badge info">{details.supportLevel}</span>
              </div>
              <div className="dedicated-general-info-item">
                <label>{t("general.monitoring")}</label>
                <span className={`dedicated-general-badge ${details.monitoring ? "success" : "inactive"}`}>
                  {details.monitoring ? "✓" : "✗"}
                </span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Section Hardware */}
      {hardware && (
        <section className="dedicated-general-section">
          <h3>{t("hardware.title")}</h3>
          <div className="dedicated-general-info-grid">
            <div className="dedicated-general-info-item">
              <label>{t("hardware.cpu")}</label>
              <span>{hardware.processorName}</span>
            </div>
            <div className="dedicated-general-info-item">
              <label>{t("hardware.cores")}</label>
              <span>
                {hardware.numberOfProcessors} x {hardware.coresPerProcessor} cores (
                {hardware.threadsPerProcessor} threads)
              </span>
            </div>
            <div className="dedicated-general-info-item">
              <label>{t("hardware.arch")}</label>
              <span>{hardware.processorArchitecture}</span>
            </div>
            <div className="dedicated-general-info-item">
              <label>{t("hardware.memory")}</label>
              <span>{formatSize(hardware.memorySize)}</span>
            </div>
            <div className="dedicated-general-info-item">
              <label>{t("hardware.motherboard")}</label>
              <span>{hardware.motherboard}</span>
            </div>
            <div className="dedicated-general-info-item">
              <label>{t("hardware.formFactor")}</label>
              <span>{hardware.formFactor}</span>
            </div>
            <div className="dedicated-general-info-item">
              <label>{t("hardware.bootMode")}</label>
              <span>{hardware.bootMode}</span>
            </div>
          </div>
          {hardware.diskGroups && hardware.diskGroups.length > 0 && (
            <div className="dedicated-general-disk-groups">
              <h4>{t("hardware.disks")}</h4>
              {hardware.diskGroups.map((dg, i) => (
                <div key={i} className="dedicated-general-disk-group">
                  <span className="dedicated-general-disk-count">{dg.numberOfDisks}x</span>
                  <span className="dedicated-general-disk-detail">
                    {dg.diskSize.value} {dg.diskSize.unit} {dg.diskType}
                  </span>
                  {dg.raidController && (
                    <span className="dedicated-general-disk-raid">RAID: {dg.raidController}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Section Service */}
      {serviceInfos && (
        <section className="dedicated-general-section">
          <h3>{t("service.title")}</h3>
          <div className="dedicated-general-info-grid">
            <div className="dedicated-general-info-item">
              <label>{t("service.creation")}</label>
              <span>{formatDate(serviceInfos.creation)}</span>
            </div>
            <div className="dedicated-general-info-item">
              <label>{t("service.expiration")}</label>
              <span>{formatDate(serviceInfos.expiration)}</span>
            </div>
            <div className="dedicated-general-info-item">
              <label>{t("service.autoRenew")}</label>
              <span className={`dedicated-general-badge ${serviceInfos.renew?.automatic ? "success" : "warning"}`}>
                {serviceInfos.renew?.automatic ? "✓" : "✗"}
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default GeneralTab;
